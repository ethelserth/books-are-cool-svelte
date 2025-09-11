<script lang="ts">
  import HeroSection from '$lib/components/HeroSection.svelte';
  import SearchSection from '$lib/components/SearchSection.svelte';
  import SearchModal from '$lib/components/SearchModal.svelte';
  import ArticleCard from '$lib/components/ArticleCard.svelte';
  import { intersectionObserver } from '$lib/actions/intersectionObserver';
  import type { Article } from '$lib/types';

  interface PageData {
    articles: Article[];
    featuredArticles: Article[];
    totalArticles: number;
  }

  let { data }: { data: PageData } = $props();
  
  // Search modal state
  let isSearchOpen = $state(false);
  
  function openSearch() {
    isSearchOpen = true;
  }
  
  function closeSearch() {
    isSearchOpen = false;
  }
</script>

<svelte:head>
  <title>Books Are Cool - Modern Literary Reviews & Book Criticism</title>
  <meta name="description" content="Contemporary book reviews, literary criticism, and thoughtful analysis of the latest novels, classics, and emerging voices in literature." />
  <meta name="keywords" content="book reviews, literary criticism, contemporary fiction, book recommendations, literature" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="Books Are Cool - Modern Literary Reviews" />
  <meta property="og:description" content="Contemporary book reviews and literary criticism" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://booksarecool.gr" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Books Are Cool - Modern Literary Reviews" />
  <meta name="twitter:description" content="Contemporary book reviews and literary criticism" />
</svelte:head>

<HeroSection featuredArticles={data.featuredArticles} />
<SearchSection onOpenSearch={openSearch} />

<!-- Recent Reviews Section -->
<section class="max-w-7xl mx-auto my-16 px-8">
  <div class="flex items-center mb-12">
    <h2 style="font-family: 'Playfair Display', serif" class="text-4xl font-black text-text-black uppercase tracking-tight">
      Recent Reviews
    </h2>
    <div class="flex-1 h-1 gradient-news ml-8"></div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
    {#each data.articles as article}
      <div use:intersectionObserver>
        <ArticleCard {article} />
      </div>
    {/each}
  </div>

  <!-- Quote Box -->
  <div class="bg-light-gray border-l-4 border-accent-red p-8 my-16 relative">
    <blockquote style="font-family: 'Playfair Display', serif" class="text-2xl italic text-text-black leading-relaxed mb-4">
      "A reader lives a thousand lives before he dies. The man who never reads lives only one."
    </blockquote>
    <cite class="font-semibold text-text-gray text-right block">
      — George R.R. Martin
    </cite>
  </div>
</section>

<!-- Search Modal -->
<SearchModal 
  isOpen={isSearchOpen} 
  onClose={closeSearch} 
/>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>