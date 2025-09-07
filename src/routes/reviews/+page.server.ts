import type { PageServerLoad } from './$types';
import { getAllArticles } from '$lib/notion/client';

const ARTICLES_PER_PAGE = 12;

export const load: PageServerLoad = async ({ url }) => {
  try {
    console.log('Loading reviews page data...');
    
    // Get page number from URL search params
    const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1'));
    
    // Fetch all articles with relations
    const allArticles = await getAllArticles(true);
    
    // Calculate pagination
    const totalArticles = allArticles.length;
    const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);
    const startIndex = (page - 1) * ARTICLES_PER_PAGE;
    const endIndex = startIndex + ARTICLES_PER_PAGE;
    
    // Get articles for current page
    const articles = allArticles.slice(startIndex, endIndex);
    
    console.log(`Loaded page ${page} of reviews: ${articles.length} articles of ${totalArticles} total`);
    
    return {
      articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalArticles,
        articlesPerPage: ARTICLES_PER_PAGE,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  } catch (error) {
    console.error('Error loading reviews page:', error);
    return {
      articles: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalArticles: 0,
        articlesPerPage: ARTICLES_PER_PAGE,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
  }
};