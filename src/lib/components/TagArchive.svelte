<script lang="ts">
	import { ArrowUpRight } from 'lucide-svelte';
	import ArticleCard from './ArticleCard.svelte';
	import Pagination from './Pagination.svelte';
	import type { Article, PaginationData } from '$lib/types';
	let {
		tag,
		tagSlug,
		articles,
		articleCount,
		pagination
	}: {
		tag: string;
		tagSlug: string;
		articles: Article[];
		articleCount: number;
		pagination: PaginationData;
	} = $props();
</script>

<div class="shell">
	<header class="archive-heading">
		<a class="eyebrow" href="/tags">Η βιβλιοθήκη / Κατηγορίες</a>
		<h1>{tag}</h1>
		<p>Ιστορίες, ιδέες και νέες οπτικές. Όλες οι αναγνώσεις μας στην κατηγορία «{tag}».</p>
		<div class="archive-meta">
			<span>{articleCount} {articleCount === 1 ? 'κριτική' : 'κριτικές'}</span><span
				>Σελίδα {pagination.currentPage} από {Math.max(1, pagination.totalPages)}</span
			>
		</div>
	</header>
	{#if articles.length}<div class="review-grid">
			{#each articles as article (article.id)}<ArticleCard {article} />{/each}
		</div>
		<Pagination
			currentPage={pagination.currentPage}
			totalPages={pagination.totalPages}
			totalArticles={pagination.totalArticles}
			baseUrl="/tags/{tagSlug}"
		/>
	{:else}<div class="empty-state">
			<h2>Δεν βρέθηκαν κριτικές.</h2>
			<p>Δοκίμασε μια άλλη κατηγορία ή εξερεύνησε όλες τις αναγνώσεις μας.</p>
			<a href="/reviews" class="button">Όλες οι κριτικές <ArrowUpRight size={17} /></a>
		</div>{/if}
	<a href="/tags" class="text-link mt-8">Πίσω στις κατηγορίες <ArrowUpRight size={16} /></a>
</div>
