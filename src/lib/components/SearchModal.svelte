<script lang="ts">
	import { Search, X, ArrowUpRight } from 'lucide-svelte';
	import type { Article } from '$lib/types';
	let { isOpen, onClose }: { isOpen: boolean; onClose: () => void } = $props();
	let dialog = $state<HTMLDialogElement>();
	let input = $state<HTMLInputElement>();
	let query = $state('');
	let results = $state<Article[]>([]);
	let searching = $state(false);
	let searched = $state(false);
	let failed = $state(false);

	$effect(() => {
		if (!dialog) return;
		if (isOpen) {
			const previousFocus = document.activeElement;
			dialog.showModal();
			input?.focus();
			const previousOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				dialog?.close();
				document.body.style.overflow = previousOverflow;
				if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
					previousFocus.focus();
			};
		}
		query = '';
	});

	$effect(() => {
		const term = query.trim();
		results = [];
		searched = false;
		failed = false;
		searching = false;
		if (!isOpen || term.length < 2) return;
		const controller = new AbortController();
		searching = true;
		const timeout = setTimeout(async () => {
			try {
				const response = await fetch(`/api/search?q=${encodeURIComponent(term)}&limit=15`, {
					signal: controller.signal
				});
				if (!response.ok) throw new Error('Search failed');
				const data = await response.json();
				if (!controller.signal.aborted) {
					results = data.results || [];
					searched = true;
				}
			} catch {
				if (!controller.signal.aborted) failed = true;
			} finally {
				if (!controller.signal.aborted) searching = false;
			}
		}, 300);
		return () => {
			clearTimeout(timeout);
			controller.abort();
		};
	});

	function handleBackdrop(event: MouseEvent) {
		if (event.target !== dialog) return;
		const rect = dialog.getBoundingClientRect();
		if (
			event.clientX < rect.left ||
			event.clientX > rect.right ||
			event.clientY < rect.top ||
			event.clientY > rect.bottom
		)
			onClose();
	}
</script>

<dialog
	bind:this={dialog}
	oncancel={(event) => {
		event.preventDefault();
		onClose();
	}}
	onclose={() => {
		if (isOpen) onClose();
	}}
	onclick={handleBackdrop}
	onkeydown={(event) => {
		if (event.key === 'Escape') {
			event.preventDefault();
			event.stopPropagation();
			onClose();
		}
	}}
	aria-labelledby="search-title"
>
	<div class="dialog-heading">
		<div>
			<span class="eyebrow">Η βιβλιοθήκη μας</span>
			<h2 id="search-title">Η επόμενη ανακάλυψή σου.</h2>
		</div>
		<button onclick={onClose} aria-label="Κλείσιμο αναζήτησης"><X size={22} /></button>
	</div>
	<div class="search-field">
		<Search size={21} strokeWidth={1.5} /><input
			bind:this={input}
			bind:value={query}
			type="search"
			aria-label="Τίτλος βιβλίου ή συγγραφέας"
			placeholder="Ένας τίτλος, ένας συγγραφέας…"
			autocomplete="off"
		/><kbd>ESC</kbd>
	</div>
	<div class="results" aria-live="polite" aria-busy={searching}>
		{#if searching}<p class="status">Αναζητούμε την επόμενη ιστορία σου…</p>
		{:else if failed}<p class="status">
				Η αναζήτηση δεν είναι διαθέσιμη αυτή τη στιγμή. Δοκίμασε ξανά ή <a
					href="/reviews"
					onclick={onClose}>περιηγήσου στις κριτικές</a
				>.
			</p>
		{:else if searched && !results.length}<p class="status">
				Δεν βρέθηκαν βιβλία για «{query}». Δοκίμασε έναν άλλο τίτλο ή συγγραφέα.
			</p>
		{:else if results.length}
			<p class="result-label eyebrow">
				{results.length === 15 ? 'Πρώτα 15 αποτελέσματα' : `${results.length} αποτελέσματα`}
			</p>
			{#each results as article}<a class="result" href="/{article.slug}" onclick={onClose}
					><img src={article.image} alt="" loading="lazy" />
					<div>
						<span class="eyebrow">{article.category}</span>
						<h3>{article.title}</h3>
						<p>{article.author}</p>
					</div>
					<ArrowUpRight size={18} /></a
				>{/each}
		{:else}<div class="status">
				<p>Γράψε τουλάχιστον δύο χαρακτήρες για να ξεκινήσεις.</p>
				<a class="text-link" href="/tags" onclick={onClose}
					>Ή εξερεύνησε τις κατηγορίες <ArrowUpRight size={16} /></a
				>
			</div>{/if}
	</div>
</dialog>

<style>
	dialog {
		position: fixed;
		inset: 0;
		margin: 12vh auto auto;
		width: min(680px, calc(100% - 32px));
		max-height: 76dvh;
		padding: 28px;
		border: 1px solid var(--ink);
		background: var(--paper);
		color: var(--ink);
		overflow-y: auto;
		box-shadow: 0 20px 100px #0003;
	}
	dialog::backdrop {
		background: #29271f85;
		backdrop-filter: blur(4px);
	}
	.dialog-heading {
		display: flex;
		justify-content: space-between;
		align-items: start;
		gap: 15px;
		margin-bottom: 25px;
	}
	.dialog-heading .eyebrow {
		color: var(--red);
		font-size: 9px;
	}
	h2 {
		font-family: var(--font-serif);
		font-size: 29px;
		letter-spacing: -0.04em;
		margin-top: 8px;
	}
	button {
		padding: 6px;
	}
	.search-field {
		display: flex;
		align-items: center;
		gap: 15px;
		padding: 16px 0;
		border-block: 1px solid var(--ink);
	}
	input {
		width: 100%;
		min-width: 0;
		outline: none;
		background: transparent;
		font-size: 14px;
	}
	input:focus-visible {
		outline: none;
	}
	.search-field:focus-within {
		border-color: var(--red);
		box-shadow: 0 1px var(--red);
	}
	kbd {
		font-size: 9px;
		color: var(--color-text-light);
	}
	.status {
		padding: 35px 0 20px;
		font-size: 13px;
		line-height: 1.8;
		color: var(--color-text-gray);
	}
	.status a {
		color: var(--red);
	}
	.result-label {
		margin-top: 22px;
		color: var(--color-text-light);
	}
	.result {
		display: flex;
		gap: 18px;
		padding: 20px 0;
		border-bottom: 1px solid var(--line);
		align-items: center;
	}
	.result img {
		width: 48px;
		height: 66px;
		object-fit: cover;
	}
	.result > div {
		flex: 1;
	}
	.result .eyebrow {
		color: var(--red);
		font-size: 8px;
	}
	h3 {
		font-family: var(--font-serif);
		font-size: 20px;
		margin: 5px 0;
	}
	.result:hover h3 {
		color: var(--red);
	}
	.result p {
		font-size: 11px;
		color: var(--color-text-gray);
	}
	@media (max-width: 600px) {
		dialog {
			padding: 20px;
			margin-top: 6vh;
			max-height: 88dvh;
		}
		h2 {
			font-size: 24px;
		}
		input {
			font-size: 16px;
		}
	}
</style>
