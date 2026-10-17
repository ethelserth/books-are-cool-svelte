<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { Share2, ArrowUpRight, ArrowLeft, Clock } from 'lucide-svelte';
	import StarRating from '$lib/components/StarRating.svelte';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import type { ArticlePageData } from '$lib/types';
	let { data }: { data: ArticlePageData } = $props();
	let shareStatus = $state('');
	const categoryUrl = $derived(
		data.article.tags?.some((tag) => tag.toLowerCase() === data.article.category.toLowerCase())
			? `/tags/${createTagSlug(data.article.category)}`
			: '/tags'
	);
	afterNavigate(() => {
		shareStatus = '';
	});
	function formatDateLong(value: string) {
		return new Date(value).toLocaleDateString('el-GR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
	function createTagSlug(tag: string) {
		return tag.toLowerCase().replace(/\s+/g, '-');
	}
	async function shareArticle() {
		try {
			if (navigator.share)
				await navigator.share({
					title: data.article.title,
					text: data.article.excerpt,
					url: window.location.href
				});
			else {
				await navigator.clipboard.writeText(window.location.href);
				shareStatus = 'Ο σύνδεσμος αντιγράφηκε.';
			}
		} catch (error) {
			if (!(error instanceof DOMException && error.name === 'AbortError'))
				shareStatus = 'Αντίγραψε τον σύνδεσμο από τη γραμμή διευθύνσεων.';
		}
	}
</script>

<Meta
	title={data.article.title}
	description={data.article.metaDescription || data.article.excerpt}
	url="/{data.article.slug}"
	type="article"
	image={data.article.image}
	author={data.article.author}
	publishedTime={data.article.publishedAt || data.article.date + 'T10:00:00Z'}
	modifiedTime={data.article.modifiedAt}
	tags={data.article.tags}
	rating={data.article.rating}
	ratingText={data.article.ratingText}
	keywords={data.article.tags?.join(', ')}
	breadcrumbs={[
		{ name: 'Αρχική', url: '/' },
		{ name: 'Κριτικές', url: '/reviews' },
		{ name: data.article.title, url: `/${data.article.slug}` }
	]}
/>

<div class="shell">
	<nav class="breadcrumbs" aria-label="Breadcrumb">
		<a href="/">Αρχική</a><span>/</span><a href="/reviews">Κριτικές</a><span>/</span><span
			aria-current="page">{data.article.title}</span
		>
	</nav>
	<header class="article-hero">
		<div class="article-intro">
			<a class="eyebrow category" href={categoryUrl}
				>{data.article.category} <ArrowUpRight size={13} /></a
			>
			<h1>{data.article.title}</h1>
			<p class="book-author">
				{#if data.article.authorSlug}<a href="/authors/{data.article.authorSlug}"
						>{data.article.author}</a
					>{:else}{data.article.author}{/if}
			</p>
			<p class="intro-excerpt">{data.article.excerpt}</p>
			<StarRating
				rating={data.article.rating}
				size="large"
				showText
				ratingText={data.article.ratingText}
			/>
			<div class="article-meta">
				<time datetime={data.article.date}>{formatDateLong(data.article.date)}</time
				>{#if data.article.readingTime}<span><Clock size={13} />{data.article.readingTime}</span
					>{/if}
			</div>
		</div>
		<div class="hero-cover">
			<img src={data.article.image} alt={data.article.title} fetchpriority="high" />
		</div>
	</header>
	<div class="reading-layout">
		<aside class="reading-aside">
			<span class="eyebrow">Στις σελίδες του βιβλίου</span>
			<p>Μια πιο προσεκτική ματιά.</p>
			<button class="text-link" onclick={shareArticle}
				><Share2 size={15} />Κοινοποίηση κριτικής</button
			><span class="share-status" role="status">{shareStatus}</span><a
				href="/reviews"
				class="text-link"><ArrowLeft size={15} />Όλες οι κριτικές</a
			>
		</aside>
		<article class="article-content" aria-label="Κριτική βιβλίου">
			{@html data.article.content || '<p>Δεν υπάρχει διαθέσιμο περιεχόμενο.</p>'}
			{#if data.article.tags?.length}<div class="article-tags">
					{#each data.article.tags as tag}<a href="/tags/{createTagSlug(tag)}"
							>{tag} <ArrowUpRight size={12} /></a
						>{/each}
				</div>{/if}
		</article>
	</div>
	{#if data.relatedArticles?.length}<section class="related">
			<div class="section-heading">
				<div>
					<p class="eyebrow">Η ανάγνωση συνεχίζεται</p>
					<h2>Ίσως σου αρέσουν επίσης</h2>
				</div>
				<a href="/reviews" class="text-link">Όλες οι κριτικές <ArrowUpRight size={17} /></a>
			</div>
			<div class="review-grid">
				{#each data.relatedArticles.slice(0, 3) as article}<ArticleCard {article} />{/each}
			</div>
		</section>{/if}
</div>

<style>
	.breadcrumbs {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
		font-size: 10px;
		color: var(--color-text-light);
		padding-top: 30px;
	}
	.breadcrumbs a:hover {
		color: var(--red);
	}
	.article-hero {
		display: grid;
		grid-template-columns: 1.15fr 1fr;
		gap: 70px;
		align-items: center;
		padding: 45px 0;
		border-bottom: 1px solid var(--ink);
	}
	.category {
		color: var(--red);
		display: inline-flex;
		gap: 12px;
		align-items: center;
	}
	h1 {
		font-family: var(--font-serif);
		font-size: clamp(40px, 5vw, 70px);
		font-weight: 400;
		line-height: 1.12;
		letter-spacing: -0.05em;
		margin: 22px 0;
	}
	.book-author {
		font-size: 16px;
		margin-bottom: 26px;
	}
	.book-author a {
		text-decoration: underline;
		text-decoration-color: var(--line);
	}
	.book-author a:hover {
		color: var(--red);
	}
	.intro-excerpt {
		font-family: var(--font-serif);
		font-size: 17px;
		line-height: 1.9;
		color: var(--color-text-gray);
		margin-bottom: 26px;
	}
	.article-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 24px;
		margin-top: 26px;
		font-size: 10px;
		color: var(--color-text-light);
	}
	.article-meta span {
		display: flex;
		gap: 7px;
		align-items: center;
	}
	.hero-cover {
		background: #eeece2;
		min-width: 0;
	}
	.hero-cover img {
		width: 100%;
		height: 480px;
		object-fit: contain;
	}
	.reading-layout {
		display: grid;
		grid-template-columns: 230px minmax(0, 730px);
		gap: 65px;
		padding-top: 55px;
	}
	.reading-aside {
		align-self: start;
		position: sticky;
		top: 30px;
	}
	.reading-aside > .eyebrow {
		color: var(--red);
		font-size: 9px;
	}
	.reading-aside > p {
		font-family: var(--font-serif);
		font-size: 23px;
		margin: 18px 0 30px;
	}
	.reading-aside .text-link {
		font-size: 11px;
		display: flex;
		border-top: 1px solid var(--line);
		padding-block: 15px;
		width: 100%;
	}
	.share-status {
		display: block;
		font-size: 11px;
		color: var(--red);
		line-height: 1.7;
	}
	.article-content {
		font-family: var(--font-serif);
		font-size: 18px;
		line-height: 1.95;
		color: #45463e;
		overflow-wrap: anywhere;
	}
	.article-content :global(p) {
		margin-bottom: 1.6em;
	}
	.article-content :global(h1),
	.article-content :global(h2),
	.article-content :global(h3) {
		color: var(--ink);
		font-family: var(--font-serif);
		font-weight: 500;
		letter-spacing: -0.035em;
		line-height: 1.4;
		margin: 2em 0 0.8em;
	}
	.article-content :global(h2) {
		font-size: 30px;
	}
	.article-content :global(h3) {
		font-size: 25px;
	}
	.article-content :global(a) {
		color: var(--red);
		text-decoration: underline;
	}
	.article-content :global(blockquote) {
		border-left: 2px solid var(--red);
		margin: 35px 0;
		padding: 10px 0 10px 26px;
		font-size: 23px;
		font-style: italic;
		color: var(--ink);
	}
	.article-content :global(blockquote p:last-child) {
		margin: 0;
	}
	.article-content :global(ul),
	.article-content :global(ol) {
		padding-left: 24px;
		margin-bottom: 25px;
	}
	.article-content :global(ul) {
		list-style: disc;
	}
	.article-content :global(ol) {
		list-style: decimal;
	}
	.article-content :global(img) {
		max-height: 650px;
		object-fit: contain;
		margin: 25px auto;
	}
	.article-content :global(pre) {
		overflow-x: auto;
		font-size: 14px;
	}
	.article-content :global(table) {
		display: block;
		max-width: 100%;
		overflow-x: auto;
	}
	.article-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		border-top: 1px solid var(--line);
		padding-top: 25px;
		margin-top: 35px;
	}
	.article-tags a {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		border: 1px solid var(--line);
		padding: 7px 13px;
		font-family: var(--font-sans);
		font-size: 10px;
		text-decoration: none;
		color: var(--ink);
	}
	.article-tags a:hover {
		border-color: var(--red);
		color: var(--red);
	}
	.related {
		margin-top: 75px;
	}
	@media (max-width: 1000px) {
		.article-hero {
			gap: 35px;
		}
		.reading-layout {
			grid-template-columns: 170px minmax(0, 1fr);
			gap: 35px;
		}
		.hero-cover img {
			height: 400px;
		}
	}
	@media (max-width: 700px) {
		.article-hero {
			grid-template-columns: 1fr;
			padding-top: 30px;
			gap: 30px;
		}
		.hero-cover img {
			height: 350px;
		}
		.reading-layout {
			display: flex;
			flex-direction: column;
			gap: 30px;
			padding-top: 30px;
		}
		.reading-aside {
			position: static;
			width: 100%;
		}
		.reading-aside > .eyebrow,
		.reading-aside > p,
		.reading-aside > a {
			display: none;
		}
		.reading-aside .text-link {
			border-top: 0;
			padding-block: 0;
		}
		.article-content {
			font-size: 17px;
		}
		.intro-excerpt {
			font-size: 16px;
		}
		.related {
			margin-top: 50px;
		}
	}
</style>
