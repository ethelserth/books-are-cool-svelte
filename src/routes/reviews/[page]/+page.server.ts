import type { PageServerLoad } from './$types';
import { getAllArticles } from '$lib/notion/client';
import { error } from '@sveltejs/kit';

const ARTICLES_PER_PAGE = 12;

export const prerender = true;

export const load: PageServerLoad = async ({ params }) => {
  try {
    console.log('Loading reviews page data...');
    
    // Get page number from route params
    const page = Math.max(1, parseInt(params.page));
    
    // Validate that it's actually a number
    if (isNaN(page)) {
      throw error(404, 'Page not found');
    }
    
    // Fetch all articles with relations
    const allArticles = await getAllArticles(true);
    
    // Calculate pagination
    const totalArticles = allArticles.length;
    const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);
    
    // Check if page exists
    if (page > totalPages && totalPages > 0) {
      throw error(404, 'Page not found');
    }
    
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
  } catch (err) {
    console.error('Error loading reviews page:', err);
    throw error(500, 'Failed to load reviews');
  }
};