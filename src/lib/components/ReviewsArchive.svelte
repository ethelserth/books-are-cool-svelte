<script lang="ts">
	import { ArrowUpRight } from 'lucide-svelte';
	import ArticleCard from './ArticleCard.svelte';
	import Pagination from './Pagination.svelte';
	import type { Article, PaginationData } from '$lib/types';
	let { articles, pagination }: { articles: Article[]; pagination: PaginationData } = $props();
</script>

<div class="shell">
	<header class="archive-heading">
		<span class="eyebrow">Η βιβλιοθήκη μας / Κριτικές</span>
		<h1>Κάθε βιβλίο,<br />μια νέα οπτική.</h1>
		<p>
			Σύγχρονη λογοτεχνία, κλασικά έργα και νέες φωνές. Όσα διαβάσαμε, όσα σκεφτήκαμε, όσα αξίζει να
			μοιραστούμε.
		</p>
		<div class="archive-meta">
			<span>{pagination.totalArticles} κριτικές βιβλίων</span><span
				>Σελίδα {pagination.currentPage} από {Math.max(1, pagination.totalPages)}</span
			>
		</div>
	</header>
	<div class="archive-toolbar">
		<h2>Όλες οι κριτικές</h2>
		<a href="/tags" class="text-link">Εξερεύνηση ανά κατηγορία <ArrowUpRight size={16} /></a>
	</div>
	{#if articles.length}<div class="review-grid">
			{#each articles as article (article.id)}<ArticleCard {article} />{/each}
		</div>
		<Pagination
			currentPage={pagination.currentPage}
			totalPages={pagination.totalPages}
			totalArticles={pagination.totalArticles}
		/>
	{:else}<div class="empty-state">
			<h2>Δεν βρέθηκαν κριτικές.</h2>
			<p>Επισκέψου μας ξανά για νέες αναγνώσεις.</p>
			<a href="/" class="button">Πίσω στην αρχική</a>
		</div>{/if}
</div>

<style>
	.archive-toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		margin-bottom: 30px;
	}
	h2 {
		font-family: var(--font-serif);
		font-size: 26px;
		letter-spacing: -0.04em;
	}
	@media (max-width: 600px) {
		.archive-toolbar .text-link {
			max-width: 160px;
			text-align: right;
			font-size: 10px;
		}
	}
</style>
