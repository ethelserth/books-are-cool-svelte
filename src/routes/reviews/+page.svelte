<script lang="ts">
  import ArticleCard from '$lib/components/ArticleCard.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import { intersectionObserver } from '$lib/actions/intersectionObserver';
  import type { Article } from '$lib/types';
  
  interface PageData {
    articles: Article[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalArticles: number;
      articlesPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }
  
  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Όλες οι Κριτικές {data.pagination.currentPage > 1 ? `- Σελίδα ${data.pagination.currentPage}` : ''} - Books Are Cool</title>
  <meta name="description" content="Περιηγηθείτε σε όλες τις κριτικές βιβλίων και τη λογοτεχνική μας κριτική. Σύγχρονη πεζογραφία, κλασικά και αναδυόμενες φωνές - σελίδα {data.pagination.currentPage} από {data.pagination.totalPages}." />
  <meta name="keywords" content="κριτικές βιβλίων, λογοτεχνική κριτική, σύγχρονη πεζογραφία, προτάσεις βιβλίων, λογοτεχνία, σελίδα {data.pagination.currentPage}" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="Όλες οι Κριτικές {data.pagination.currentPage > 1 ? `- Σελίδα ${data.pagination.currentPage}` : ''} - Books Are Cool" />
  <meta property="og:description" content="Περιηγηθείτε σε όλες τις κριτικές βιβλίων και τη λογοτεχνική μας κριτική" />
  <meta property="og:type" content="website" />
  
  <!-- Pagination SEO -->
  {#if data.pagination.hasPreviousPage}
    <link rel="prev" href="/reviews{data.pagination.currentPage === 2 ? '' : `?page=${data.pagination.currentPage - 1}`}" />
  {/if}
  {#if data.pagination.hasNextPage}
    <link rel="next" href="/reviews?page={data.pagination.currentPage + 1}" />
  {/if}
  
  <!-- Canonical URL -->
  <link rel="canonical" href="/reviews{data.pagination.currentPage === 1 ? '' : `?page=${data.pagination.currentPage}`}" />
</svelte:head>

<!-- Page Header -->
<section class="max-w-7xl mx-auto mt-8 mb-12 px-8">
  <!-- Breadcrumb -->
  <nav class="mb-8" aria-label="Breadcrumb">
    <ol class="flex items-center gap-2 text-sm text-text-light">
      <li><a href="/" class="hover:text-accent-red">Αρχική</a></li>
      <li class="before:content-['/'] before:mx-2 text-text-gray" aria-current="page">
        Όλες οι Κριτικές
      </li>
    </ol>
  </nav>
  
  <!-- Page Title -->
  <div class="flex items-center mb-8">
    <h1 style="font-family: 'Playfair Display', serif" class="text-4xl lg:text-5xl font-black text-text-black uppercase tracking-tight">
      Όλες οι Κριτικές
    </h1>
    <div class="flex-1 h-1 gradient-news ml-8"></div>
  </div>
  
  <!-- Page Info -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
    <p class="text-text-gray text-lg">
      Ανακαλύψτε την πλήρη συλλογή των κριτικών βιβλίων και της λογοτεχνικής μας κριτικής
    </p>
    <div class="flex items-center gap-4 text-sm text-text-light">
      <span>{data.pagination.totalArticles} συνολικές κριτικές</span>
      <span>•</span>
      <span>Σελίδα {data.pagination.currentPage} από {data.pagination.totalPages}</span>
    </div>
  </div>
</section>

<!-- Articles Grid -->
<section class="max-w-7xl mx-auto px-8 mb-16">
  {#if data.articles.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each data.articles as article}
        <div use:intersectionObserver>
          <ArticleCard {article} />
        </div>
      {/each}
    </div>
    
    <!-- Pagination -->
    <Pagination 
      currentPage={data.pagination.currentPage}
      totalPages={data.pagination.totalPages}
      totalArticles={data.pagination.totalArticles}
    />
  {:else}
    <!-- Empty State -->
    <div class="text-center py-16">
      <h2 class="text-2xl font-bold text-text-black mb-4">Δεν βρέθηκαν κριτικές</h2>
      <p class="text-text-gray mb-8">Δεν μπορέσαμε να βρούμε δημοσιευμένες κριτικές αυτή τη στιγμή.</p>
      <a 
        href="/"
        class="inline-flex items-center gap-2 bg-accent-red text-white px-6 py-3 font-semibold hover:bg-red-700 transition-colors duration-300"
      >
        Επιστροφή στην Αρχική
      </a>
    </div>
  {/if}
</section>

<!-- Quote Box -->
<section class="max-w-7xl mx-auto px-8 mb-16">
  <div class="bg-light-gray border-l-4 border-accent-red p-8 relative">
    <blockquote style="font-family: 'Playfair Display', serif" class="text-2xl italic text-text-black leading-relaxed mb-4">
      "Όσα περισσότερα διαβάζεις, τόσα περισσότερα πράγματα θα μάθεις. Όσα περισσότερα μαθαίνεις, τόσα περισσότερα μέρη θα πας."
    </blockquote>
    <cite class="font-semibold text-text-gray text-right block">
      — Dr. Seuss
    </cite>
  </div>
</section>