import type { PageServerLoad } from './$types';
import { getAllTags, getAllArticles } from '$lib/notion/client';

export const load: PageServerLoad = async () => {
  try {
    console.log('Loading tags page data...');
    
    const [tagNames, articles] = await Promise.all([
      getAllTags(),
      getAllArticles(true) // Fetch with relations to get tag data
    ]);

    // Count articles per tag
    const tagCounts = tagNames.map(tagName => {
      const count = articles.filter(article =>
        article.tags?.includes(tagName)
      ).length;
      
      return {
        name: tagName,
        count,
        slug: tagName.toLowerCase().replace(/\s+/g, '-')
      };
    }).sort((a, b) => b.count - a.count); // Sort by count descending

    console.log(`Loaded ${tagCounts.length} tags with article counts`);

    return {
      tags: tagCounts,
      totalTags: tagNames.length
    };
  } catch (error) {
    console.error('Error loading tags page:', error);
    return {
      tags: [],
      totalTags: 0
    };
  }
};