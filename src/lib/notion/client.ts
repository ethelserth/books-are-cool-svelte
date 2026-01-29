import { Client } from '@notionhq/client';
import { NOTION_API_KEY, NOTION_DATABASE_ID } from '$env/static/private';
import type { Article } from '$lib/types';
import { processImage } from './images';

// Initialize Notion client
const notion = new Client({
  auth: NOTION_API_KEY,
});

// GLOBAL BUILD-TIME CACHE - Single source of truth
let GLOBAL_BUILD_CACHE: {
  allArticles?: Article[];
  allTags?: string[];
  articlesWithContent?: Map<string, Article>;
  initialized?: boolean;
} = {
  articlesWithContent: new Map()
};

// Cache for relations to prevent duplicate API calls
const relationsCache = new Map<string, { name: string; slug?: string }>();
const authorsCache = new Map<string, any>();

// OPTIMIZATION: Initialize all data once at build start with author pre-caching
export async function initializeBuildCache(): Promise<void> {
  if (GLOBAL_BUILD_CACHE.initialized) {
    console.log('Build cache already initialized, skipping...');
    return;
  }

  console.log('Initializing build cache...');
  const startTime = Date.now();

  try {
    // Fetch ALL data once with parallel processing
    const allArticles = await fetchAllArticlesFromNotion();
    const allTags = extractAllTagsFromArticles(allArticles);

    // Pre-cache all author details
    console.log('Pre-caching author details...');
    const authorIds = new Set<string>();

    // Collect all unique author relation IDs
    allArticles.forEach(article => {
      if (article.authorRelationIds) {
        article.authorRelationIds.forEach(id => authorIds.add(id));
      }
    });

    // Fetch all author details in parallel with concurrency limit
    const authorIdsArray = Array.from(authorIds);
    const authorConcurrency = 5;
    const authorPromises = [];

    for (let i = 0; i < authorIdsArray.length; i += authorConcurrency) {
      const chunk = authorIdsArray.slice(i, i + authorConcurrency);
      const chunkPromises = chunk.map(async (authorId) => {
        try {
          const page = await notion.pages.retrieve({ page_id: authorId });
          if (page && 'properties' in page) {
            const properties = page.properties;
            const authorSlug = extractRichText(properties['Slug']);

            if (authorSlug) {
              // Process author image
              const rawImage = extractPageIcon(page.icon) || extractCoverImage(page.cover);
              let processedImage = null;
              if (rawImage) {
                const processed = await processImage(rawImage, page.id);
                processedImage = processed.src;
              }

              const author = {
                id: page.id,
                name: extractTitle(properties['Name'] || properties['Title'] || properties['Author Name']),
                slug: authorSlug,
                description: extractRichText(properties['Description'] || properties['Bio']),
                image: processedImage,
                articleCount: 0
              };

              authorsCache.set(authorSlug, author);
              return author;
            }
          }
        } catch (error) {
          console.error(`Error pre-caching author ${authorId}:`, error);
        }
        return null;
      });
      authorPromises.push(...chunkPromises);
      // Wait for chunk to finish before next
      await Promise.all(chunkPromises);
    }

    console.log(`Pre-cached ${authorsCache.size} authors`);

    GLOBAL_BUILD_CACHE = {
      allArticles,
      allTags,
      articlesWithContent: new Map(),
      initialized: true
    };

    const duration = Date.now() - startTime;
    console.log(`Build cache initialized in ${duration}ms - ${allArticles.length} articles, ${allTags.length} tags, ${authorsCache.size} authors`);
  } catch (error) {
    console.error('Failed to initialize build cache:', error);
    throw error;
  }
}

