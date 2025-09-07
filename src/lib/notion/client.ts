import { Client } from '@notionhq/client';
import { NOTION_API_KEY, NOTION_DATABASE_ID } from '$env/static/private';
import type { Article } from '$lib/types';
import type { TagPage } from '$lib/types';

// Initialize Notion client
const notion = new Client({
  auth: NOTION_API_KEY,
});

// Cache for relations to prevent duplicate API calls
const relationsCache = new Map<string, { name: string; slug?: string }>();
const authorsCache = new Map<string, any>();
const articlesCache = new Map<string, Article>();
const listingsCache = new Map<string, Article[]>();
const tagsCache = new Map<string, string[]>();

// Extract cover image from Notion page cover
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

// Extract icon from Notion page icon
function extractPageIcon(icon: any): string | null {
  if (!icon) return null;
  
  if (icon.type === 'file' && icon.file?.url) {
    return icon.file.url;
  }
  
  if (icon.type === 'external' && icon.external?.url) {
    return icon.external.url;
  }
  
  if (icon.type === 'emoji') {
    return null; // Can't use emoji as image URL
  }
  
  return null;
}

// Convert 10-based rating to 5-based rating
function convertRatingTo5Based(rating10: number): number {
  // Convert 10-based (0-10) to 5-based (0-5)
  return Math.round((rating10 / 10) * 5 * 2) / 2; // Allows for half stars
}

// Generate rating text based on 5-based rating
function generateRatingText(rating5: number): string {
  if (rating5 >= 4.5) return 'Outstanding';
  if (rating5 >= 4.0) return 'Excellent';
  if (rating5 >= 3.5) return 'Very Good';
  if (rating5 >= 3.0) return 'Good';
  if (rating5 >= 2.5) return 'Fair';
  if (rating5 >= 2.0) return 'Poor';
  return 'Terrible';
}

// Fast relation lookup - gets the name/title of a related page
async function getRelationName(relationId: string): Promise<{ name: string; slug?: string }> {
  // Check cache first
  if (relationsCache.has(relationId)) {
    return relationsCache.get(relationId)!;
  }

  try {
    const page = await notion.pages.retrieve({ page_id: relationId });
    
    let name = 'Unknown';
    let slug: string | undefined;
    
    if (page && 'properties' in page) {
      const properties = page.properties;
      
      // Common property names for titles
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
      
      // Try to get slug if available
      if (properties['Slug']) {
        slug = extractRichText(properties['Slug']);
      }
    }
    
    const result = { name, slug };
    
    // Cache the result
    relationsCache.set(relationId, result);
    
    return result;
  } catch (error) {
    console.error(`Error fetching relation ${relationId}:`, error);
    const fallback = { name: 'Unknown' };
    relationsCache.set(relationId, fallback);
    return fallback;
  }
}

// Enhanced transform function that fetches relation names
export async function transformNotionPageToArticle(page: any, includeContent: boolean = true, fetchRelations: boolean = true): Promise<Article> {
  const properties = page.properties;
  const pageId = page.id;

  // Get page content only if requested
  const content = includeContent ? await getPageContent(pageId) : '';
  
  // Extract cover image from page cover
  const coverImage = extractCoverImage(page.cover);

  // Get relation IDs
  const authorRelations = properties['Author']?.relation || [];
  const tagRelations = properties['Tags']?.relation || [];

  // Extract rating from Notion (10-based) and convert to 5-based
  const rating10 = extractNumber(properties['Rating']) || 0;
  const rating5 = rating10 > 0 ? convertRatingTo5Based(rating10) : 0;
  
  // Get rating text from Notion or generate based on rating
  const customRatingText = extractRichText(properties['Rating Text']);
  const finalRatingText = customRatingText || (rating5 > 0 ? generateRatingText(rating5) : 'Not Rated');

  // Base article object
  const article: Article = {
    id: pageId,
    title: extractTitle(properties['Post Title']),
    author: 'Author',
    category: 'Article',
    excerpt: extractRichText(properties['Description']),
    image: coverImage || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&crop=center',
    rating: rating5,
    ratingText: finalRatingText,
    date: extractDate(properties['Date']),
    publishedAt: extractDate(properties['Date']) + 'T10:00:00Z',
    slug: extractRichText(properties['Slug']),
    content: content,
    tags: [],
    readingTime: includeContent ? calculateReadingTime(content) : '5 min read',
    metaDescription: extractRichText(properties['Meta Description']),
    featured: extractCheckbox(properties['Featured']),
    authorRelationIds: authorRelations.map((r: any) => r.id),
    tagRelationIds: tagRelations.map((r: any) => r.id)
  };

  // Fetch relation names if requested and relations exist
  if (fetchRelations) {
    // Get first author name
    if (authorRelations.length > 0) {
      const authorInfo = await getRelationName(authorRelations[0].id);
      article.author = authorInfo.name;
      article.authorSlug = authorInfo.slug || `author-${authorRelations[0].id}`;
    }
    
    // Get first tag name  
    if (tagRelations.length > 0) {
      const tagInfo = await getRelationName(tagRelations[0].id);
      article.category = tagInfo.name;
      article.tags = [tagInfo.name];
    }
  }

  return article;
}

