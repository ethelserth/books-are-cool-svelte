import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getArticleBySlug, getRelatedArticles } from '$lib/notion/client';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const article = await getArticleBySlug(params.slug);
    
    if (!article) {
      throw error(404, 'Article not found');
    }

    // Get related articles with relations for better display
    const relatedArticles = await getRelatedArticles(article, 3);

    return {
      article,
      relatedArticles
    };
  } catch (err) {
    console.error('Error loading article:', err);
    throw error(404, 'Article not found');
  }
};