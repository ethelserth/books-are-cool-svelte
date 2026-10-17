<script lang="ts">
	import { ArrowUpRight, ArrowRight } from 'lucide-svelte';
	import StarRating from './StarRating.svelte';
	import type { Article } from '$lib/types';
	let { featuredArticles = [] }: { featuredArticles?: Article[] } = $props();
	let featured = $derived(featuredArticles[0]);
	let selections = $derived(featuredArticles.slice(1, 4));
</script>

<section class="shell feature-section" aria-label="Επιλεγμένες κριτικές">
	<div class="feature-label">
		<span class="eyebrow"><span class="dot"></span> Στο επίκεντρο</span><span
			class="eyebrow issue-note">Ιστορίες που μένουν μαζί μας</span
		>
	</div>
	<div class="feature-grid">
		{#if featured}
			<article class="main-feature">
				<a href="/{featured.slug}" class="feature-image" aria-label="Διαβάστε: {featured.title}">
					<img src={featured.image} alt={featured.title} fetchpriority="high" />
					<span class="image-caption">Η επιλογή μας <ArrowUpRight size={18} /></span>
				</a>
				<div class="feature-copy">
					<span class="eyebrow category">{featured.category}</span>
					<h2><a href="/{featured.slug}">{featured.title}</a></h2>
					<p class="author">{featured.author}</p>
					<p class="excerpt">{featured.excerpt}</p>
					<StarRating rating={featured.rating} size="small" />
					<a href="/{featured.slug}" class="text-link read-link"
						>Διάβασε την κριτική <ArrowUpRight size={17} /></a
					>
				</div>
			</article>
		{:else}
			<div class="feature-empty">
				<span class="eyebrow">Το επόμενο αγαπημένο σου βιβλίο</span>
				<h2>Κάθε βιβλίο,<br />ένας καινούργιος κόσμος.</h2>
				<a class="button" href="/reviews">Ανακάλυψε τις κριτικές <ArrowRight size={16} /></a>
			</div>
		{/if}
		<aside class="picks">
			<div class="picks-title">
				<h2>Στο ράφι μας</h2>
				<span>↗</span>
			</div>
			<p class="picks-intro">Βιβλία που αξίζουν την προσοχή σου.</p>
			{#each selections as article, index}
				<a href="/{article.slug}" class="pick">
					<span class="pick-number">0{index + 1}</span>
					<div>
						<span class="eyebrow">{article.category}</span>
						<h3>{article.title}</h3>
						<p>{article.author}</p>
					</div>
					<img src={article.image} alt="" loading="lazy" />
				</a>
			{/each}
			<a href="/reviews" class="text-link all-picks">Όλες οι κριτικές <ArrowRight size={16} /></a>
		</aside>
	</div>
</section>

<style>
	.feature-section {
		margin-top: 34px;
	}
	.feature-label {
		display: flex;
		justify-content: space-between;
		padding-bottom: 17px;
	}
	.feature-label > span:first-child {
		display: flex;
		align-items: center;
		gap: 9px;
	}
	.dot {
		width: 6px;
		height: 6px;
		background: var(--red);
		border-radius: 50%;
	}
	.issue-note {
		color: var(--color-text-light);
		font-size: 9px;
	}
	.feature-grid {
		display: grid;
		grid-template-columns: minmax(0, 2.25fr) minmax(0, 1fr);
		border-block: 1px solid var(--ink);
		padding-block: 26px;
		gap: 32px;
	}
	.main-feature {
		display: grid;
		grid-template-columns: 1.05fr 1fr;
		gap: 32px;
		align-items: center;
	}
	.feature-image {
		min-height: 385px;
		height: 100%;
		max-height: 470px;
		background: #e6e4d7;
		position: relative;
		overflow: hidden;
	}
	.feature-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		position: absolute;
		inset: 0;
		transition: transform 0.6s;
	}
	.feature-image:hover img {
		transform: scale(1.035);
	}
	.image-caption {
		position: absolute;
		bottom: 15px;
		left: 15px;
		right: 15px;
		background: var(--paper);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 15px;
		font-size: 10px;
	}
	.feature-copy {
		padding-block: 20px;
	}
	.category {
		color: var(--red);
	}
	.feature-copy h2 {
		font-family: var(--font-serif);
		font-size: clamp(29px, 2.9vw, 43px);
		font-weight: 400;
		line-height: 1.18;
		letter-spacing: -0.045em;
		margin-block: 17px;
	}
	h2 a:hover {
		color: var(--red);
	}
	.author {
		font-size: 11px;
		margin-bottom: 22px;
	}
	.excerpt {
		font-family: var(--font-serif);
		font-size: 14px;
		line-height: 1.9;
		color: var(--color-text-gray);
		margin-bottom: 22px;
	}
	.read-link {
		margin-top: 22px;
		display: flex;
		justify-content: space-between;
		border-top: 1px solid var(--line);
		padding-top: 16px;
	}
	.picks {
		border-left: 1px solid var(--line);
		padding-left: 28px;
	}
	.picks-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.picks-title h2 {
		font-family: var(--font-serif);
		font-size: 23px;
		letter-spacing: -0.04em;
	}
	.picks-title > span {
		font-size: 25px;
		color: var(--red);
	}
	.picks-intro {
		font-size: 10px;
		color: var(--color-text-light);
		margin-top: 8px;
		margin-bottom: 15px;
	}
	.pick {
		display: grid;
		grid-template-columns: 20px 1fr 48px;
		gap: 10px;
		align-items: start;
		border-bottom: 1px solid var(--line);
		padding: 20px 0;
	}
	.pick-number {
		font-family: var(--font-serif);
		font-size: 14px;
		color: var(--red);
	}
	.pick .eyebrow {
		font-size: 8px;
		letter-spacing: 0.08em;
		color: var(--color-text-light);
	}
	.pick h3 {
		font-family: var(--font-serif);
		font-size: 16px;
		line-height: 1.4;
		margin: 5px 0;
	}
	.pick:hover h3 {
		color: var(--red);
	}
	.pick p {
		font-size: 9px;
		color: var(--color-text-gray);
		line-height: 1.6;
	}
	.pick img {
		width: 48px;
		height: 65px;
		object-fit: cover;
		margin-top: 4px;
	}
	.all-picks {
		margin-top: 14px;
		font-size: 10px;
	}
	.feature-empty {
		padding: 35px;
		background: #eeece2;
	}
	.feature-empty h2 {
		font-family: var(--font-serif);
		font-size: 42px;
		margin: 25px 0;
	}
	@media (max-width: 1100px) {
		.feature-grid {
			grid-template-columns: 1fr;
		}
		.picks {
			border-left: 0;
			border-top: 1px solid var(--line);
			padding: 25px 0 0;
		}
		.pick {
			grid-template-columns: 25px 1fr 48px;
		}
		.feature-image {
			min-height: 380px;
		}
	}
	@media (max-width: 600px) {
		.issue-note {
			display: none;
		}
		.main-feature {
			grid-template-columns: 1fr;
			gap: 6px;
		}
		.feature-image {
			min-height: 340px;
		}
		.feature-copy h2 {
			font-size: 37px;
		}
		.feature-copy {
			padding-block: 20px 0;
		}
		.excerpt {
			font-size: 15px;
		}
		.feature-grid {
			padding-top: 18px;
		}
	}
</style>
