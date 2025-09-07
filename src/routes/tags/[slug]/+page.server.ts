import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getArticlesByTag } from '$lib/notion/client';

const ARTICLES_PER_PAGE = 12;

export const load: PageServerLoad = async ({ params, url }) => {
  const tagSlug = params.slug;
  
  try {
    console.log(`Loading tag page for slug: ${tagSlug}`);
    
    // Get page number from URL search params
    const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
    
    // Convert slug back to tag name for searching
    const tagName = tagSlug.replace(/-/g, ' ');
    
    // Get all articles for this tag
    const allArticles = await getArticlesByTag(tagSlug);
    
    if (allArticles.length === 0) {
      throw error(404, `No articles found for tag: ${tagName}`);
    }

    // Calculate pagination
    const totalArticles = allArticles.length;
    const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);
    const startIndex = (page - 1) * ARTICLES_PER_PAGE;
    const endIndex = startIndex + ARTICLES_PER_PAGE;
    
    // Get articles for current page
    const articles = allArticles.slice(startIndex, endIndex);

    // Get the actual tag name from the first article (for proper casing)
    const actualTagName = allArticles[0].tags?.find(tag => 
      tag.toLowerCase() === tagName.toLowerCase()
    ) || tagName;

    console.log(`Loaded tag page: ${actualTagName} with ${articles.length} articles on page ${page} of ${totalPages}`);

    return {
      tag: actualTagName,
      tagSlug,
      articles,
      articleCount: totalArticles,
      pagination: {
        currentPage: page,
        totalPages,
        totalArticles,
        articlesPerPage: ARTICLES_PER_PAGE,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  } catch (err) {
    console.error('Error loading tag page:', err);
    throw error(404, 'Tag not found');
  }
};