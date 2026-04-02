import type { RequestHandler } from './$types';
import { getAllArticles, getAllTags } from '$lib/notion/client';

export const GET: RequestHandler = async () => {
  const baseUrl = 'https://booksarecool.gr';
  
  try {
    const [articles, tags] = await Promise.all([
      getAllArticles(false), // Don't fetch relations for sitemap
      getAllTags()
    ]);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Reviews Page -->
  <url>
    <loc>${baseUrl}/reviews</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Tags Page -->
  <url>
    <loc>${baseUrl}/tags</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Individual Articles -->
  ${articles.map(article => `
  <url>
    <loc>${baseUrl}/${article.slug}</loc>
    <lastmod>${article.publishedAt || new Date(article.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  
  <!-- Tag Pages -->
  ${tags.map(tag => `
  <url>
    <loc>${baseUrl}/tags/${tag.toLowerCase().replace(/\s+/g, '-')}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  
  <!-- Review Pagination Pages -->
  ${(() => {
    const totalPages = Math.ceil(articles.length / 12);
    const paginationUrls = [];
    for (let page = 2; page <= totalPages; page++) {
      paginationUrls.push(`
  <url>
    <loc>${baseUrl}/reviews?page=${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`);
    }
    return paginationUrls.join('');
  })()}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
};