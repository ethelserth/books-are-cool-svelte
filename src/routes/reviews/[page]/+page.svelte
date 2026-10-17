<script lang="ts">
	import ReviewsArchive from '$lib/components/ReviewsArchive.svelte';
	import type { PageData } from './$types';
	import Meta from '$lib/components/Meta.svelte';

	let { data }: { data: PageData } = $props();

	const itemList = $derived(
		data.articles.map((article) => ({
			name: article.title,
			url: `/${article.slug}`,
			image: article.image
		}))
	);
</script>

<Meta
	title={`Κριτικές Βιβλίων - Σελίδα ${data.pagination.currentPage}`}
	description={`Κριτικές βιβλίων και λογοτεχνική κριτική - Σελίδα ${data.pagination.currentPage} από ${data.pagination.totalPages}.`}
	url={`/reviews/${data.pagination.currentPage}`}
	type="collection"
	keywords={`κριτικές βιβλίων, λογοτεχνική κριτική, σελίδα ${data.pagination.currentPage}`}
	breadcrumbs={[
		{ name: 'Αρχική', url: '/' },
		{ name: 'Κριτικές', url: '/reviews' },
		{
			name: `Σελίδα ${data.pagination.currentPage}`,
			url: `/reviews/${data.pagination.currentPage}`
		}
	]}
	{itemList}
	itemListName={`Κριτικές - Σελίδα ${data.pagination.currentPage}`}
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
