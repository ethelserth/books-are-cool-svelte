<script lang="ts">
    import { Search, X } from 'lucide-svelte';
    import type { Article } from '$lib/types';
    
    interface SearchModalProps {
      isOpen: boolean;
      onClose: () => void;
    }
    
    let { isOpen, onClose }: SearchModalProps = $props();
    
    let searchInput: HTMLInputElement;
    let query = $state('');
    let results = $state<Article[]>([]);
    let isSearching = $state(false);
    let hasSearched = $state(false);
    let searchTimeout: number;
    
    // Watch for isOpen changes to focus input - using $effect instead of $:
    $effect(() => {
      if (isOpen && searchInput) {
        setTimeout(() => searchInput.focus(), 100);
      }
    });
    
    function debounceSearch() {
      clearTimeout(searchTimeout);
      
      if (query.trim().length < 2) {
        results = [];
        hasSearched = false;
        return;
      }
      
      searchTimeout = setTimeout(async () => {
        await performSearch();
      }, 300); // 300ms debounce
    }
    
    async function performSearch() {
      if (!query.trim() || query.trim().length < 2) return;
      
      isSearching = true;
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=15`);
        const data = await response.json();
        
        results = data.results || [];
        hasSearched = true;
      } catch (error) {
        console.error('Search failed:', error);
        results = [];
        hasSearched = true;
      } finally {
        isSearching = false;
      }
    }
    
    function closeModal() {
      onClose();
      query = '';
      results = [];
      hasSearched = false;
      clearTimeout(searchTimeout);
    }
    
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeModal();
      }
    }
    
    function handleArticleClick() {
      closeModal();
    }
  </script>
  
  {#if isOpen}
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
      onclick={closeModal}
      onkeydown={handleKeydown}
      role="dialog"
      aria-modal="true"
      aria-label="Search articles"
    >
      <div 
        class="bg-white w-full max-w-2xl mx-4 rounded-lg shadow-xl max-h-96 overflow-hidden"
        onclick={(e) => e.stopPropagation()}
      >
        <!-- Search Input -->
        <div class="flex items-center p-4 border-b border-border-light">
          <Search size={20} class="text-text-light mr-3" />
          <input
            bind:this={searchInput}
            bind:value={query}
            oninput={debounceSearch}
            placeholder="Search articles, authors, tags..."
            class="flex-1 text-lg outline-none"
            type="text"
          />
          <button
            onclick={closeModal}
            class="p-2 hover:bg-light-gray rounded transition-colors"
            aria-label="Close search"
          >
            <X size={20} class="text-text-light" />
          </button>
        </div>
        
        <!-- Search Results -->
        <div class="max-h-80 overflow-y-auto">
          {#if isSearching}
            <div class="p-8 text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-red mx-auto"></div>
              <p class="mt-2 text-text-light">Searching...</p>
            </div>
          {:else if hasSearched && results.length === 0}
            <div class="p-8 text-center">
              <p class="text-text-gray">No articles found for "{query}"</p>
              <p class="text-sm text-text-light mt-2">Try different keywords or check spelling</p>
            </div>
          {:else if results.length > 0}
            <div class="p-2">
              {#each results as article}
                <a
                  href="/{article.slug}"
                  onclick={handleArticleClick}
                  class="block p-3 hover:bg-light-gray rounded transition-colors group"
                >
                  <h3 class="font-semibold text-text-black group-hover:text-accent-red transition-colors">
                    {article.title}
                  </h3>
                  <p class="text-sm text-text-gray mt-1 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div class="flex items-center gap-2 mt-2 text-xs text-text-light">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{article.category}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                </a>
              {/each}
              
              {#if results.length >= 15}
                <div class="p-3 text-center text-sm text-text-light">
                  Showing first 15 results. Try more specific terms for better results.
                </div>
              {/if}
            </div>
          {:else if !hasSearched}
            <div class="p-8 text-center">
              <p class="text-text-light">Start typing to search articles...</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
  
  <style>
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  </style>