// Get all unique tags from articles
export async function getAllTags(): Promise<string[]> {
  const cacheKey = 'all-tags';
  
  // Check cache first
  if (tagsCache.has(cacheKey)) {
    console.log('Returning cached tags');
    return tagsCache.get(cacheKey)!;
  }

  try {
    console.log('Fetching all unique tags...');
    
    // Get all articles with relations to extract tags
    const allArticles = await getAllArticles(true);
    
    // Extract all unique tags
    const tagSet = new Set<string>();
    
    allArticles.forEach(article => {
      if (article.tags && article.tags.length > 0) {
        article.tags.forEach(tag => {
          if (tag && tag.trim()) {
            tagSet.add(tag.trim());
          }
        });
      }
    });
    
    const uniqueTags = Array.from(tagSet).sort();
    console.log(`Found ${uniqueTags.length} unique tags`);
    
    // Cache the result
    tagsCache.set(cacheKey, uniqueTags);
    
    return uniqueTags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// Get author by slug - fetch from notion pages
export async function getAuthorBySlug(slug: string): Promise<any | null> {
  // Check cache first
  if (authorsCache.has(slug)) {
    console.log(`Returning cached author for slug: ${slug}`);
    return authorsCache.get(slug);
  }

  try {
    console.log(`Searching for author with slug: ${slug}`);
    
    // Search through all relations to find author with matching slug
    // This is a workaround since we don't have a separate authors database
    const allArticles = await getAllArticles(false); // Don't fetch relations to avoid infinite loop
    
    // Get all unique author relation IDs
    const authorIds = new Set<string>();
    allArticles.forEach(article => {
      if (article.authorRelationIds) {
        article.authorRelationIds.forEach(id => authorIds.add(id));
      }
    });

    // Search through author pages to find matching slug
    for (const authorId of authorIds) {
      try {
        const page = await notion.pages.retrieve({ page_id: authorId });
        
        if (page && 'properties' in page) {
          const properties = page.properties;
          const authorSlug = extractRichText(properties['Slug']);
          
          if (authorSlug === slug) {
            // Found matching author
            const author = {
              id: page.id,
              name: extractTitle(properties['Name'] || properties['Title'] || properties['Author Name']),
              slug: authorSlug,
              description: extractRichText(properties['Description'] || properties['Bio']),
              image: extractPageIcon(page.icon) || extractCoverImage(page.cover),
              articleCount: 0 // Will be calculated separately
            };
            
            // Cache the result
            authorsCache.set(slug, author);
            console.log(`Found and cached author: ${author.name}`);
            
            return author;
          }
        }
      } catch (error) {
        console.error(`Error checking author ${authorId}:`, error);
        continue;
      }
    }
    
    console.log(`No author found for slug: ${slug}`);
    return null;
  } catch (error) {
    console.error(`Error fetching author for slug ${slug}:`, error);
    return null;
  }
}

// Fetch articles by author slug
export async function getArticlesByAuthor(authorSlug: string): Promise<Article[]> {
  try {
    console.log(`Fetching articles by author slug: ${authorSlug}`);
    
    // Get all articles with relations
    const allArticles = await getAllArticles(true);
    
    // Filter by author slug
    const authorArticles = allArticles.filter(article => 
      article.authorSlug === authorSlug
    );
    
    console.log(`Found ${authorArticles.length} articles by author: ${authorSlug}`);
    return authorArticles;
  } catch (error) {
    console.error('Error fetching articles by author:', error);
    return [];
  }
}

// Fetch articles by tag name
export async function getArticlesByTag(tagName: string): Promise<Article[]> {
  try {
    console.log(`Fetching articles by tag: ${tagName}`);
    
    const allArticles = await getAllArticles(true);
    
    // Convert slug back to potential tag name for searching
    const searchTerm = tagName.replace(/-/g, ' ');
    
    const taggedArticles = allArticles.filter(article => 
      article.tags?.some(tag => 
        tag.toLowerCase() === searchTerm.toLowerCase() ||
        tag.toLowerCase() === tagName.toLowerCase()
      )
    );
    
    console.log(`Found ${taggedArticles.length} articles for tag: ${tagName}`);
    return taggedArticles;
  } catch (error) {
    console.error('Error fetching articles by tag:', error);
    return [];
  }
}

// Fetch recent articles with relations
export async function getRecentArticles(limit: number = 12, fetchRelations: boolean = true): Promise<Article[]> {
  const cacheKey = `recent-${limit}-${fetchRelations}`;
  
  if (listingsCache.has(cacheKey)) {
    console.log(`Returning cached recent articles (${limit})`);
    return listingsCache.get(cacheKey)!;
  }

  try {
    console.log(`Fetching ${limit} recent articles from Notion...`);
    
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
      page_size: limit
    });

    console.log(`Got ${response.results.length} articles from Notion`);

    const articles: Article[] = [];
    
    for (const page of response.results) {
      try {
        const article = await transformNotionPageToArticle(page, false, fetchRelations);
        articles.push(article);
      } catch (error) {
        console.error(`Error processing page ${page.id}:`, error);
        continue;
      }
    }

    console.log(`Processed ${articles.length} articles, caching result`);
    
    listingsCache.set(cacheKey, articles);
    
    return articles;
  } catch (error) {
    console.error('Error fetching recent articles from Notion:', error);
    return [];
  }
}

