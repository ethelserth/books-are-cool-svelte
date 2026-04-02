<script lang="ts">
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';
  
  interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalArticles: number;
    baseUrl?: string;
    itemType?: string;
  }
  
  let { 
    currentPage, 
    totalPages, 
    totalArticles, 
    baseUrl = '/reviews',
    itemType = 'reviews'
  }: PaginationProps = $props();
  
  function generatePageNumbers(): (number | string)[] {
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const pages: (number | string)[] = [];
    
    // Always show first page
    pages.push(1);
    
    if (currentPage <= 4) {
      // Show 1, 2, 3, 4, 5, ..., last
      pages.push(2, 3, 4, 5);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      // Show 1, ..., n-4, n-3, n-2, n-1, n
      pages.push('...');
      pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      // Show 1, ..., current-1, current, current+1, ..., last
      pages.push('...');
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  }
  
  const pageNumbers = $derived(generatePageNumbers());
  const hasPrevious = $derived(currentPage > 1);
  const hasNext = $derived(currentPage < totalPages);
  
  // Generate URL for page navigation
  function getPageUrl(pageNum: number): string {
    if (pageNum === 1) {
      return baseUrl;
    }
    return `${baseUrl}/${pageNum}`;
  }

  // Calculate items per page based on item type
  const itemsPerPage = $derived(itemType === 'tags' ? 24 : 12);
  
  // Greek translation for item types
  function getItemTypeInGreek(itemType: string): string {
    switch(itemType) {
      case 'reviews': return 'κριτικές';
      case 'tags': return 'ετικέτες';
      default: return itemType;
    }
  }
</script>

{#if totalPages > 1}
  <nav class="flex items-center justify-center mt-16 mb-8" aria-label="Pagination">
    <div class="flex items-center gap-2">
      <!-- Previous Button -->
      {#if hasPrevious}
        <a
          href={getPageUrl(currentPage - 1)}
          data-sveltekit-preload-data="hover"
          class="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-gray border border-border-light hover:border-accent-red hover:text-accent-red transition-colors duration-300"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
          <span class="hidden sm:inline">Προηγούμενη</span>
        </a>
      {:else}
        <span class="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-light border border-border-light opacity-50 cursor-not-allowed">
          <ChevronLeft size={16} />
          <span class="hidden sm:inline">Προηγούμενη</span>
        </span>
      {/if}
      
      <!-- Page Numbers -->
      <div class="flex items-center gap-1">
        {#each pageNumbers as pageNum}
          {#if pageNum === '...'}
            <span class="px-3 py-2 text-text-light">...</span>
          {:else if currentPage === pageNum}
            <!-- Current page - not clickable -->
            <span
              class="px-3 py-2 text-sm font-medium bg-accent-red text-white border border-accent-red"
              aria-label="Page {pageNum}"
              aria-current="page"
            >
              {pageNum} 
            </span>
          {:else}
            <!-- Other pages - clickable links -->
            <a
              href={getPageUrl(pageNum as number)}
              data-sveltekit-preload-data="hover"
              class="px-3 py-2 text-sm font-medium border text-text-gray border-border-light hover:border-accent-red hover:text-accent-red transition-colors duration-300"
              aria-label="Page {pageNum}"
            >
              {pageNum}
            </a>
          {/if}
        {/each}
      </div>
      
      <!-- Next Button -->
      {#if hasNext}
        <a
          href={getPageUrl(currentPage + 1)}
          data-sveltekit-preload-data="hover"
          class="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-gray border border-border-light hover:border-accent-red hover:text-accent-red transition-colors duration-300"
          aria-label="Next page"
        >
          <span class="hidden sm:inline">Επόμενη</span>
          <ChevronRight size={16} />
        </a>
      {:else}
        <span class="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-light border border-border-light opacity-50 cursor-not-allowed">
          <span class="hidden sm:inline">Επόμενη</span>
          <ChevronRight size={16} />
        </span>
      {/if}
    </div>
  </nav>
  
  <!-- Results Info -->
  <div class="text-center text-sm text-text-light mb-8">
    Εμφάνιση {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalArticles)} από {totalArticles} {getItemTypeInGreek(itemType)}
  </div>
{/if}