<script lang="ts">
	import '../app.css';
	// import CustomCursor from '$lib/components/CustomCursor.svelte';
	// import BreakingNews from '$lib/components/BreakingNews.svelte';
	import Header from '$lib/components/Header.svelte';
	import FloatingActions from '$lib/components/FloatingActions.svelte';
  </script>
  
  <svelte:head>
	<title>Books Are Cool - Modern Literary Reviews</title>
	<meta name="description" content="Contemporary book reviews and literary criticism" />
  </svelte:head>
  
  <!-- <CustomCursor /> -->
  <!-- <BreakingNews /> -->
  <Header />
  
  <main>
	<slot />
  </main>
  
  <FloatingActions />