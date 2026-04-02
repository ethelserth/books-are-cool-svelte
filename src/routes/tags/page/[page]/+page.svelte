<script lang="ts">
    import type { PageData } from './$types';
    import Pagination from '$lib/components/Pagination.svelte';
    
    let { data }: { data: PageData } = $props();
  </script>
  
  <svelte:head>
    <title>Tags - Page {data.pagination.currentPage} | Books Are Cool</title>
    <meta name="description" content="Browse book tags and categories - Page {data.pagination.currentPage}" />
  </svelte:head>
  
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-bold text-text-black mb-4">
        Browse by Tags
      </h1>
      <p class="text-xl text-text-gray max-w-2xl mx-auto">
        Discover books by genre, theme, and category
      </p>
    </div>
  
    <!-- Tags Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {#each data.tags as tag (tag.slug)}
        <!-- Use your existing tag display component here -->
        <a 
          href="/tags/{tag.slug}"
          class="group bg-white border border-border-light p-6 hover:border-accent-red hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold text-text-black group-hover:text-accent-red transition-colors duration-300">
              {tag.name}
            </h3>
            <span class="text-sm text-text-light bg-light-gray px-2 py-1 rounded">
              {tag.count}
            </span>
          </div>
          
          <p class="text-sm text-text-gray">
            {tag.count} {tag.count === 1 ? 'article' : 'articles'}
          </p>
        </a>
      {/each}
    </div>
  
    <!-- Pagination -->
    <Pagination 
      currentPage={data.pagination.currentPage}
      totalPages={data.pagination.totalPages}
      totalArticles={data.pagination.totalTags}
      baseUrl="/tags/page"
      itemType="tags"
    />
  </main>