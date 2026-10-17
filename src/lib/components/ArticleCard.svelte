<script lang="ts">
	import { ArrowUpRight } from 'lucide-svelte';
	import StarRating from './StarRating.svelte';
	import type { Article } from '$lib/types';
	let { article }: { article: Article } = $props();
	function formatDate(value: string) {
		return new Date(value).toLocaleDateString('el-GR', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<a href="/{article.slug}" class="article-card">
	<div class="cover">
		<img src={article.image} alt={article.title} loading="lazy" decoding="async" /><span
			class="cover-arrow"><ArrowUpRight size={20} strokeWidth={1.5} /></span
		>
	</div>
	<div class="card-meta">
		<span class="eyebrow">{article.category}</span><span>{formatDate(article.date)}</span>
	</div>
	<h3>{article.title}</h3>
	<p class="author">{article.author}</p>
	<p class="excerpt">{article.excerpt}</p>
	<div class="card-bottom">
		<StarRating rating={article.rating} size="small" /><span
			>{article.readingTime || 'Διάβασε την κριτική'}</span
		>
	</div>
</a>

<style>
	.article-card {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-width: 0;
	}
	.cover {
		position: relative;
		aspect-ratio: 1.48;
		background: #e9e6db;
		overflow: hidden;
	}
	.cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s;
	}
	.article-card:hover .cover img {
		transform: scale(1.035);
	}
	.cover-arrow {
		position: absolute;
		right: 12px;
		bottom: 12px;
		height: 34px;
		width: 34px;
		display: grid;
		place-items: center;
		background: var(--paper);
		transition:
			background 0.2s,
			color 0.2s;
	}
	.article-card:hover .cover-arrow {
		background: var(--red);
		color: white;
	}
	.card-meta {
		margin: 20px 0 12px;
		display: flex;
		justify-content: space-between;
		gap: 12px;
		align-items: center;
	}
	.eyebrow {
		color: var(--red);
		font-size: 8px;
		letter-spacing: 0.11em;
	}
	.card-meta > span:last-child {
		font-size: 9px;
		color: var(--color-text-light);
		white-space: nowrap;
	}
	h3 {
		font-family: var(--font-serif);
		font-size: 25px;
		font-weight: 400;
		line-height: 1.25;
		letter-spacing: -0.035em;
	}
	.article-card:hover h3 {
		color: var(--red);
	}
	.author {
		font-size: 11px;
		margin-top: 10px;
		color: var(--color-text-gray);
	}
	.excerpt {
		font-family: var(--font-serif);
		font-size: 13px;
		color: var(--color-text-gray);
		line-height: 1.9;
		margin-block: 17px 22px;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.card-bottom {
		margin-top: auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		border-top: 1px solid var(--line);
		padding-top: 14px;
	}
	.card-bottom > span {
		font-size: 9px;
		color: var(--color-text-light);
	}
	@media (max-width: 600px) {
		h3 {
			font-size: 28px;
		}
		.excerpt {
			font-size: 14px;
		}
	}
</style>
