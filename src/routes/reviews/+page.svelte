<script lang="ts">
	import ReviewsArchive from '$lib/components/ReviewsArchive.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import type { Article } from '$lib/types';

	interface PageData {
		articles: Article[];
		pagination: {
			currentPage: number;
			totalPages: number;
			totalArticles: number;
			articlesPerPage: number;
			hasNextPage: boolean;
			hasPreviousPage: boolean;
		};
	}

	let { data }: { data: PageData } = $props();

	const pageSuffix = $derived(
		data.pagination.currentPage > 1 ? ` - Σελίδα ${data.pagination.currentPage}` : ''
	);
	const reviewsUrl = $derived(
		data.pagination.currentPage === 1 ? '/reviews' : `/reviews/${data.pagination.currentPage}`
	);
	const itemList = $derived(
		data.articles.map((article) => ({
			name: article.title,
			url: `/${article.slug}`,
			image: article.image
		}))
	);
</script>

<Meta
	title={`Όλες οι Κριτικές${pageSuffix}`}
	description={`Περιηγηθείτε σε όλες τις κριτικές βιβλίων και τη λογοτεχνική μας κριτική. Σύγχρονη πεζογραφία, κλασικά και αναδυόμενες φωνές - σελίδα ${data.pagination.currentPage} από ${data.pagination.totalPages}.`}
	url={reviewsUrl}
	type="collection"
	keywords={`κριτικές βιβλίων, λογοτεχνική κριτική, σύγχρονη πεζογραφία, προτάσεις βιβλίων, λογοτεχνία${data.pagination.currentPage > 1 ? `, σελίδα ${data.pagination.currentPage}` : ''}`}
	breadcrumbs={[
		{ name: 'Αρχική', url: '/' },
		{ name: 'Κριτικές', url: '/reviews' }
	]}
	{itemList}
	itemListName="Όλες οι Κριτικές"
/>

<svelte:head>
	{#if data.pagination.hasPreviousPage}
		<link
			rel="prev"
			href={data.pagination.currentPage === 2
				? '/reviews'
				: `/reviews/${data.pagination.currentPage - 1}`}
		/>
	{/if}
	{#if data.pagination.hasNextPage}
		<link rel="next" href={`/reviews/${data.pagination.currentPage + 1}`} />
	{/if}
</svelte:head>

<ReviewsArchive articles={data.articles} pagination={data.pagination} />
