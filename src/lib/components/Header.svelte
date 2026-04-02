<script lang="ts">
  import { page } from '$app/stores';
  import { smoothScroll } from '$lib/actions/smoothScroll';
  import MobileNav from './MobileNav.svelte';
  import type { NavItem } from '$lib/types';
  
  const navItems: NavItem[] = [
    { href: '/reviews', label: 'Reviews' },
    { href: '/tags/literary-fiction', label: 'Literary fiction' },
    { href: '/tags/crime', label: 'Crime' },
    { href: '/tags/greek-literature', label: 'Ελληνική Λογοτεχνία' },
    { href: '/tags/non-fiction', label: 'Non Fiction' }
  ];

  // Create a proper interface for the props
  interface HeaderProps {
    onOpenSearch?: () => void;
  }

  let { onOpenSearch }: HeaderProps = $props();
  let isMobileNavOpen = $state(false);

  function handleOpenSearch() {
    if (onOpenSearch) {
      onOpenSearch();
    }
  }

  function handleMobileNavToggle(isOpen: boolean) {
    isMobileNavOpen = isOpen;
  }
</script>

<div class="bg-accent-red text-white py-2 relative overflow-hidden"></div>
<header class="bg-white/95 backdrop-blur-sm border-b border-border-light py-6 sticky top-0 z-50 lg:h-auto"
        class:h-screen={isMobileNavOpen}>
  <div class="max-w-7xl mx-auto px-8 flex justify-between items-center">
    <a 
      href="/"
      class="font-playfair text-2xl lg:text-3xl font-black text-text-black tracking-tight hover:text-accent-red transition-colors duration-300"
    >
      Books Are Cool
    </a>
        
    <!-- Desktop Navigation -->
    <nav class="hidden lg:flex gap-8" use:smoothScroll>
      {#each navItems as item}
        <a 
          href={item.href}
          class="text-text-gray hover:text-accent-red font-medium text-sm transition-all duration-300 relative group"
        >
          {item.label}
          <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-red transition-all duration-300 group-hover:w-full"></span>
        </a>
      {/each}
    </nav>
        
    <!-- Mobile Navigation -->
    <MobileNav 
      {navItems} 
      onOpenSearch={handleOpenSearch}
      onToggle={handleMobileNavToggle}
    />
  </div>
</header>