// OPTIMIZATION: Fetch all articles from Notion ONCE with parallel processing
async function fetchAllArticlesFromNotion(): Promise<Article[]> {
  const articles: Article[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;

  while (hasMore) {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        property: 'Publish',
        checkbox: {
          equals: true
        }
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending'
        }
      ],
      start_cursor: startCursor,
      page_size: 100
    });

    // Process pages with concurrency limit to prevent ECONNRESET
    const concurrency = 5;
    const processedPages = [];

    for (let i = 0; i < response.results.length; i += concurrency) {
      const chunk = response.results.slice(i, i + concurrency);
      const chunkPromises = chunk.map(async (page) => {
        try {
          // We only process the main article metadata here
          return await transformNotionPageToArticle(page, false, true);
        } catch (error) {
          console.error(`Error processing page ${page.id}:`, error);
          return null;
        }
      });

      const chunkResults = await Promise.all(chunkPromises);
      processedPages.push(...chunkResults);
    }
    articles.push(...processedPages.filter(Boolean) as Article[]);

    hasMore = response.has_more;
    startCursor = response.next_cursor || undefined;

    console.log(`Fetched ${response.results.length} articles, total so far: ${articles.length}`);
  }

  return articles;
}

// OPTIMIZATION: Extract tags from articles instead of separate API calls
function extractAllTagsFromArticles(articles: Article[]): string[] {
  const tagSet = new Set<string>();

  articles.forEach(article => {
    if (article.tags && article.tags.length > 0) {
      article.tags.forEach(tag => {
        if (tag && tag.trim()) {
          tagSet.add(tag.trim());
        }
      });
    }
  });

  return Array.from(tagSet).sort();
}

// OPTIMIZED: Get all articles from cache
export async function getAllArticles(fetchRelations: boolean = true): Promise<Article[]> {
  await initializeBuildCache();

  if (!GLOBAL_BUILD_CACHE.allArticles) {
    throw new Error('Build cache not properly initialized');
  }

  console.log(`Returning ${GLOBAL_BUILD_CACHE.allArticles.length} cached articles`);
  return GLOBAL_BUILD_CACHE.allArticles;
}

// OPTIMIZED: Get all tags from cache
export async function getAllTags(): Promise<string[]> {
  await initializeBuildCache();

  if (!GLOBAL_BUILD_CACHE.allTags) {
    throw new Error('Build cache not properly initialized');
  }

  console.log(`Returning ${GLOBAL_BUILD_CACHE.allTags.length} cached tags`);
  return GLOBAL_BUILD_CACHE.allTags;
}

// OPTIMIZED: Get recent articles from cache (no additional API call)
export async function getRecentArticles(limit: number = 12): Promise<Article[]> {
  const allArticles = await getAllArticles(true);
  return allArticles.slice(0, limit);
}

// OPTIMIZED: Get articles by tag from cache (no additional API call)
export async function getArticlesByTag(tagName: string): Promise<Article[]> {
  const allArticles = await getAllArticles(true);
  const searchTerm = tagName.replace(/-/g, ' ');

  const taggedArticles = allArticles.filter(article =>
    article.tags?.some(tag =>
      tag.toLowerCase() === searchTerm.toLowerCase() ||
      tag.toLowerCase() === tagName.toLowerCase()
    )
  );

  console.log(`Found ${taggedArticles.length} articles for tag: ${tagName}`);
  return taggedArticles;
}

// OPTIMIZED: Get articles by author from cache (no additional API call)
export async function getArticlesByAuthor(authorSlug: string): Promise<Article[]> {
  const allArticles = await getAllArticles(true);
  const authorArticles = allArticles.filter(article => article.authorSlug === authorSlug);
  console.log(`Found ${authorArticles.length} articles by author: ${authorSlug}`);
  return authorArticles;
}

