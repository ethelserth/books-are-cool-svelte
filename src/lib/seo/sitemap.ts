import type { Article } from '$lib/types';

const SITE_URL = 'https://www.booksarecool.gr';
const PAGE_SIZE = 12;

function escapeXml(value: string): string {
	return value.replace(
		/[<>&"']/g,
		(character) =>
			({
				'<': '&lt;',
				'>': '&gt;',
				'&': '&amp;',
				'"': '&quot;',
				"'": '&apos;'
			})[character]!
	);
}

export function buildSitemap(articles: Article[]): string {
	const entries = new Map<string, string | undefined>();
	const add = (path: string, modified?: string) => {
		const date =
			modified && Number.isFinite(Date.parse(modified))
				? new Date(modified).toISOString()
				: undefined;
		entries.set(new URL(path, SITE_URL).href, date);
	};
	add('/');
	add('/reviews');
	add('/tags');
	const tagCounts = new Map<string, number>();
	for (const article of articles) {
		if (!article.slug) throw new Error('Published article is missing its slug');
		add(`/${encodeURIComponent(article.slug)}`, article.modifiedAt);
		if (article.authorSlug) add(`/authors/${encodeURIComponent(article.authorSlug)}`);
		const slugs = new Set(
			(article.tags || []).map((tag) => tag.toLowerCase().replace(/\s+/g, '-'))
		);
		for (const slug of slugs) tagCounts.set(slug, (tagCounts.get(slug) || 0) + 1);
	}
	for (let page = 2; page <= Math.ceil(articles.length / PAGE_SIZE); page++)
		add(`/reviews/${page}`);
	for (const [slug, count] of tagCounts) {
		const path = `/tags/${encodeURIComponent(slug)}`;
		add(path);
		for (let page = 2; page <= Math.ceil(count / PAGE_SIZE); page++) add(`${path}/${page}`);
	}
	// Omit lastmod unless the source supplies a real modification timestamp.
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...entries].map(([url, modified]) => `  <url><loc>${escapeXml(url)}</loc>${modified ? `<lastmod>${modified}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>`;
}
