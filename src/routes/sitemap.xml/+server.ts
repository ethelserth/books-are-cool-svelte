import type { RequestHandler } from './$types';
import { getAllArticles } from '$lib/notion/client';
import { buildSitemap } from '$lib/seo/sitemap';

export const prerender = true;

export const GET: RequestHandler = async () =>
	new Response(buildSitemap(await getAllArticles()), {
		headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'max-age=3600' }
	});
