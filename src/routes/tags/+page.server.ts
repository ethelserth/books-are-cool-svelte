import type { PageServerLoad } from './$types';
import { getAllTags, getAllArticles } from '$lib/notion/client';

export const prerender = true;

export const load: PageServerLoad = async () => {
	console.log('Loading tags page data...');

	const [tagNames, articles] = await Promise.all([
		getAllTags(),
		getAllArticles(true) // Fetch with relations to get tag data
	]);

	// Count articles per tag
	const tags = tagNames
		.map((tagName) => {
			const count = articles.filter((article) => article.tags?.includes(tagName)).length;

			return {
				name: tagName,
				count,
				slug: tagName.toLowerCase().replace(/\s+/g, '-')
			};
		})
		.sort((a, b) => b.count - a.count); // Sort by count descending

	console.log(`Loaded ${tags.length} tags`);

	return {
		tags,
		totalTags: tags.length
	};
};
