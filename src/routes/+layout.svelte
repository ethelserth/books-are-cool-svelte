<script lang="ts">
	import '../app.css';
	// import CustomCursor from '$lib/components/CustomCursor.svelte';
	// import BreakingNews from '$lib/components/BreakingNews.svelte';
	import Header from '$lib/components/Header.svelte';
	import FloatingActions from '$lib/components/FloatingActions.svelte';
  import SearchModal from '$lib/components/SearchModal.svelte';

  let isSearchOpen = $state(false);
  
  function openSearch() {
    isSearchOpen = true;
  }
  
  function closeSearch() {
    isSearchOpen = false;
  }

</script>
  
<svelte:head>
	<title>Books Are Cool - Modern Literary Reviews</title>

  <link rel="icon" href="/favicon.ico" />

</svelte:head>
  
<!-- <CustomCursor /> -->
<!-- <BreakingNews /> -->
<Header onOpenSearch={openSearch} />
  
<main>
	<slot />
</main>
  
<FloatingActions onOpenSearch={openSearch} />
<SearchModal isOpen={isSearchOpen} onClose={closeSearch} />