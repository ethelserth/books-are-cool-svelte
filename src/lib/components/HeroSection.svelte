<script lang="ts">
  import type { Article } from '$lib/types';
  
  interface HeroSectionProps {
    featuredArticles?: Article[];
  }
  
  let { featuredArticles = [] }: HeroSectionProps = $props();
  
  // Get main featured article and sidebar featured articles
  const mainFeaturedArticle = featuredArticles.length > 0 ? featuredArticles[0] : null;
  const sidebarFeaturedArticles = featuredArticles.slice(1, 4);
  
  // Fallback items for trending section
  const fallbackItems = [
    { title: "Colson Whitehead's New Novel", date: "March 14, 2025" },
    { title: "BookTok's Influence on Publishing", date: "March 13, 2025" },
    { title: "Climate Fiction Rising", date: "March 12, 2025" }
  ];
  
  // Build trending items - use featured articles first, then fallback
  const trendingItems = [];
  sidebarFeaturedArticles.forEach(article => {
    trendingItems.push({
      title: article.title,
      date: article.date,
      slug: article.slug,
      isReal: true
    });
  });
  
  // Fill remaining slots with fallback
  const remaining = 3 - trendingItems.length;
  if (remaining > 0) {
    fallbackItems.slice(0, remaining).forEach(item => {
      trendingItems.push({ ...item, isReal: false });
    });
  }
</script>

<section class="max-w-7xl mx-auto my-12 px-8 grid lg:grid-cols-3 gap-12 border-b-2 border-text-black pb-12">
  <!-- Main Story -->
  <article class="lg:col-span-2 bg-white border-2 border-text-black p-10 relative">
    <div class="absolute -top-3 left-8 bg-white px-4 text-xs font-bold tracking-wide text-accent-red">
      FEATURED REVIEW
    </div>
    
    {#if mainFeaturedArticle}
      <!-- Featured Article Image -->
      <div class="mb-6 overflow-hidden">
        <img 
          src={mainFeaturedArticle.image} 
          alt={mainFeaturedArticle.title}
          class="w-full h-48 lg:h-56 object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <h2 class="font-playfair text-4xl lg:text-5xl font-black leading-tight text-text-black mb-4">
        <a href="/{mainFeaturedArticle.slug}" class="hover:text-accent-red transition-colors duration-300">
          {mainFeaturedArticle.title}
        </a>
      </h2>
      
      <p class="text-sm text-text-light mb-6 uppercase tracking-wide">
        By {mainFeaturedArticle.author} • {mainFeaturedArticle.category}
      </p>
      
      <div class="font-crimson text-xl leading-relaxed text-text-gray mb-8">
        <span class="drop-cap">{mainFeaturedArticle.excerpt.charAt(0)}</span>{mainFeaturedArticle.excerpt.slice(1)}
      </div>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="flex text-yellow-400">
            {#each Array(Math.floor(mainFeaturedArticle.rating)) as _}
              ★
            {/each}
            {#if mainFeaturedArticle.rating % 1 !== 0}
              ☆
            {/if}
          </div>
          <span class="text-sm font-semibold text-text-gray">{mainFeaturedArticle.ratingText}</span>
        </div>
        
        <a 
          href="/{mainFeaturedArticle.slug}"
          class="inline-flex items-center gap-2 text-accent-red font-semibold text-sm uppercase tracking-wide hover:translate-x-1 transition-transform duration-300"
        >
          Continue Reading →
        </a>
      </div>
    {:else}
      <!-- Fallback static content -->
      <h2 class="font-playfair text-4xl lg:text-5xl font-black leading-tight text-text-black mb-4">
        The Return of Magical Realism
      </h2>
      
      <p class="text-sm text-text-light mb-6 uppercase tracking-wide">
        By Sarah Chen, Literary Critic
      </p>
      
      <div class="font-crimson text-xl leading-relaxed text-text-gray mb-8">
        <span class="drop-cap">I</span>n an era dominated by stark realism and dystopian futures, a new generation of writers is rediscovering the transformative power of magical realism. From Isabel Allende's latest work to emerging voices from Latin America and beyond, this renaissance offers readers an escape into worlds where the impossible becomes inevitable.
      </div>
      
      <a 
        href="/reviews"
        class="inline-flex items-center gap-2 text-accent-red font-semibold text-sm uppercase tracking-wide hover:translate-x-1 transition-transform duration-300"
      >
        Continue Reading →
      </a>
    {/if}
  </article>

  <!-- Sidebar -->
  <aside class="flex flex-col gap-8">
    <!-- Trending/More Featured Section -->
    <div class="border border-border-light bg-light-gray p-6">
      <h3 class="font-playfair text-xl font-bold text-text-black mb-4 uppercase tracking-wide border-b-2 border-accent-red pb-2">
        {sidebarFeaturedArticles.length > 0 ? 'More Featured' : 'Trending Now'}
      </h3>
      
      {#each trendingItems as item}
        <div class="py-4 border-b border-border-light last:border-b-0">
          <h4 class="font-semibold text-text-black mb-2 leading-tight">
            {#if item.isReal && item.slug}
              <a href="/{item.slug}" class="hover:text-accent-red transition-colors duration-300">
                {item.title}
              </a>
            {:else}
              {item.title}
            {/if}
          </h4>
          <p class="text-sm text-text-light font-jetbrains">
            {item.date}
          </p>
        </div>
      {/each}
    </div>

    <!-- Editor's Pick -->
    <div class="border border-border-light bg-light-gray p-6">
      <h3 class="font-playfair text-xl font-bold text-text-black mb-4 uppercase tracking-wide border-b-2 border-accent-red pb-2">
        Editor's Pick
      </h3>
      
      <div class="py-4">
        <h4 class="font-semibold text-text-black mb-2 leading-tight">
          {#if mainFeaturedArticle}
            <a href="/{mainFeaturedArticle.slug}" class="hover:text-accent-red transition-colors duration-300">
              "{mainFeaturedArticle.title}"
            </a>
          {:else}
            "Tomorrow, and Tomorrow, and Tomorrow"
          {/if}
        </h4>
        <p class="text-sm text-text-light font-jetbrains">
          {#if mainFeaturedArticle}
            ★★★★★ {mainFeaturedArticle.ratingText}
          {:else}
            ★★★★★ Essential Reading
          {/if}
        </p>
      </div>
    </div>
  </aside>
</section>

<style>
  .drop-cap {
    float: left;
    font-family: 'Playfair Display', serif;
    font-size: 4rem;
    line-height: 3rem;
    padding-right: 0.5rem;
    padding-top: 0.25rem;
    color: var(--accent-red);
    font-weight: 900;
  }
</style>