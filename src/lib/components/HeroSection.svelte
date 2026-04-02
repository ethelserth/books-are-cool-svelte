<script lang="ts">
    const trendingItems = [
      { title: "Colson Whitehead's New Novel", date: "March 14, 2025" },
      { title: "BookTok's Influence on Publishing", date: "March 13, 2025" },
      { title: "Climate Fiction Rising", date: "March 12, 2025" }
    ];
  
    const editorsPick = {
      title: "Tomorrow, and Tomorrow, and Tomorrow",
      rating: "★★★★★ Essential Reading"
    };
  </script>
  
  <section class="max-w-7xl mx-auto my-12 px-8 grid lg:grid-cols-3 gap-12 border-b-2 border-text-black pb-12">
    <!-- Main Story -->
    <article class="lg:col-span-2 bg-white border-2 border-text-black p-10 relative">
      <div class="absolute -top-3 left-8 bg-white px-4 text-xs font-bold tracking-wide text-accent-red">
        FEATURED REVIEW
      </div>
      
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
        href="#" 
        class="inline-flex items-center gap-2 text-accent-red font-semibold text-sm uppercase tracking-wide hover:translate-x-1 transition-transform duration-300"
      >
        Continue Reading →
      </a>
    </article>
  
    <!-- Sidebar -->
    <aside class="flex flex-col gap-8">
      <!-- Trending Section -->
      <div class="border border-border-light bg-light-gray p-6">
        <h3 class="font-playfair text-xl font-bold text-text-black mb-4 uppercase tracking-wide border-b-2 border-accent-red pb-2">
          Trending Now
        </h3>
        
        {#each trendingItems as item}
          <div class="py-4 border-b border-border-light last:border-b-0">
            <h4 class="font-semibold text-text-black mb-2 leading-tight">
              {item.title}
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
            "{editorsPick.title}"
          </h4>
          <p class="text-sm text-text-light font-jetbrains">
            {editorsPick.rating}
          </p>
        </div>
      </div>
    </aside>
  </section>