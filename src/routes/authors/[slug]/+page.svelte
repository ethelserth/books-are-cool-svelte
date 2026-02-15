<script lang="ts">
  import ArticleCard from '$lib/components/ArticleCard.svelte';
  import { User } from 'lucide-svelte';
  import { intersectionObserver } from '$lib/actions/intersectionObserver';
  import type { Article } from '$lib/types';
  
  interface AuthorDetails {
    id: string;
    name: string;
    slug: string;
    description: string;
    image?: string | null;
    articleCount: number;
  }
  
  interface PageData {
    author: string;
    authorDetails: AuthorDetails;
    articles: Article[];
    articleCount: number;
  }
  
  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Συγγραφέας: {data.author} - Books Are Cool</title>
  <meta name="description" content="{data.authorDetails.description}" />
  <meta name="keywords" content="{data.author}, κριτικές βιβλίων, λογοτεχνική κριτική, συγγραφέας" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="Συγγραφέας: {data.author} - Books Are Cool" />
  <meta property="og:description" content="{data.authorDetails.description}" />
  <meta property="og:type" content="profile" />
  {#if data.authorDetails.image}
    <meta property="og:image" content="{data.authorDetails.image}" />
  {/if}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Συγγραφέας: {data.author} - Books Are Cool" />
  <meta name="twitter:description" content="{data.authorDetails.description}" />
  {#if data.authorDetails.image}
    <meta name="twitter:image" content="{data.authorDetails.image}" />
  {/if}
</svelte:head>

<!-- Breadcrumb Navigation -->
<nav class="max-w-7xl mx-auto px-8 pt-8" aria-label="Breadcrumb">
  <ol class="flex items-center gap-2 text-sm text-text-light">
    <li><a href="/" class="hover:text-accent-red">Αρχική</a></li>
    <li class="before:content-['/'] before:mx-2">
      <a href="/reviews" class="hover:text-accent-red">Κριτικές</a>
    </li>
    <li class="before:content-['/'] before:mx-2 text-text-gray" aria-current="page">
      {data.author}
    </li>
  </ol>
</nav>

<!-- Author Header -->
<header class="max-w-7xl mx-auto px-8 py-12">
  <div class="flex flex-col sm:flex-row items-start gap-6 mb-8">
    <!-- Author Image or Icon -->
    <div class="flex-shrink-0">
      {#if data.authorDetails.image}
        <img 
          src={data.authorDetails.image} 
          alt={data.author}
          class="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover border-4 border-accent-red"
        />
      {:else}
        <div class="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-accent-red flex items-center justify-center">
          <User size={32} class="text-white" />
        </div>
      {/if}
    </div>
    
    <!-- Author Info -->
    <div class="flex-1">
      <h1 style="font-family: 'Playfair Display', serif" class="text-4xl lg:text-5xl font-black text-text-black mb-4">
        {data.author}
      </h1>
      
      <p class="text-text-gray text-lg mb-4 leading-relaxed">
        {data.authorDetails.description}
      </p>
      
      <div class="flex flex-wrap items-center gap-4 text-sm text-text-light">
        <span class="flex items-center gap-1">
          <strong class="text-text-gray">{data.articleCount}</strong>
          {data.articleCount === 1 ? 'Βιβλίο' : 'βιβλία'}
        </span>
        {#if data.authorDetails.slug}
          <span>•</span>
          <span class="bg-light-gray px-2 py-1 rounded text-xs">@{data.authorDetails.slug}</span>
        {/if}
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
        Βιβλία από {data.author}
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
    
    <!-- Author Stats -->
    <div class="mt-16 bg-light-gray border-l-4 border-accent-red p-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <div class="text-2xl font-bold text-accent-red mb-2">{data.articleCount}</div>
          <div class="text-text-gray text-sm uppercase tracking-wide">Βιβλία</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-accent-red mb-2">
            {Math.round(data.articles.reduce((sum, article) => sum + (article.rating || 0), 0) / data.articles.length * 10) / 10 || 0}
          </div>
          <div class="text-text-gray text-sm uppercase tracking-wide">Μέση Βαθμολογία</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-accent-red mb-2">
            {new Set(data.articles.map(article => article.category)).size}
          </div>
          <div class="text-text-gray text-sm uppercase tracking-wide">Κατηγορίες</div>
        </div>
      </div>
    </div>
    
  {:else}
    <!-- Empty State -->
    <div class="text-center py-16">
      <div class="w-16 h-16 bg-light-gray rounded-full flex items-center justify-center mx-auto mb-6">
        <User size={24} class="text-text-light" />
      </div>
      <h2 class="text-2xl font-bold text-text-black mb-4">Δεν βρέθηκαν κριτικές</h2>
      <p class="text-text-gray mb-8 max-w-md mx-auto">
        Δεν υπάρχουν δημοσιευμένες κριτικές από {data.author} προς το παρόν. 
        Επισκεφθείτε ξανά για νέο περιεχόμενο.
      </p>
      <a 
        href="/reviews"
        class="inline-flex items-center gap-2 bg-accent-red text-white px-6 py-3 font-semibold hover:bg-red-700 transition-colors duration-300"
      >
        Περιήγηση σε Όλες τις Κριτικές
      </a>
    </div>
  {/if}
</section>

<!-- Back Navigation -->
<div class="max-w-7xl mx-auto px-8 pb-8">
  <a 
    href="/reviews"
    class="inline-flex items-center gap-2 text-accent-red font-semibold hover:underline"
  >
    ← Επιστροφή στις Κριτικές
  </a>
</div>