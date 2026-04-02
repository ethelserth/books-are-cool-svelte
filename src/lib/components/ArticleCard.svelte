<script lang="ts">
  import StarRating from './StarRating.svelte';
  import type { Article } from '$lib/types';
  
  interface ArticleCardProps {
    article: Article;
  }
  
  let { article }: ArticleCardProps = $props();
  
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  function createTagSlug(tag: string): string {
    return tag.toLowerCase().replace(/\s+/g, '-');
  }
</script>

<a href="/{article.slug}" class="article-card group block bg-white border border-border-light transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent-red overflow-hidden h-full flex flex-col">
  <div class="article-header relative overflow-hidden flex-shrink-0">
    <img 
      src={article.image} 
      alt="{article.title} - Book review cover"
      class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
      decoding="async"
    />
    <div class="article-overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
      <span class="bg-accent-red text-white py-1 px-2 text-xs font-bold uppercase tracking-wide inline-block mb-3">
        {article.category}
      </span>
      <h3 style="font-family: 'Playfair Display', serif" class="text-white text-xl font-bold leading-tight mb-2 line-clamp-2">
        {article.title}
      </h3>
      <p class="text-white/90 text-sm">
        {article.author}
      </p>
    </div>
  </div>
  
  <div class="article-content p-6 flex-1 flex flex-col">
    <div class="excerpt-container mb-4">
      <p class="text-text-gray text-sm leading-relaxed">
        {article.excerpt}
      </p>
    </div>
    
    <div class="article-footer flex items-center justify-between pt-4 border-t border-border-light mt-auto">
      <StarRating rating={article.rating} size="small" />
      <span class="text-text-light text-xs">
        {formatDate(article.date)}
      </span>
    </div>
  </div>
</a>

<style>
  .article-card {
    position: relative;
  }
  
  .article-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: left 0.5s;
    z-index: 1;
    pointer-events: none;
  }
  
  .article-card:hover::before {
    left: 100%;
  }

  /* Fixed height container for excerpt to ensure all cards are same height */
  .excerpt-container {
    height: 5rem; /* Fixed height for exactly 4 lines */
    overflow: hidden;
  }

  .excerpt-container p {
    line-height: 1.25; /* Tighter line height for better fit */
    margin: 0; /* Remove default margin */
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>