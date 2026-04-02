import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllArticles } from '$lib/notion/client';

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('q')?.trim();
  const limit = parseInt(url.searchParams.get('limit') || '15');
  
  if (!query || query.length < 2) {
    return json({ results: [], query: '', count: 0 });
  }

  try {
    const allArticles = await getAllArticles(true);
    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 1);
    
    // Score articles based on search relevance
    const scoredArticles = allArticles.map(article => {
      let score = 0;
      
      searchTerms.forEach(term => {
        // Title matches get highest score
        if (article.title.toLowerCase().includes(term)) score += 10;
        // Author matches get high score
        if (article.author.toLowerCase().includes(term)) score += 8;
        // Tag matches get medium score
        if (article.tags?.some(tag => tag.toLowerCase().includes(term))) score += 6;
        // Category matches get medium score
        if (article.category.toLowerCase().includes(term)) score += 5;
        // Excerpt matches get lower score
        if (article.excerpt.toLowerCase().includes(term)) score += 3;
      });

      return { article, score };
    });

    // Filter and sort by relevance
    const results = scoredArticles
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.article);

    return json({
      results,
      query,
      count: results.length
    });
  } catch (error) {
    console.error('Search error:', error);
    return json({ results: [], query, count: 0 }, { status: 500 });
  }
};