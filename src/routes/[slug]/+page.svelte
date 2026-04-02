<script lang="ts">
  import { page } from '$app/stores';
  import { Share2, Bookmark, Clock, Tag } from 'lucide-svelte';
  import StarRating from '$lib/components/StarRating.svelte';
  import Meta from '$lib/components/Meta.svelte';
  
  interface Article {
    id: string;
    title: string;
    author: string;
    category: string;
    excerpt: string;
    image: string;
    rating: number;
    ratingText: string;
    date: string;
    publishedAt?: string;
    slug?: string;
    content?: string;
    tags?: string[];
    readingTime?: string;
    authorSlug?: string;
  }
  
  interface PageData {
    article: Article;
    relatedArticles: Article[];
  }
  
  let { data }: { data: PageData } = $props();
  
  function formatDateLong(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  function shareArticle() {
    if (navigator.share) {
      navigator.share({
        title: data.article.title,
        text: data.article.excerpt,
        url: window.location.href,
      });
    }
  }
  
  function bookmarkArticle() {
    console.log('Article bookmarked');
  }
  
  function createTagSlug(tag: string): string {
    return tag.toLowerCase().replace(/\s+/g, '-');
  }
</script>

<Meta 
  title={data.article.title}
  description={data.article.excerpt}
  url="/{data.article.slug}"
  type="article"
  image={data.article.image}
  author={data.article.author}
  publishedTime={data.article.publishedAt || data.article.date + 'T10:00:00Z'}
  tags={data.article.tags}
  rating={data.article.rating}
  keywords={data.article.tags?.join(', ')}
/>

<!-- Breadcrumb Navigation -->
<nav class="max-w-4xl mx-auto px-8 pt-8" aria-label="Breadcrumb">
  <ol class="flex items-center gap-2 text-sm text-text-light">
    <li><a href="/" class="hover:text-accent-red">Home</a></li>
    <li class="before:content-['/'] before:mx-2">
      <a href="/reviews" class="hover:text-accent-red">Reviews</a>
    </li>
    <li class="before:content-['/'] before:mx-2 text-text-gray" aria-current="page">
      {data.article.title}
    </li>
  </ol>
</nav>

<!-- Article Header -->
<header class="max-w-4xl mx-auto px-8 py-12">
  <div class="mb-6">
    <a 
      href="/tags/{createTagSlug(data.article.category)}"
      class="inline-block bg-accent-red text-white py-1 px-3 text-sm font-bold uppercase tracking-wide hover:bg-red-700 transition-colors duration-300"
    >
      {data.article.category}
    </a>
  </div>
  
  <h1 style="font-family: 'Playfair Display', serif" class="text-4xl lg:text-5xl font-black leading-tight text-text-black mb-6">
    {data.article.title}
  </h1>
  
  <div class="flex flex-wrap items-center gap-6 text-text-light text-sm mb-8">
    <span class="flex items-center gap-2">
      <Clock size={16} />
      {data.article.readingTime}
    </span>
    <span>{formatDateLong(data.article.date)}</span>
    <span>
      By 
      {#if data.article.authorSlug}
        <a 
          href="/authors/{data.article.authorSlug}" 
          class="font-semibold text-text-gray hover:text-accent-red transition-colors duration-300"
        >
          {data.article.author}
        </a>
      {:else}
        <strong class="text-text-gray">{data.article.author}</strong>
      {/if}
    </span>
  </div>
  
  <!-- Article Rating -->
  <div class="flex items-center justify-between mb-8">
    <StarRating 
      rating={data.article.rating} 
      size="large" 
      showText={true} 
      ratingText={data.article.ratingText} 
    />
    
    <!-- Action Buttons -->
    <div class="flex items-center gap-3">
      <button
        onclick={shareArticle}
        class="flex items-center gap-2 px-4 py-2 border border-border-light hover:border-accent-red hover:text-accent-red transition-colors duration-300"
        type="button"
      >
        <Share2 size={16} />
        <span class="hidden sm:inline">Share</span>
      </button>
      <button
        onclick={bookmarkArticle}
        class="flex items-center gap-2 px-4 py-2 border border-border-light hover:border-accent-red hover:text-accent-red transition-colors duration-300"
        type="button"
      >
        <Bookmark size={16} />
        <span class="hidden sm:inline">Save</span>
      </button>
    </div>
  </div>
  
  <!-- Hero Image -->
  <div class="relative overflow-hidden rounded-lg">
    <img 
      src={data.article.image} 
      alt={data.article.title}
      class="w-full h-64 lg:h-96 object-cover"
    />
  </div>
</header>

<!-- Article Content -->
<article class="max-w-4xl mx-auto px-8 pb-16">
  <div class="prose prose-lg max-w-none text-text-gray leading-relaxed" style="font-family: 'Crimson Pro', serif">
    <!-- Article Excerpt -->
    <div class="text-xl leading-relaxed mb-12 text-text-black border-l-4 border-accent-red pl-6">
      <span class="drop-cap">{data.article.excerpt.charAt(0)}</span>{data.article.excerpt.slice(1)}
    </div>
    
    <!-- Main Content -->
    <div class="article-content">
      {@html data.article.content || '<p>No content available.</p>'}
    </div>
  </div>
  
  <!-- Tags -->
  {#if data.article.tags && data.article.tags.length > 0}
    <div class="mt-12 pt-8 border-t border-border-light">
      <div class="flex items-center gap-3 flex-wrap">
        <Tag size={18} class="text-text-light" />
        <span class="font-semibold text-text-gray">Tags:</span>
        {#each data.article.tags as tag}
          <a 
            href="/tags/{createTagSlug(tag)}"
            class="bg-light-gray text-text-gray px-3 py-1 text-sm rounded-full hover:bg-accent-red hover:text-white transition-colors duration-300"
          >
            {tag}
          </a>
        {/each}
      </div>
    </div>
  {/if}
</article>

<!-- Back to Top -->
<div class="max-w-4xl mx-auto px-8 pb-8">
  <a 
    href="/"
    class="inline-flex items-center gap-2 text-accent-red font-semibold hover:underline"
  >
    ← Back to Home
  </a>
</div>

<style>
  :global(.article-content h2) {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-text-black);
    margin-top: 3rem;
    margin-bottom: 1.5rem;
  }
  
  :global(.article-content h3) {
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--color-text-black);
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  
  :global(.article-content p) {
    margin-bottom: 1.5rem;
    line-height: 1.7;
  }
  
  :global(.article-content blockquote) {
    background-color: var(--color-light-gray);
    border-left: 4px solid var(--color-accent-red);
    padding: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    font-size: 1.25rem;
  }
  
  :global(.article-content blockquote p) {
    margin-bottom: 0;
  }
</style>