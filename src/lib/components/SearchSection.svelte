<script lang="ts">
  interface SearchSectionProps {
    onOpenSearch: () => void;
  }
  
  let { onOpenSearch }: SearchSectionProps = $props();
  let searchValue = $state('');
  let isFocused = $state(false);

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    searchValue = target.value;
  }
  
  function handleClick() {
    onOpenSearch();
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpenSearch();
    }
  }
</script>

<section class="max-w-7xl mx-auto my-8 px-8 text-center">
  <div class="max-w-2xl mx-auto relative">
    <button
      type="button"
      class="w-full py-4 px-6 border-2 border-text-black bg-white text-base text-text-black outline-none transition-all duration-300 font-inter text-left
             hover:border-accent-red hover:shadow-[0_0_20px_rgba(220,53,69,0.2)]"
      onclick={handleClick}
      onkeydown={handleKeydown}
    >
      <span class="text-text-light">Search reviews, authors, or titles...</span>
    </button>
  </div>
</section>