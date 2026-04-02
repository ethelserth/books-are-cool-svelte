import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getArticlesByAuthor, getAuthorBySlug } from '$lib/notion/client';

export const prerender = true;

export const load: PageServerLoad = async ({ params }) => {
  const authorSlug = params.slug;
  
  try {
    console.log(`Loading author page for slug: ${authorSlug}`);
    
    const [articles, authorDetails] = await Promise.all([
      getArticlesByAuthor(authorSlug),
      getAuthorBySlug(authorSlug)
    ]);
    
    // If no author details and no articles, throw 404
    if (!authorDetails && articles.length === 0) {
      throw error(404, `No author found with slug: ${authorSlug}`);
    }
    
    // Use author details if available, otherwise derive from slug and articles
    let authorName = authorSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    let authorDescription = `Book reviews and literary criticism by ${authorName}`;
    
    if (authorDetails) {
      authorName = authorDetails.name;
      authorDescription = authorDetails.description || authorDescription;
    } else if (articles.length > 0) {
      // Use author name from first article if available
      authorName = articles[0].author;
      authorDescription = `Book reviews and literary criticism by ${authorName}`;
    }
    
    const finalAuthorDetails = authorDetails || {
      id: `author-${authorSlug}`,
      name: authorName,
      slug: authorSlug,
      description: authorDescription,
      image: null,
      articleCount: articles.length
    };
    
    console.log(`Loaded author page: ${authorName} with ${articles.length} articles`);
    
    return {
      author: authorName,
      authorDetails: finalAuthorDetails,
      articles,
      articleCount: articles.length
    };
  } catch (err) {
    console.error('Error loading author page:', err);
    throw error(404, 'Author not found');
  }
};