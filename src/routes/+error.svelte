<script lang="ts">
  import { page } from '$app/stores';
  import { ArrowLeft, Home } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Η σελίδα δεν βρέθηκε - Books Are Cool</title>
  <meta name="description" content="Η σελίδα που αναζητάτε δεν υπάρχει." />
  <meta name="robots" content="noindex" />
</svelte:head>

<section class="max-w-4xl mx-auto my-24 px-8 text-center">
  <div class="mb-8">
    <h1 class="font-playfair text-6xl lg:text-8xl font-black text-accent-red mb-4">404</h1>
    <h2 class="font-playfair text-3xl lg:text-4xl font-bold text-text-black mb-6">Η σελίδα δεν βρέθηκε</h2>
    <p class="text-text-gray text-lg mb-8 max-w-2xl mx-auto">
      Η σελίδα που αναζητάτε δεν υπάρχει. Μπορεί να έχει μετακινηθεί, διαγραφεί ή να εισάγατε λάθος URL.
    </p>
  </div>

  <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
    <a 
      href="/" 
      class="inline-flex items-center gap-2 bg-accent-red text-white px-6 py-3 font-semibold hover:bg-red-700 transition-colors duration-300"
    >
      <Home size={20} />
      Αρχική Σελίδα
    </a>
    
    <button 
      onclick={() => history.back()} 
      class="inline-flex items-center gap-2 border border-accent-red text-accent-red px-6 py-3 font-semibold hover:bg-accent-red hover:text-white transition-colors duration-300"
    >
      <ArrowLeft size={20} />
      Επιστροφή
    </button>
  </div>

  <!-- Popular Articles Suggestion -->
  <div class="mt-16 text-left">
    <h3 class="font-playfair text-2xl font-bold text-text-black mb-6 text-center">Δημοφιλή Άρθρα</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
      <a href="/h-teleiothta" class="block p-4 border border-border-light hover:border-accent-red transition-colors duration-300">
        <h4 class="font-semibold text-text-black mb-2">Η τελειότητα</h4>
        <p class="text-text-light">Βιντσέντζο Λατρονίκο • Πεζογραφία</p>
      </a>
      <a href="#" class="block p-4 border border-border-light hover:border-accent-red transition-colors duration-300">
        <h4 class="font-semibold text-text-black mb-2">Δείγμα κριτικής</h4>
        <p class="text-text-light">Συγγραφέας • Κατηγορία</p>
      </a>
      <a href="#" class="block p-4 border border-border-light hover:border-accent-red transition-colors duration-300">
        <h4 class="font-semibold text-text-black mb-2">Δείγμα κριτικής</h4>
        <p class="text-text-light">Συγγραφέας • Κατηγορία</p>
      </a>
    </div>
  </div>
</section>