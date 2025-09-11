<script lang="ts">
  import { Menu, X, Search } from 'lucide-svelte';
  import { smoothScroll } from '$lib/actions/smoothScroll';
  import type { NavItem } from '$lib/types';
  
  interface Props {
    navItems: NavItem[];
    onOpenSearch: () => void;
    onToggle?: (isOpen: boolean) => void;
  }
  
  let { navItems, onOpenSearch, onToggle }: Props = $props();
  let isOpen = $state(false);
  
  function toggleMenu() {
    isOpen = !isOpen;
    onToggle?.(isOpen);
  }
  
  function closeMenu() {
    isOpen = false;
    onToggle?.(false);
  }
  
  function handleSearchClick() {
    onOpenSearch();
    // Don't close menu when search is clicked
  }
</script>

<!-- Mobile Menu Button -->
<button 
  class="lg:hidden p-2"
  onclick={toggleMenu}
  aria-label="Toggle menu"
>
  {#if isOpen}
    <X size={24} class="text-text-black" />
  {:else}
    <Menu size={24} class="text-text-black" />
  {/if}
</button>

<!-- Mobile Menu Overlay -->
{#if isOpen}
  <div 
    class="fixed inset-0 bg-black/60 z-[9999] lg:hidden"
    onclick={closeMenu}
  >
    <div 
      class="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 overflow-y-auto z-[9999]"
      onclick={(e) => e.stopPropagation()}
    >
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-border-light p-4 sm:p-6">
        <div class="flex justify-between items-center">
          <span class="font-playfair text-xl sm:text-2xl font-black text-text-black">
            Menu
          </span>
          <button 
            onclick={closeMenu}
            class="p-2 hover:bg-light-gray rounded transition-colors"
            aria-label="Close menu"
          >
            <X size={24} class="text-text-black" />
          </button>
        </div>
      </div>
      
      <!-- Content -->
      <div class="p-4 sm:p-6">
        <!-- Search Button (Mobile Only) -->
        <button
          onclick={handleSearchClick}
          class="w-full flex items-center gap-3 p-4 mb-6 bg-light-gray border border-border-light hover:border-accent-red hover:bg-white transition-all duration-300 group"
        >
          <Search size={20} class="text-text-light group-hover:text-accent-red transition-colors" />
          <span class="text-text-gray group-hover:text-accent-red transition-colors font-medium">
            Search articles...
          </span>
        </button>
        
        <!-- Navigation -->
        <nav class="space-y-2" use:smoothScroll>
          {#each navItems as item}
            <a 
              href={item.href}
              class="block text-text-gray hover:text-accent-red hover:bg-light-gray font-medium text-lg py-3 px-4 transition-all duration-300 rounded border border-transparent hover:border-border-light"
            >
              {item.label}
            </a>
          {/each}
        </nav>
        
      </div>
    </div>
  </div>
{/if}