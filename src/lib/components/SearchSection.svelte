<script lang="ts">
    let searchValue = $state('');
    let isFocused = $state(false);
  
    function handleInput(event: Event) {
      const target = event.target as HTMLInputElement;
      searchValue = target.value;
    }
  </script>
  
  <section class="max-w-7xl mx-auto my-8 px-8 text-center">
    <div class="max-w-2xl mx-auto relative">
      <input 
        type="text"
        placeholder="Search reviews, authors, or titles..."
        class="w-full py-4 px-6 border-2 border-text-black bg-white text-base text-text-black outline-none transition-all duration-300 font-inter
               {isFocused || searchValue ? 'border-accent-red shadow-[0_0_20px_rgba(220,53,69,0.2)]' : ''}"
        bind:value={searchValue}
        oninput={handleInput}
        onfocus={() => isFocused = true}
        onblur={() => isFocused = false}
      />
    </div>
  </section>