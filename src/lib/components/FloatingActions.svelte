<script lang="ts">
    import { Search, Bookmark, Share, Printer } from 'lucide-svelte';
  
    const actions = [
      { icon: Search, title: 'Search', action: 'search' },
      { icon: Bookmark, title: 'Bookmark', action: 'bookmark' },
      { icon: Share, title: 'Share', action: 'share' },
      { icon: Printer, title: 'Print', action: 'print' }
    ];
  
    function handleAction(action: string) {
      switch (action) {
        case 'search':
          // Focus search input
          document.querySelector('input[type="text"]')?.focus();
          break;
        case 'bookmark':
          // Handle bookmark
          console.log('Bookmark functionality');
          break;
        case 'share':
          // Handle share
          if (navigator.share) {
            navigator.share({
              title: 'Books Are Cool',
              url: window.location.href
            });
          }
          break;
        case 'print':
          window.print();
          break;
      }
    }
  </script>
  
  <div class="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-30 hidden lg:flex">
    {#each actions as { icon: Icon, title, action }}
      <button
        on:click={() => handleAction(action)}
        class="w-12 h-12 bg-white border-2 border-text-black flex items-center justify-center text-text-black transition-all duration-300 hover:bg-accent-red hover:text-white hover:border-accent-red hover:scale-105 shadow-light"
        {title}
      >
        <Icon size={20} />
      </button>
    {/each}
  </div>