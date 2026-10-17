<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { Search, Menu, X, ArrowUpRight } from 'lucide-svelte';
	let { onOpenSearch }: { onOpenSearch: () => void } = $props();
	let menuOpen = $state(false);
	const links = [
		{ href: '/reviews', label: 'Όλες οι κριτικές' },
		{ href: '/tags/literary-fiction', label: 'Λογοτεχνία' },
		{ href: '/tags/crime', label: 'Αστυνομικό' },
		{ href: '/tags/greek-literature', label: 'Ελληνική λογοτεχνία' },
		{ href: '/tags/non-fiction', label: 'Non-fiction' }
	];
	afterNavigate(() => {
		menuOpen = false;
	});
	function search() {
		menuOpen = false;
		onOpenSearch();
	}
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape') menuOpen = false;
	}}
/>
<header class="site-header">
	<div class="shell topbar">
		<a class="small-brand" href="/" aria-label="Books Are Cool — Αρχική">b<span>ac</span><i>✳</i></a
		>
		<span class="topline">Ένας κόσμος βιβλίων. Μια σελίδα τη φορά.</span>
		<a class="index-link" href="/tags">Εξερεύνησε τη βιβλιοθήκη <ArrowUpRight size={14} /></a>
	</div>
	<div class="nav-border">
		<div class="shell navigation">
			<nav class="desktop-nav" aria-label="Κύρια πλοήγηση">
				<a
					href="/"
					class:active={page.url.pathname === '/'}
					aria-current={page.url.pathname === '/' ? 'page' : undefined}>Αρχική</a
				>
				{#each links as link}
					<a
						href={link.href}
						class:active={page.url.pathname.startsWith(link.href)}
						aria-current={page.url.pathname.startsWith(link.href) ? 'page' : undefined}
						>{link.label}</a
					>
				{/each}
			</nav>
			<a class="mobile-brand" href="/">Books Are Cool<span aria-hidden="true">✳</span></a>
			<div class="nav-actions">
				<button class="search-button" onclick={search} aria-label="Αναζήτηση βιβλίων"
					><Search size={17} strokeWidth={1.5} /><span>Αναζήτηση</span><kbd>⌘ K</kbd></button
				>
				<button
					class="menu-button"
					onclick={() => (menuOpen = !menuOpen)}
					aria-expanded={menuOpen}
					aria-controls="mobile-navigation"
					aria-label={menuOpen ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού'}
					>{#if menuOpen}<X size={22} />{:else}<Menu size={22} />{/if}</button
				>
			</div>
		</div>
	</div>
	{#if menuOpen}
		<nav id="mobile-navigation" class="mobile-nav shell" aria-label="Πλοήγηση κινητού">
			<a href="/" onclick={() => (menuOpen = false)}>Αρχική <ArrowUpRight size={18} /></a>
			{#each links as link}<a href={link.href} onclick={() => (menuOpen = false)}
					>{link.label}<ArrowUpRight size={18} /></a
				>{/each}
			<a href="/tags" onclick={() => (menuOpen = false)}
				>Όλες οι κατηγορίες <ArrowUpRight size={18} /></a
			>
		</nav>
	{/if}
</header>

<style>
	.site-header {
		background: var(--paper);
		position: relative;
		z-index: 30;
	}
	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 66px;
		gap: 24px;
	}
	.small-brand {
		font-family: Georgia, serif;
		font-weight: 700;
		font-size: 34px;
		letter-spacing: -4px;
		display: flex;
		align-items: center;
		gap: 0;
	}
	.small-brand span {
		font-style: italic;
	}
	.small-brand i {
		font-size: 30px;
		font-style: normal;
		color: var(--red);
		margin-left: 10px;
		letter-spacing: 0;
	}
	.topline {
		font-size: 10px;
		color: var(--color-text-gray);
		letter-spacing: 0.05em;
	}
	.index-link {
		display: flex;
		gap: 12px;
		align-items: center;
		font-size: 10px;
	}
	.index-link:hover {
		color: var(--red);
	}
	.nav-border {
		border-block: 1px solid var(--line);
	}
	.navigation {
		min-height: 56px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
	}
	.desktop-nav {
		display: flex;
		gap: clamp(18px, 2.6vw, 38px);
		align-self: stretch;
	}
	.desktop-nav a {
		display: flex;
		align-items: center;
		font-size: 11px;
		border-bottom: 2px solid transparent;
		padding-top: 2px;
	}
	.desktop-nav a:hover,
	.desktop-nav a.active {
		color: var(--red);
		border-color: var(--red);
	}
	.nav-actions {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.search-button {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 11px;
		padding-block: 12px;
	}
	kbd {
		font-size: 9px;
		color: var(--color-text-light);
		border: 1px solid var(--line);
		padding: 2px 4px;
		margin-left: 8px;
	}
	.mobile-brand,
	.menu-button {
		display: none;
	}
	.mobile-nav {
		padding-block: 16px 30px;
	}
	.mobile-nav a {
		display: flex;
		justify-content: space-between;
		padding: 16px 0;
		border-bottom: 1px solid var(--line);
		font-size: 14px;
	}
	@media (min-width: 1051px) {
		.mobile-nav {
			display: none;
		}
	}
	@media (max-width: 1050px) {
		.desktop-nav,
		.topbar,
		kbd {
			display: none;
		}
		.mobile-brand {
			display: block;
			font-family: Georgia, serif;
			font-weight: 700;
			font-size: 23px;
			letter-spacing: -1px;
		}
		.mobile-brand span {
			font-family: var(--font-sans);
			font-size: 9px;
			vertical-align: super;
			margin-left: 3px;
		}
		.menu-button {
			display: flex;
			padding: 10px 0 10px 10px;
		}
		.navigation {
			min-height: 72px;
		}
	}
	@media (max-width: 420px) {
		.search-button span {
			display: none;
		}
	}
</style>
