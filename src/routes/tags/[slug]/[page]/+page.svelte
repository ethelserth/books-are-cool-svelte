<script lang="ts">
    import ArticleCard from '$lib/components/ArticleCard.svelte';
    import TagPagination from '$lib/components/TagPagination.svelte';
    import { Tag } from 'lucide-svelte';
    import { intersectionObserver } from '$lib/actions/intersectionObserver';
    import type { Article } from '$lib/types';
    
    interface PaginationData {
      currentPage: number;
      totalPages: number;
      totalArticles: number;
      articlesPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    }
    
    interface PageData {
      tag: string;
      tagSlug: string;
      articles: Article[];
      articleCount: number;
      pagination: PaginationData;
    }
    
    let { data }: { data: PageData } = $props();
  </script>
  
  <svelte:head>
    <title>Tag: {data.tag} - Page {data.pagination.currentPage} - Books Are Cool</title>
    <meta name="description" content="Articles tagged with {data.tag}. Discover {data.articleCount} book reviews and literary analysis - page {data.pagination.currentPage} of {data.pagination.totalPages}." />
    <meta name="keywords" content="{data.tag}, book reviews, literary criticism, page {data.pagination.currentPage}" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="Tag: {data.tag} - Page {data.pagination.currentPage} - Books Are Cool" />
    <meta property="og:description" content="Articles tagged with {data.tag}" />
    <meta property="og:type" content="website" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Tag: {data.tag} - Page {data.pagination.currentPage} - Books Are Cool" />
    <meta name="twitter:description" content="Articles tagged with {data.tag}" />
    
    <!-- Pagination SEO -->
    {#if data.pagination.hasPreviousPage}
      <link rel="prev" href="/tags/{data.tagSlug}{data.pagination.currentPage === 2 ? '' : `/${data.pagination.currentPage - 1}`}" />
    {/if}
    {#if data.pagination.hasNextPage}
      <link rel="next" href="/tags/{data.tagSlug}/{data.pagination.currentPage + 1}" />
    {/if}
    
    <!-- Canonical URL -->
    <link rel="canonical" href="/tags/{data.tagSlug}{data.pagination.currentPage === 1 ? '' : `/${data.pagination.currentPage}`}" />
  </svelte:head>
  
  <!-- Breadcrumb Navigation -->
  <nav class="max-w-7xl mx-auto px-8 pt-8" aria-label="Breadcrumb">
    <ol class="flex items-center gap-2 text-sm text-text-light">
      <li><a href="/" class="hover:text-accent-red">Home</a></li>
      <li class="before:content-['/'] before:mx-2">
        <a href="/tags" class="hover:text-accent-red">Tags</a>
      </li>
      <li class="before:content-['/'] before:mx-2 text-text-gray" aria-current="page">
        {data.tag}
      </li>
    </ol>
  </nav>
  
  <!-- Page Header -->
  <header class="max-w-7xl mx-auto px-8 py-12">
    <div class="flex flex-col sm:flex-row items-start gap-6 mb-8">
      <!-- Tag Icon -->
      <div class="flex-shrink-0">
        <div class="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-accent-red flex items-center justify-center">
          <Tag size={28} class="text-white" />
        </div>
      </div>
      
      <!-- Tag Info -->
      <div class="flex-1">
        <h1 style="font-family: 'Playfair Display', serif" class="text-4xl lg:text-5xl font-black text-text-black mb-4">
          {data.tag}
        </h1>
        
        <p class="text-text-gray text-lg mb-4 leading-relaxed">
          {data.articleCount} {data.articleCount === 1 ? 'article' : 'articles'} tagged with "{data.tag}"
        </p>
        
        <div class="flex flex-wrap items-center gap-4 text-sm text-text-light">
          <span class="bg-light-gray px-3 py-1 rounded-full">#{data.tagSlug}</span>
          <span>•</span>
          <span>Page {data.pagination.currentPage} of {data.pagination.totalPages}</span>
        </div>
      </div>
    </div>
  </header>
  
  <!-- Articles Section -->
  <section class="max-w-7xl mx-auto px-8 pb-16">
    {#if data.articles.length > 0}
      <!-- Section Header -->
      <div class="flex items-center mb-12">
        <h2 style="font-family: 'Playfair Display', serif" class="text-3xl font-black text-text-black uppercase tracking-tight">
          Articles in {data.tag}
        </h2>
        <div class="flex-1 h-1 gradient-news ml-8"></div>
      </div>
      
      <!-- Articles Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each data.articles as article}
          <div use:intersectionObserver>
            <ArticleCard {article} />
          </div>
        {/each}
      </div>
      
      <!-- Pagination -->
      <TagPagination 
        currentPage={data.pagination.currentPage}
        totalPages={data.pagination.totalPages}
        totalArticles={data.pagination.totalArticles}
        tagSlug={data.tagSlug}
      />
      
    {:else}
      <!-- Empty State -->
      <div class="text-center py-16">
        <div class="w-16 h-16 bg-light-gray rounded-full flex items-center justify-center mx-auto mb-6">
          <Tag size={24} class="text-text-light" />
        </div>
        <h2 class="text-2xl font-bold text-text-black mb-4">No articles found</h2>
        <p class="text-text-gray mb-8 max-w-md mx-auto">
          No published articles are tagged with "{data.tag}" on this page. 
          Check other pages or browse all tags.
        </p>
        <a 
          href="/tags"
          class="inline-flex items-center gap-2 bg-accent-red text-white px-6 py-3 font-semibold hover:bg-red-700 transition-colors duration-300"
        >
          Browse All Tags
        </a>
      </div>
    {/if}
  </section>
  
  <!-- Back Navigation -->
  <div class="max-w-7xl mx-auto px-8 pb-8">
    <a 
      href="/tags"
      class="inline-flex items-center gap-2 text-accent-red font-semibold hover:underline"
    >
      ← All Tags
    </a>
  </div>