// Fetch all published articles
export async function getAllArticles(fetchRelations: boolean = true): Promise<Article[]> {
  const cacheKey = `all-${fetchRelations}`;
  
  if (listingsCache.has(cacheKey)) {
    console.log('Returning cached all articles');
    return listingsCache.get(cacheKey)!;
  }

  try {
    const articles: Article[] = [];
    let hasMore = true;
    let startCursor: string | undefined = undefined;

    // Paginate through all results
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

      for (const page of response.results) {
        try {
          const article = await transformNotionPageToArticle(page, false, fetchRelations);
          articles.push(article);
        } catch (error) {
          console.error(`Error processing page ${page.id}:`, error);
          continue;
        }
      }

      hasMore = response.has_more;
      startCursor = response.next_cursor || undefined;
      
      console.log(`Fetched ${response.results.length} articles, total so far: ${articles.length}`);
    }

    console.log(`Finished fetching all articles: ${articles.length} total`);

    listingsCache.set(cacheKey, articles);
    
    return articles;
  } catch (error) {
    console.error('Error fetching articles from Notion:', error);
    return [];
  }
}

// Fetch featured articles with relations
export async function getFeaturedArticles(limit: number = 3): Promise<Article[]> {
  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'Publish',
            checkbox: {
              equals: true
            }
          },
          {
            property: 'Featured',
            checkbox: {
              equals: true
            }
          }
        ]
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending'
        }
      ],
      page_size: limit
    });

    const articles: Article[] = [];
    
    for (const page of response.results) {
      try {
        const article = await transformNotionPageToArticle(page, false, true);
        article.category = 'Featured'; // Override category for featured articles
        articles.push(article);
      } catch (error) {
        console.error(`Error processing page ${page.id}:`, error);
        continue;
      }
    }

    return articles;
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    return [];
  }
}

