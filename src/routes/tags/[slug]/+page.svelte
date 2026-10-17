<script lang="ts">
	import TagArchive from '$lib/components/TagArchive.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import type { Article } from '$lib/types';

	interface PaginationData {
		currentPage: number;
		totalPages: number;
		totalArticles: number;
		articlesPerPage: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	}

	interface PageData {
		tag: string;
		tagSlug: string;
		articles: Article[];
		articleCount: number;
		pagination: PaginationData;
	}

	let { data }: { data: PageData } = $props();

	const pageSuffix = $derived(
		data.pagination.currentPage > 1 ? ` - Σελίδα ${data.pagination.currentPage}` : ''
	);
	const canonical = $derived(
		data.pagination.currentPage === 1
			? `/tags/${data.tagSlug}`
			: `/tags/${data.tagSlug}/${data.pagination.currentPage}`
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
	title={`Κατηγορία: ${data.tag}${pageSuffix}`}
	description={`Άρθρα με κατηγορία ${data.tag}. Ανακαλύψτε ${data.articleCount} κριτικές βιβλίων και λογοτεχνική ανάλυση - σελίδα ${data.pagination.currentPage} από ${data.pagination.totalPages}.`}
	url={canonical}
	type="collection"
	keywords={`${data.tag}, κριτικές βιβλίων, λογοτεχνική κριτική${data.pagination.currentPage > 1 ? `, σελίδα ${data.pagination.currentPage}` : ''}`}
	twitterCard="summary"
	breadcrumbs={[
		{ name: 'Αρχική', url: '/' },
		{ name: 'Κατηγορίες', url: '/tags' },
		{ name: data.tag, url: `/tags/${data.tagSlug}` }
	]}
	{itemList}
	itemListName={`Κατηγορία: ${data.tag}`}
/>

<svelte:head>
	{#if data.pagination.hasPreviousPage}
		<link
			rel="prev"
			href={data.pagination.currentPage === 2
				? `/tags/${data.tagSlug}`
				: `/tags/${data.tagSlug}/${data.pagination.currentPage - 1}`}
		/>
	{/if}
	{#if data.pagination.hasNextPage}
		<link rel="next" href={`/tags/${data.tagSlug}/${data.pagination.currentPage + 1}`} />
	{/if}
</svelte:head>

<TagArchive {...data} />
