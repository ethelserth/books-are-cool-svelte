<script lang="ts">
	import { page } from '$app/state';
	import { ArrowRight } from 'lucide-svelte';
</script>

<svelte:head
	><title>{page.status} — Books Are Cool</title><meta
		name="robots"
		content="noindex"
	/></svelte:head
>
<section class="shell error-page">
	<span class="eyebrow">Κάπου χάσαμε τον σελιδοδείκτη</span><span class="error-code"
		>{page.status}</span
	>
	<h1>
		{page.status === 404 ? 'Αυτή η σελίδα δεν βρέθηκε.' : 'Αυτή η σελίδα δεν είναι διαθέσιμη.'}
	</h1>
	<p>Η επόμενη καλή ιστορία είναι ακόμα εδώ. Ας τη βρούμε στη βιβλιοθήκη.</p>
	<a href="/reviews" class="button">Εξερεύνησε τις κριτικές <ArrowRight size={16} /></a><a
		href="/"
		class="text-link">Πίσω στην αρχική</a
	>
</section>

<style>
	.error-page {
		text-align: center;
		padding-block: 70px;
	}
	.eyebrow {
		color: var(--red);
	}
	.error-code {
		display: block;
		font-family: Georgia, serif;
		font-size: clamp(100px, 18vw, 200px);
		line-height: 1.2;
		letter-spacing: -0.07em;
		color: var(--red);
	}
	h1 {
		font-family: var(--font-serif);
		font-size: clamp(26px, 4vw, 42px);
		letter-spacing: -0.04em;
		margin: 18px 0;
	}
	p {
		font-size: 14px;
		color: var(--color-text-gray);
		line-height: 1.8;
		margin-bottom: 28px;
	}
	.text-link {
		display: flex;
		justify-content: center;
		margin-top: 18px;
	}
</style>