// Fetch single article by slug with full relations
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (articlesCache.has(slug)) {
    console.log(`Returning cached article for slug: ${slug}`);
    return articlesCache.get(slug)!;
  }

  try {
    console.log(`Fetching article from Notion for slug: ${slug}`);
    
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'Publish',
            checkbox: {
              equals: true
            }
          },
          {
            property: 'Slug',
            rich_text: {
              equals: slug
            }
          }
        ]
      }
    });

    if (response.results.length === 0) {
      console.log(`No article found for slug: ${slug}`);
      return null;
    }

    const page = response.results[0];
    console.log(`Found article, fetching full content and relations for: ${extractTitle(page.properties['Post Title'])}`);
    
    const article = await transformNotionPageToArticle(page, true, true);
    
    articlesCache.set(slug, article);
    console.log(`Cached article: ${article.title}`);
    
    return article;
  } catch (error) {
    console.error(`Error fetching article for slug ${slug}:`, error);
    return null;
  }
}

// Get related articles efficiently
export async function getRelatedArticles(currentArticle: Article, limit: number = 3): Promise<Article[]> {
  const cacheKey = `related-${currentArticle.id}-${limit}`;
  
  if (listingsCache.has(cacheKey)) {
    console.log(`Returning cached related articles for: ${currentArticle.title}`);
    return listingsCache.get(cacheKey)!;
  }

  try {
    console.log(`Finding related articles for: ${currentArticle.title}`);
    
    const recentArticles = await getRecentArticles(20, true);
    
    const related = recentArticles
      .filter(article => 
        article.id !== currentArticle.id &&
        article.slug !== currentArticle.slug
      )
      .slice(0, limit);
    
    console.log(`Found ${related.length} related articles`);
    
    listingsCache.set(cacheKey, related);
    
    return related;
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

export async function getAllAuthors(): Promise<any[]> {
  return [];
}

// Fetch page content (blocks) from Notion with nested block support
export async function getPageContent(pageId: string): Promise<string> {
  try {
    const blocks = await getAllBlocksRecursively(pageId);
    return convertBlocksToHtml(blocks);
  } catch (error) {
    console.error('Error fetching page content:', error);
    return '';
  }
}

// Recursively fetch all blocks including nested ones
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
        // Add the block itself
        blocks.push(block);
        
        // If block has children, fetch them recursively
        if (block.has_children) {
          const children = await getAllBlocksRecursively(block.id);
          // Add children property to the block for nested content handling
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

// Convert Notion blocks to HTML with nested content support
function convertBlocksToHtml(blocks: any[]): string {
  return blocks.map(block => convertBlockToHtml(block)).join('\n');
}

// Convert individual block to HTML, handling nested content
function convertBlockToHtml(block: any): string {
  switch (block.type) {
    case 'paragraph':
      let paragraphContent = extractTextFromRichText(block.paragraph.rich_text);
      if (block.children && block.children.length > 0) {
        paragraphContent += convertBlocksToHtml(block.children);
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
        bulletContent += '<ul>' + convertBlocksToHtml(block.children) + '</ul>';
      }
      return `<li>${bulletContent}</li>`;
      
    case 'numbered_list_item':
      let numberedContent = extractTextFromRichText(block.numbered_list_item.rich_text);
      if (block.children && block.children.length > 0) {
        numberedContent += '<ol>' + convertBlocksToHtml(block.children) + '</ol>';
      }
      return `<li>${numberedContent}</li>`;
      
    case 'quote':
      let quoteContent = extractTextFromRichText(block.quote.rich_text);
      // Handle nested content within blockquotes
      if (block.children && block.children.length > 0) {
        quoteContent += convertBlocksToHtml(block.children);
      }
      return `<blockquote class="bg-light-gray border-l-4 border-accent-red p-6 my-8 italic text-xl">${quoteContent}</blockquote>`;
      
    case 'divider':
      return `<hr class="my-8 border-border-light" />`;
      
    case 'image':
      const imageUrl = block.image.file?.url || block.image.external?.url;
      return `<img src="${imageUrl}" alt="Article image" class="w-full rounded-lg my-8" />`;
      
    default:
      // Handle unknown block types that might have children
      if (block.children && block.children.length > 0) {
        return convertBlocksToHtml(block.children);
      }
      return '';
  }
}

// Helper functions to extract data from Notion properties
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
  return `${readingTime} min read`;
}