import type { PageServerLoad } from './$types';
import { getRecentArticles, getFeaturedArticles } from '$lib/notion/client';

export const prerender = true;

export const load: PageServerLoad = async () => {
	console.log('Loading homepage data...');

	const [recentArticles, featuredArticles] = await Promise.all([
		getRecentArticles(12), // Get 12 recent articles for homepage
		getFeaturedArticles(4) // Get 4 featured articles (1 main + 3 sidebar)
	]);

	console.log(
		`Loaded homepage: ${recentArticles.length} recent articles, ${featuredArticles.length} featured articles`
	);

	return {
		articles: recentArticles,
		featuredArticles,
		totalArticles: recentArticles.length
	};
};
