<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SearchModal from '$lib/components/SearchModal.svelte';
	let { children }: { children: Snippet } = $props();
	let isSearchOpen = $state(false);
	function openSearch() {
		isSearchOpen = true;
	}
	function handleShortcut(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			isSearchOpen = !isSearchOpen;
		}
	}
</script>

<svelte:window onkeydown={handleShortcut} />
<div id="top"></div>
<a href="#main-content" class="skip-link">Μετάβαση στο περιεχόμενο</a>
<Header onOpenSearch={openSearch} />
<main id="main-content" tabindex="-1">{@render children()}</main>
<Footer />
<SearchModal isOpen={isSearchOpen} onClose={() => (isSearchOpen = false)} />

<style>
	.skip-link {
		position: fixed;
		top: 10px;
		left: 10px;
		z-index: 100;
		background: var(--ink);
		color: var(--paper);
		padding: 12px 20px;
		transform: translateY(-160%);
	}
	.skip-link:focus {
		transform: translateY(0);
	}
	main:focus {
		outline: none;
	}
</style>
