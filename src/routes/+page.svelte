<script lang="ts">
	import { ArrowUpRight, ArrowRight, BookOpen } from 'lucide-svelte';
	import HeroSection from '$lib/components/HeroSection.svelte';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import type { HomePageData } from '$lib/types';
	let { data }: { data: HomePageData } = $props();
	let selectedCategory = $state('Όλα');
	let categories = $derived(['Όλα', ...new Set(data.articles.map((article) => article.category))]);
	let filteredArticles = $derived(
		selectedCategory === 'Όλα'
			? data.articles
			: data.articles.filter((article) => article.category === selectedCategory)
	);
	let featured = $derived(
		data.featuredArticles.length ? data.featuredArticles : data.articles.slice(0, 4)
	);
	const shelves = [
		{
			title: 'Λογοτεχνία',
			subtitle: 'Ζωές ανάμεσα στις γραμμές',
			slug: 'literary-fiction',
			number: '01'
		},
		{ title: 'Αστυνομικό', subtitle: 'Η επόμενη σελίδα κρύβει κάτι', slug: 'crime', number: '02' },
		{
			title: 'Ελληνική λογοτεχνία',
			subtitle: 'Ιστορίες στη γλώσσα μας',
			slug: 'greek-literature',
			number: '03'
		},
		{
			title: 'Non-fiction',
			subtitle: 'Ο κόσμος από άλλη οπτική',
			slug: 'non-fiction',
			number: '04'
		}
	];
</script>

<Meta
	title="Books Are Cool — Για την αγάπη των βιβλίων"
	description="Κριτικές βιβλίων, λογοτεχνικές ανακαλύψεις και ιστορίες που μένουν μαζί μας. Βρες την επόμενη αγαπημένη σου ανάγνωση στο Books Are Cool."
	url="/"
	type="website"
	keywords="κριτικές βιβλίων, λογοτεχνία, ελληνικά βιβλία, βιβλιοκριτική"
/>

<section class="masthead shell" aria-labelledby="site-title">
	<div class="masthead-top">
		<span class="eyebrow">Για την αγάπη των βιβλίων</span><span class="eyebrow"
			>Κριτικές · Ιδέες · Ανακαλύψεις</span
		>
	</div>
	<h1 id="site-title">Books Are Cool<span class="asterisk" aria-hidden="true">✳</span></h1>
	<div class="masthead-bottom">
		<p>Οι καλές ιστορίες δεν τελειώνουν στην τελευταία σελίδα.</p>
		<a href="#recent" class="text-link">Βρες την επόμενη ανάγνωσή σου <ArrowRight size={15} /></a>
	</div>
</section>

<HeroSection featuredArticles={featured} />

