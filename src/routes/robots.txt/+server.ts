import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://booksarecool.gr/sitemap.xml

# Block access to admin or private areas if any exist
Disallow: /admin/
Disallow: /_app/
Disallow: /api/

# Crawl-delay (optional - adjust based on server capacity)
Crawl-delay: 1`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'max-age=86400'
    }
  });
};