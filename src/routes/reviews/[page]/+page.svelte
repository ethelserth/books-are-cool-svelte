<script lang="ts">
    import type { PageData } from './$types';
    import ArticleCard from '$lib/components/ArticleCard.svelte';
    import Pagination from '$lib/components/Pagination.svelte';
    
    let { data }: { data: PageData } = $props();
  </script>
  
  <svelte:head>
    <title>Reviews - Page {data.pagination.currentPage} | Books Are Cool</title>
    <meta name="description" content="Book reviews and literary criticism - Page {data.pagination.currentPage}" />
  </svelte:head>
  
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-bold text-text-black mb-4">
        Book Reviews
      </h1>
      <p class="text-xl text-text-gray max-w-2xl mx-auto">
        In-depth reviews and literary analysis of contemporary and classic literature
      </p>
    </div>
  
    <!-- Articles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each data.articles as article (article.id)}
        <ArticleCard {article} />
      {/each}
    </div>
  
    <!-- Pagination -->
    <Pagination 
      currentPage={data.pagination.currentPage}
      totalPages={data.pagination.totalPages}
      totalArticles={data.pagination.totalArticles}
      baseUrl="/reviews"
    />
  </main>