<script lang="ts">
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import type { Article } from '$lib/types';

	interface AuthorDetails {
		id: string;
		name: string;
		slug: string;
		description: string;
		image?: string | null;
		articleCount: number;
	}

	interface PageData {
		author: string;
		authorDetails: AuthorDetails;
		articles: Article[];
		articleCount: number;
	}

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
	title={`Συγγραφέας: ${data.author}`}
	description={data.authorDetails.description}
	url={`/authors/${data.authorDetails.slug}`}
	type="profile"
	image={data.authorDetails.image || undefined}
	author={data.author}
	keywords={`${data.author}, κριτικές βιβλίων, λογοτεχνική κριτική, συγγραφέας`}
	twitterCard="summary"
	breadcrumbs={[
		{ name: 'Αρχική', url: '/' },
		{ name: 'Κριτικές', url: '/reviews' },
		{ name: data.author, url: `/authors/${data.authorDetails.slug}` }
	]}
	{itemList}
	itemListName={`Βιβλία από ${data.author}`}
/>
<div class="shell">
	<header class="archive-heading author-heading">
		<div>
			<a href="/reviews" class="eyebrow">Η βιβλιοθήκη / Συγγραφείς</a>
			<h1>{data.author}</h1>
			<p>{data.authorDetails.description}</p>
			<div class="archive-meta">
				<span
					>{data.articleCount}
					{data.articleCount === 1 ? 'βιβλίο' : 'βιβλία'} στη βιβλιοθήκη μας</span
				>
			</div>
		</div>
		{#if data.authorDetails.image}<img
				class="author-portrait"
				src={data.authorDetails.image}
				alt={data.author}
			/>{:else}<span class="author-monogram" aria-hidden="true">{data.author.charAt(0)}</span>{/if}
	</header>
	<div class="section-heading">
		<div>
			<p class="eyebrow">Μέσα από τις σελίδες</p>
			<h2>Οι αναγνώσεις μας</h2>
		</div>
	</div>
	{#if data.articles.length}<div class="review-grid">
			{#each data.articles as article (article.id)}<ArticleCard {article} />{/each}
		</div>{:else}<div class="empty-state">
			<h2>Δεν υπάρχουν κριτικές ακόμα.</h2>
			<a class="button" href="/reviews">Εξερεύνησε τη βιβλιοθήκη</a>
		</div>{/if}
</div>

<style>
	.author-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 45px;
	}
	.author-heading > div {
		min-width: 0;
	}
	.author-portrait,
	.author-monogram {
		flex-shrink: 0;
		width: 180px;
		height: 220px;
		object-fit: cover;
	}
	.author-monogram {
		display: grid;
		place-items: center;
		background: var(--olive);
		color: var(--paper);
		font-family: var(--font-serif);
		font-size: 110px;
	}
	@media (max-width: 700px) {
		.author-heading {
			flex-direction: column-reverse;
			align-items: start;
			gap: 25px;
		}
		.author-portrait,
		.author-monogram {
			width: 95px;
			height: 115px;
			font-size: 65px;
		}
	}
</style>