<section class="shell recent-section" id="recent">
	<div class="section-heading">
		<div>
			<p class="eyebrow">Το αναγνωστικό μας ημερολόγιο</p>
			<h2>Τελευταίες αναγνώσεις</h2>
		</div>
		<a href="/reviews" class="text-link">Όλες οι κριτικές <ArrowUpRight size={17} /></a>
	</div>
	{#if data.articles.length}
		<div class="filters" role="group" aria-label="Φιλτράρισμα πρόσφατων κριτικών">
			{#each categories as category}<button
					class:chosen={selectedCategory === category}
					aria-pressed={selectedCategory === category}
					onclick={() => (selectedCategory = category)}>{category}</button
				>{/each}
			<span class="result-count" aria-live="polite"
				>{Math.min(filteredArticles.length, 6)} από {filteredArticles.length} κριτικές</span
			>
		</div>
		<div class="review-grid">
			{#each filteredArticles.slice(0, 6) as article (article.id)}<ArticleCard {article} />{/each}
		</div>
		<div class="archive-link">
			<a href="/reviews" class="button"
				>Περισσότερα βιβλία, περισσότερες ιστορίες <ArrowRight size={17} /></a
			>
		</div>
	{:else}
		<div class="empty-state">
			<BookOpen size={32} class="mx-auto mb-5" />
			<h2>Οι επόμενες ιστορίες έρχονται σύντομα.</h2>
			<p>Περιηγήσου στη βιβλιοθήκη μας για περισσότερες αναγνώσεις.</p>
			<a href="/reviews" class="button">Στη βιβλιοθήκη <ArrowRight size={16} /></a>
		</div>
	{/if}
</section>

<section class="reading-note">
	<div class="shell note-inner">
		<span class="note-symbol" aria-hidden="true">“</span>
		<div>
			<span class="eyebrow">Μια σκέψη ανάμεσα στις σελίδες</span>
			<blockquote>
				A reader lives a thousand lives before he dies.<br />The man who never reads lives only one.
			</blockquote>
			<cite>George R. R. Martin</cite>
		</div>
		<span class="note-mark" aria-hidden="true">✳</span>
	</div>
</section>

<section class="shell shelf-section">
	<div class="section-heading">
		<div>
			<p class="eyebrow">Ακολούθησε την περιέργειά σου</p>
			<h2>Σε ποιο ράφι θα χαθείς;</h2>
		</div>
		<a class="text-link" href="/tags">Όλες οι κατηγορίες <ArrowUpRight size={17} /></a>
	</div>
	<div class="shelves">
		{#each shelves as shelf}<a href="/tags/{shelf.slug}"
				><div class="shelf-top">
					<span class="eyebrow">{shelf.number} / Στη βιβλιοθήκη</span><ArrowUpRight
						size={22}
						strokeWidth={1.3}
					/>
				</div>
				<h3>{shelf.title}</h3>
				<p>{shelf.subtitle}</p></a
			>{/each}
	</div>
</section>

<style>
	.masthead {
		padding-top: 29px;
	}
	.masthead-top {
		display: flex;
		justify-content: space-between;
		color: var(--color-text-light);
	}
	.masthead-top .eyebrow {
		font-size: 9px;
	}
	h1 {
		font-family: Georgia, 'Times New Roman', serif;
		font-weight: 700;
		font-size: clamp(55px, 10.85vw, 156px);
		letter-spacing: -0.075em;
		line-height: 1.18;
		display: flex;
		justify-content: space-between;
		align-items: center;
		white-space: nowrap;
		margin: 9px 0 18px;
	}
	.asterisk {
		font-family: var(--font-sans);
		font-weight: 400;
		font-size: 0.78em;
		color: var(--red);
		line-height: 1;
		padding-left: 16px;
	}
	.masthead-bottom {
		display: flex;
		justify-content: space-between;
		gap: 20px;
		align-items: center;
		border-top: 1px solid var(--line);
		padding-top: 10px;
	}
	.masthead-bottom p {
		font-family: var(--font-serif);
		font-size: 13px;
		font-style: italic;
		color: var(--color-text-gray);
	}
	.masthead-bottom .text-link {
		font-size: 10px;
	}
	.recent-section {
		margin-top: 65px;
		scroll-margin-top: 24px;
	}
	.filters {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
		margin: -10px 0 30px;
	}
	.filters button {
		border: 1px solid var(--line);
		border-radius: 25px;
		font-size: 10px;
		padding: 9px 15px;
		transition:
			background 0.2s,
			color 0.2s;
	}
	.filters button:hover {
		border-color: var(--ink);
	}
	.filters button.chosen {
		background: var(--ink);
		color: var(--paper);
		border-color: var(--ink);
	}
	.result-count {
		margin-left: auto;
		font-size: 10px;
		color: var(--color-text-light);
	}
	.archive-link {
		text-align: center;
		margin-top: 44px;
	}
	.reading-note {
		background: #eeece1;
		border-block: 1px solid var(--line);
		padding-block: 45px;
		margin-top: 70px;
	}
	.note-inner {
		display: flex;
		align-items: start;
		gap: 35px;
	}
	.note-symbol {
		font-family: Georgia, serif;
		font-size: 120px;
		color: var(--red);
		line-height: 1;
	}
	.reading-note .eyebrow {
		color: var(--red);
		font-size: 9px;
	}
	blockquote {
		font-family: var(--font-serif);
		font-size: clamp(20px, 2.6vw, 33px);
		line-height: 1.5;
		letter-spacing: -0.025em;
		margin: 18px 0;
	}
	cite {
		font-style: normal;
		font-size: 10px;
		color: var(--color-text-gray);
	}
	.note-mark {
		color: #9b9d82;
		font-size: 100px;
		margin-left: auto;
		align-self: center;
	}
	.shelf-section {
		margin-top: 65px;
	}
	.shelves {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		border-block: 1px solid var(--line);
	}
	.shelves a {
		padding: 24px;
		border-right: 1px solid var(--line);
		transition: background 0.2s;
	}
	.shelves a:first-child {
		padding-left: 0;
	}
	.shelves a:last-child {
		border: 0;
	}
	.shelves a:hover {
		background: #eeece2;
	}
	.shelf-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		color: var(--red);
	}
	.shelf-top .eyebrow {
		font-size: 8px;
	}
	.shelves h3 {
		font-family: var(--font-serif);
		font-size: 24px;
		line-height: 1.25;
		margin: 35px 0 12px;
		letter-spacing: -0.04em;
	}
	.shelves p {
		font-size: 10px;
		color: var(--color-text-gray);
		line-height: 1.7;
	}
	@media (max-width: 900px) {
		h1 {
			font-size: 11vw;
		}
		.shelves {
			grid-template-columns: repeat(2, 1fr);
		}
		.shelves a {
			border-bottom: 1px solid var(--line);
		}
		.shelves a:first-child {
			padding-left: 24px;
		}
		.shelves a:nth-child(2) {
			border-right: 0;
		}
		.shelves a:nth-child(3) {
			border-bottom: 0;
		}
		.note-mark {
			display: none;
		}
	}
	@media (max-width: 600px) {
		.masthead-top .eyebrow:last-child {
			display: none;
		}
		h1 {
			font-size: 10.6vw;
			margin-block: 16px;
		}
		.asterisk {
			padding-left: 8px;
		}
		.masthead-bottom {
			display: block;
		}
		.masthead-bottom p {
			font-size: 11px;
			line-height: 1.8;
		}
		.masthead-bottom .text-link {
			margin-top: 5px;
		}
		.recent-section,
		.shelf-section {
			margin-top: 42px;
		}
		.result-count {
			display: none;
		}
		.filters {
			gap: 6px;
		}
		.filters button {
			padding: 8px 12px;
		}
		.note-inner {
			gap: 15px;
		}
		.note-symbol {
			font-size: 70px;
		}
		.reading-note {
			margin-top: 45px;
			padding-block: 30px;
		}
		blockquote br {
			display: none;
		}
		.shelves a,
		.shelves a:first-child {
			padding: 18px 14px;
		}
		.shelves h3 {
			font-size: 21px;
		}
		.shelf-top .eyebrow {
			font-size: 7px;
		}
		.archive-link .button {
			font-size: 10px;
			gap: 14px;
		}
	}
</style>