// OPTIMIZED: Get related articles from cache (no additional API call)
export async function getRelatedArticles(currentArticle: Article, limit: number = 3): Promise<Article[]> {
  const allArticles = await getAllArticles(true);

  // Filter out current article
  const availableArticles = allArticles.filter(article =>
    article.id !== currentArticle.id && article.slug !== currentArticle.slug
  );

  // Priority 1: Same author articles
  const sameAuthorArticles = availableArticles
    .filter(article => article.authorSlug === currentArticle.authorSlug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Priority 2: Same tag/category articles
  const sameTagArticles = availableArticles
    .filter(article =>
      article.authorSlug !== currentArticle.authorSlug && // Exclude already selected same author articles
      (article.category === currentArticle.category ||
        article.tags?.some(tag => currentArticle.tags?.includes(tag)))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Priority 3: Other recent articles
  const otherArticles = availableArticles
    .filter(article =>
      article.authorSlug !== currentArticle.authorSlug &&
      article.category !== currentArticle.category &&
      !article.tags?.some(tag => currentArticle.tags?.includes(tag))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Combine articles in priority order
  const relatedArticles = [
    ...sameAuthorArticles,
    ...sameTagArticles,
    ...otherArticles
  ].slice(0, limit);

  console.log(`Found ${relatedArticles.length} related articles for ${currentArticle.title}`);
  return relatedArticles;
}

// OPTIMIZED: Get single article with smart content caching
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  await initializeBuildCache();

  // Check if we have article with content cached
  if (GLOBAL_BUILD_CACHE.articlesWithContent?.has(slug)) {
    console.log(`Returning cached article with content for slug: ${slug}`);
    return GLOBAL_BUILD_CACHE.articlesWithContent.get(slug)!;
  }

  // Check if we have the article in the main cache (without content)
  const allArticles = await getAllArticles(true);
  const article = allArticles.find(a => a.slug === slug);

  if (!article) {
    console.log(`No article found for slug: ${slug}`);
    return null;
  }

  // Article exists, fetch content
  console.log(`Fetching content for article: ${article.title}`);
  try {
    const content = await getPageContent(article.id);
    const articleWithContent = {
      ...article,
      content,
      readingTime: calculateReadingTime(content)
    };

    // Cache article with content
    GLOBAL_BUILD_CACHE.articlesWithContent?.set(slug, articleWithContent);
    console.log(`Cached article with content: ${article.title}`);

    return articleWithContent;
  } catch (error) {
    console.error(`Error fetching content for ${slug}:`, error);
    return article; // Return without content if fetch fails
  }
}

// OPTIMIZED: Get author from pre-cached data (no API calls)
export async function getAuthorBySlug(slug: string): Promise<any | null> {
  await initializeBuildCache();

  if (authorsCache.has(slug)) {
    console.log(`Returning cached author for slug: ${slug}`);
    return authorsCache.get(slug);
  }

  console.log(`No cached author found for slug: ${slug}`);
  return null;
}

// OPTIMIZED: Get featured articles from cache
export async function getFeaturedArticles(limit: number = 3): Promise<Article[]> {
  const allArticles = await getAllArticles(true);
  const featuredArticles = allArticles.filter(article => article.featured).slice(0, limit);

  // Override category for featured articles
  return featuredArticles.map(article => ({
    ...article,
    category: 'Featured'
  }));
}

// Fast relation lookup with caching
async function getRelationName(relationId: string): Promise<{ name: string; slug?: string }> {
  if (relationsCache.has(relationId)) {
    return relationsCache.get(relationId)!;
  }

  try {
    const page = await notion.pages.retrieve({ page_id: relationId });

    let name = 'Unknown';
    let slug: string | undefined;

    if (page && 'properties' in page) {
      const properties = page.properties;

      const titleProps = ['Name', 'Title', 'Post Title', 'Tag Name', 'Author Name'];

      for (const propName of titleProps) {
        if (properties[propName]) {
          const extracted = extractTitle(properties[propName]);
          if (extracted) {
            name = extracted;
            break;
          }
        }
      }

      if (properties['Slug']) {
        slug = extractRichText(properties['Slug']);
      }
    }

    const result = { name, slug };
    relationsCache.set(relationId, result);
    return result;
  } catch (error) {
    console.error(`Error fetching relation ${relationId}:`, error);
    const fallback = { name: 'Unknown' };
    relationsCache.set(relationId, fallback);
    return fallback;
  }
}

// Enhanced transform function with parallel relation fetching
export async function transformNotionPageToArticle(page: any, includeContent: boolean = true, fetchRelations: boolean = true): Promise<Article> {
  const properties = page.properties;
  const pageId = page.id;

  const content = includeContent ? await getPageContent(pageId) : '';
  const rawCoverImage = extractCoverImage(page.cover);

  // Process Cover Image
  let processedCoverImage = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&crop=center';
  if (rawCoverImage) {
    const processed = await processImage(rawCoverImage, pageId);
    processedCoverImage = processed.src;
  }

  const authorRelations = properties['Author']?.relation || [];
  const tagRelations = properties['Tags']?.relation || [];

  const rating10 = extractNumber(properties['Rating']) || 0;
  const rating5 = rating10 > 0 ? convertRatingTo5Based(rating10) : 0;

  const customRatingText = extractRichText(properties['Rating Text']);
  const finalRatingText = customRatingText || (rating5 > 0 ? generateRatingText(rating5) : 'Not Rated');

  const article: Article = {
    id: pageId,
    title: extractTitle(properties['Post Title']),
    author: 'Author',
    category: 'Article',
    excerpt: extractRichText(properties['Description']),
    image: processedCoverImage,
    rating: rating5,
    ratingText: finalRatingText,
    date: extractDate(properties['Date']),
    publishedAt: extractDate(properties['Date']) + 'T10:00:00Z',
    slug: extractRichText(properties['Slug']),
    content: content,
    tags: [],
    readingTime: includeContent ? calculateReadingTime(content) : '5 λεπτά',
    metaDescription: extractRichText(properties['Meta Description']),
    featured: extractCheckbox(properties['Featured']),
    authorRelationIds: authorRelations.map((r: any) => r.id),
    tagRelationIds: tagRelations.map((r: any) => r.id)
  };

  if (fetchRelations) {
    // Batch relation lookups for better performance
    const relationPromises: Promise<any>[] = [];

    if (authorRelations.length > 0) {
      relationPromises.push(getRelationName(authorRelations[0].id));
    }

    if (tagRelations.length > 0) {
      relationPromises.push(getRelationName(tagRelations[0].id));
    }

    const relations = await Promise.all(relationPromises);

    if (authorRelations.length > 0 && relations[0]) {
      article.author = relations[0].name;
      article.authorSlug = relations[0].slug || `author-${authorRelations[0].id}`;
    }

    if (tagRelations.length > 0) {
      const tagIndex = authorRelations.length > 0 ? 1 : 0;
      if (relations[tagIndex]) {
        article.category = relations[tagIndex].name;
        article.tags = [relations[tagIndex].name];
      }
    }
  }

  return article;
}

// Helper functions remain the same...
function extractCoverImage(cover: any): string | null {
  if (!cover) return null;

  if (cover.type === 'file' && cover.file?.url) {
    return cover.file.url;
  }

  if (cover.type === 'external' && cover.external?.url) {
    return cover.external.url;
  }

  return null;
}

function extractPageIcon(icon: any): string | null {
  if (!icon) return null;

  if (icon.type === 'file' && icon.file?.url) {
    return icon.file.url;
  }

  if (icon.type === 'external' && icon.external?.url) {
    return icon.external.url;
  }

  if (icon.type === 'emoji') {
    return null;
  }

  return null;
}

function convertRatingTo5Based(rating10: number): number {
  return Math.round((rating10 / 10) * 5 * 2) / 2;
}

function generateRatingText(rating5: number): string {
  if (rating5 >= 4.5) return 'Outstanding';
  if (rating5 >= 4.0) return 'Excellent';
  if (rating5 >= 3.5) return 'Very Good';
  if (rating5 >= 3.0) return 'Good';
  if (rating5 >= 2.5) return 'Fair';
  if (rating5 >= 2.0) return 'Poor';
  return 'Terrible';
}

export async function getAllAuthors(): Promise<any[]> {
  return [];
}

export async function getPageContent(pageId: string): Promise<string> {
  try {
    const blocks = await getAllBlocksRecursively(pageId);
    return await convertBlocksToHtml(blocks);
  } catch (error) {
    console.error('Error fetching page content:', error);
    return '';
  }
}

async function getAllBlocksRecursively(blockId: string): Promise<any[]> {
  const blocks: any[] = [];

  try {
    let hasMore = true;
    let startCursor: string | undefined = undefined;

    while (hasMore) {
      const response = await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: startCursor,
        page_size: 100
      });

      for (const block of response.results) {
        blocks.push(block);

        if (block.has_children) {
          const children = await getAllBlocksRecursively(block.id);
          block.children = children;
        }
      }

      hasMore = response.has_more;
      startCursor = response.next_cursor || undefined;
    }
  } catch (error) {
    console.error(`Error fetching blocks for ${blockId}:`, error);
  }

  return blocks;
}

