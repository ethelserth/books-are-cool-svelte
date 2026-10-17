<script lang="ts">
	import { ArrowUpRight } from 'lucide-svelte';
	import Meta from '$lib/components/Meta.svelte';
	let {
		data
	}: { data: { tags: { name: string; count: number; slug: string }[]; totalTags: number } } =
		$props();
	let query = $state('');
	let tags = $derived(
		data.tags.filter((tag) =>
			tag.name.toLocaleLowerCase('el').includes(query.trim().toLocaleLowerCase('el'))
		)
	);
	const itemList = $derived(data.tags.map((tag) => ({ name: tag.name, url: `/tags/${tag.slug}` })));
</script>

<Meta
	title="Εξερεύνησε τη βιβλιοθήκη"
	description={`Ανακάλυψε βιβλία σε ${data.totalTags} κατηγορίες. Λογοτεχνία, αστυνομικό, ελληνικά βιβλία και πολλές ακόμη αναγνώσεις.`}
	url="/tags"
	type="collection"
	breadcrumbs={[
		{ name: 'Αρχική', url: '/' },
		{ name: 'Κατηγορίες', url: '/tags' }
	]}
	{itemList}
	itemListName="Κατηγορίες βιβλίων"
/>
<div class="shell">
	<header class="archive-heading">
		<span class="eyebrow">Ακολούθησε την περιέργειά σου</span>
		<h1>Ένα ράφι για<br />κάθε αναγνώστη.</h1>
		<p>
			Από το γνώριμο στο αναπάντεχο. Βρες το είδος που αγαπάς ή ανακάλυψε κάτι που δεν έχεις
			διαβάσει ακόμα.
		</p>
		<div class="archive-meta"><span>{data.totalTags} κατηγορίες για εξερεύνηση</span></div>
	</header>
	<div class="category-toolbar">
		<h2>Οι κατηγορίες μας</h2>
		<input
			type="search"
			bind:value={query}
			placeholder="Βρες μια κατηγορία…"
			aria-label="Αναζήτηση κατηγορίας"
		/>
	</div>
	<p class="sr-only" aria-live="polite">{tags.length} κατηγορίες</p>
	<div class="category-grid">
		{#each tags as tag, index}<a href="/tags/{tag.slug}"
				><div class="category-top">
					<span>{String(index + 1).padStart(2, '0')}</span><ArrowUpRight
						size={24}
						strokeWidth={1.4}
					/>
				</div>
				<h2>{tag.name}</h2>
				<p>{tag.count} {tag.count === 1 ? 'κριτική' : 'κριτικές'} στη βιβλιοθήκη</p></a
			>{/each}
	</div>
	{#if !tags.length}<div class="empty-state">
			<h2>Δεν βρέθηκαν κατηγορίες.</h2>
			<p>Δοκίμασε μια διαφορετική αναζήτηση.</p>
			<a href="/reviews" class="button">Όλες οι κριτικές</a>
		</div>{/if}
</div>

<style>
	.category-toolbar {
		display: flex;
		justify-content: space-between;
		gap: 20px;
		align-items: center;
		margin-bottom: 28px;
	}
	.category-toolbar h2 {
		font-family: var(--font-serif);
		font-size: 25px;
	}
	input {
		padding: 12px 15px;
		border: 1px solid var(--line);
		width: 260px;
		font-size: 12px;
		background: transparent;
	}
	.category-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		border-left: 1px solid var(--line);
		border-top: 1px solid var(--line);
	}
	.category-grid a {
		padding: 28px;
		border-right: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
		transition:
			background 0.2s,
			color 0.2s;
	}
	.category-top {
		display: flex;
		justify-content: space-between;
		color: var(--red);
		font-size: 12px;
	}
	.category-grid h2 {
		font-family: var(--font-serif);
		font-size: 29px;
		letter-spacing: -0.04em;
		margin: 40px 0 14px;
	}
	.category-grid p {
		font-size: 11px;
		color: var(--color-text-gray);
	}
	.category-grid a:hover {
		background: var(--olive);
		color: var(--paper);
	}
	.category-grid a:hover .category-top,
	.category-grid a:hover p {
		color: #d4d7c7;
	}
	@media (max-width: 900px) {
		.category-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 600px) {
		.category-toolbar {
			align-items: stretch;
			flex-direction: column;
		}
		input {
			width: 100%;
			font-size: 16px;
		}
		.category-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
