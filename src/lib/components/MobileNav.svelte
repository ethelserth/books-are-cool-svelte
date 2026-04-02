<script lang="ts">
    import { Menu, X } from 'lucide-svelte';
    import { smoothScroll } from '$lib/actions/smoothScroll';
    import type { NavItem } from '$lib/types';
  
    interface Props {
      navItems: NavItem[];
    }
  
    let { navItems }: Props = $props();
    let isOpen = $state(false);
  
    function toggleMenu() {
      isOpen = !isOpen;
    }
  
    function closeMenu() {
      isOpen = false;
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
      class="fixed inset-0 bg-black/50 z-50 lg:hidden"
      onclick={closeMenu}
    >
      <div 
        class="fixed top-0 right-0 h-full w-80 bg-white shadow-strong transform transition-transform duration-300"
        onclick={(e) => e.stopPropagation()}
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-8">
            <span class="font-playfair text-xl font-black text-text-black">
              Menu
            </span>
            <button onclick={closeMenu}>
              <X size={24} class="text-text-black" />
            </button>
          </div>
          
          <nav class="space-y-4" use:smoothScroll>
            {#each navItems as item}
              <a 
                href={item.href}
                class="block text-text-gray hover:text-accent-red font-medium text-lg py-2 transition-colors duration-300"
                onclick={closeMenu}
              >
                {item.label}
              </a>
            {/each}
          </nav>
        </div>
      </div>
    </div>
  {/if}