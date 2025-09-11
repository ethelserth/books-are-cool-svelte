import type { PageServerLoad } from './$types';
import { getRecentArticles, getFeaturedArticles } from '$lib/notion/client';

export const prerender = true;

export const load: PageServerLoad = async () => {
  try {
    console.log('Loading homepage data...');
    
    const [recentArticles, featuredArticles] = await Promise.all([
      getRecentArticles(6), // Get 6 recent articles for homepage
      getFeaturedArticles(4) // Get 4 featured articles (1 main + 3 sidebar)
    ]);
    
    console.log(`Loaded homepage: ${recentArticles.length} recent articles, ${featuredArticles.length} featured articles`);
    
    return {
      articles: recentArticles,
      featuredArticles,
      totalArticles: recentArticles.length
    };
  } catch (error) {
    console.error('Error loading homepage:', error);
    return {
      articles: [],
      featuredArticles: [],
      totalArticles: 0
    };
  }
};