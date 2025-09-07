import type { PageServerLoad } from './$types';
import { getRecentArticles, getFeaturedArticles } from '$lib/notion/client';

export const prerender = true;


export const load: PageServerLoad = async () => {
  try {
    console.log('Loading homepage data...');
    
    // Fetch with relations for better display (author names, category names)
    const [recentArticles, featuredArticles] = await Promise.all([
      getRecentArticles(12, true), // Fetch relations for listing display
      getFeaturedArticles(3)
    ]);
    
    console.log(`Loaded ${recentArticles.length} recent articles and ${featuredArticles.length} featured articles`);
    
    return {
      articles: recentArticles,
      featuredArticles: featuredArticles,
      totalArticles: recentArticles.length
    };
  } catch (error) {
    console.error('Error loading homepage data:', error);
    return {
      articles: [],
      featuredArticles: [],
      totalArticles: 0
    };
  }
};