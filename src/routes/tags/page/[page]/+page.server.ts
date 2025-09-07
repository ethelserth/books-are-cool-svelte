import type { PageServerLoad } from './$types';
import { getAllTags, getAllArticles } from '$lib/notion/client';
import { error } from '@sveltejs/kit';

const TAGS_PER_PAGE = 24;

export const prerender = true;

export const load: PageServerLoad = async ({ params }) => {
  try {
    console.log('Loading tags page data...');
    
    // Get page number from route params
    const page = Math.max(1, parseInt(params.page));
    
    // Validate that it's actually a number
    if (isNaN(page)) {
      throw error(404, 'Page not found');
    }
    
    const [tagNames, articles] = await Promise.all([
      getAllTags(),
      getAllArticles(true) // Fetch with relations to get tag data
    ]);

    // Count articles per tag
    const allTagCounts = tagNames.map(tagName => {
      const count = articles.filter(article =>
        article.tags?.includes(tagName)
      ).length;
      
      return {
        name: tagName,
        count,
        slug: tagName.toLowerCase().replace(/\s+/g, '-')
      };
    }).sort((a, b) => b.count - a.count); // Sort by count descending

    // Calculate pagination
    const totalTags = allTagCounts.length;
    const totalPages = Math.ceil(totalTags / TAGS_PER_PAGE);
    
    // Check if page exists
    if (page > totalPages && totalPages > 0) {
      throw error(404, 'Page not found');
    }
    
    const startIndex = (page - 1) * TAGS_PER_PAGE;
    const endIndex = startIndex + TAGS_PER_PAGE;
    
    // Get tags for current page
    const tags = allTagCounts.slice(startIndex, endIndex);

    console.log(`Loaded page ${page} of tags: ${tags.length} tags of ${totalTags} total`);

    return {
      tags,
      pagination: {
        currentPage: page,
        totalPages,
        totalTags,
        tagsPerPage: TAGS_PER_PAGE,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  } catch (err) {
    console.error('Error loading tags page:', err);
    throw error(500, 'Failed to load tags');
  }
};