async function convertBlocksToHtml(blocks: any[]): Promise<string> {
  const htmlPromises = blocks.map(block => convertBlockToHtml(block));
  const htmlParts = await Promise.all(htmlPromises);
  return htmlParts.join('\n');
}

async function convertBlockToHtml(block: any): Promise<string> {
  switch (block.type) {
    case 'paragraph':
      let paragraphContent = extractTextFromRichText(block.paragraph.rich_text);
      if (block.children && block.children.length > 0) {
        paragraphContent += await convertBlocksToHtml(block.children);
      }
      return `<p>${paragraphContent}</p>`;

    case 'heading_1':
      return `<h1>${extractTextFromRichText(block.heading_1.rich_text)}</h1>`;

    case 'heading_2':
      return `<h2>${extractTextFromRichText(block.heading_2.rich_text)}</h2>`;

    case 'heading_3':
      return `<h3>${extractTextFromRichText(block.heading_3.rich_text)}</h3>`;

    case 'bulleted_list_item':
      let bulletContent = extractTextFromRichText(block.bulleted_list_item.rich_text);
      if (block.children && block.children.length > 0) {
        bulletContent += '<ul>' + await convertBlocksToHtml(block.children) + '</ul>';
      }
      return `<li>${bulletContent}</li>`;

    case 'numbered_list_item':
      let numberedContent = extractTextFromRichText(block.numbered_list_item.rich_text);
      if (block.children && block.children.length > 0) {
        numberedContent += '<ol>' + await convertBlocksToHtml(block.children) + '</ol>';
      }
      return `<li>${numberedContent}</li>`;

    case 'quote':
      let quoteContent = extractTextFromRichText(block.quote.rich_text);
      if (block.children && block.children.length > 0) {
        quoteContent += await convertBlocksToHtml(block.children);
      }
      return `<blockquote class="bg-light-gray border-l-4 border-accent-red p-6 my-8 italic text-xl">${quoteContent}</blockquote>`;

    case 'divider':
      return `<hr class="my-8 border-border-light" />`;

    case 'image':
      const imageUrl = block.image.file?.url || block.image.external?.url;
      if (imageUrl) {
        // Process content image
        try {
          const processed = await processImage(imageUrl, block.id);
          return `<img src="${processed.src}" width="${processed.width}" height="${processed.height}" alt="Article image" class="w-full rounded-lg my-8" loading="lazy" />`;
        } catch (e) {
          console.error(`Failed to process image block ${block.id}`, e);
          // Fallback
          return `<img src="${imageUrl}" alt="Article image" class="w-full rounded-lg my-8" />`;
        }
      }
      return '';

    default:
      if (block.children && block.children.length > 0) {
        return await convertBlocksToHtml(block.children);
      }
      return '';
  }
}

function extractTitle(property: any): string {
  return property?.title?.[0]?.plain_text || '';
}

function extractRichText(property: any): string {
  return property?.rich_text?.[0]?.plain_text || '';
}

function extractNumber(property: any): number | null {
  return property?.number || null;
}

function extractUrl(property: any): string {
  return property?.url || '';
}

function extractIcon(property: any): string | null {
  if (!property?.files || property.files.length === 0) return null;
  const file = property.files[0];
  return file.file?.url || file.external?.url || null;
}

function extractDate(property: any): string {
  return property?.date?.start || new Date().toISOString().split('T')[0];
}

function extractCheckbox(property: any): boolean {
  return property?.checkbox || false;
}

function extractTextFromRichText(richText: any[]): string {
  if (!richText || richText.length === 0) return '';

  return richText.map(text => {
    let content = text.plain_text;

    if (text.annotations?.bold) content = `<strong>${content}</strong>`;
    if (text.annotations?.italic) content = `<em>${content}</em>`;
    if (text.annotations?.code) content = `<code>${content}</code>`;
    if (text.href) content = `<a href="${text.href}" target="_blank">${content}</a>`;

    return content;
  }).join('');
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} λεπτά`;
}