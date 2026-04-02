<script lang="ts">
    import { page } from '$app/stores';
    import { ArrowLeft, Home } from 'lucide-svelte';
  </script>
  
  <svelte:head>
    <title>Page Not Found - Books Are Cool</title>
    <meta name="description" content="The page you're looking for doesn't exist." />
    <meta name="robots" content="noindex" />
  </svelte:head>
  
  <section class="max-w-4xl mx-auto my-24 px-8 text-center">
    <div class="mb-8">
      <h1 class="font-playfair text-6xl lg:text-8xl font-black text-accent-red mb-4">404</h1>
      <h2 class="font-playfair text-3xl lg:text-4xl font-bold text-text-black mb-6">Page Not Found</h2>
      <p class="text-text-gray text-lg mb-8 max-w-2xl mx-auto">
        The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
      </p>
    </div>
  
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a 
        href="/" 
        class="inline-flex items-center gap-2 bg-accent-red text-white px-6 py-3 font-semibold hover:bg-red-700 transition-colors duration-300"
      >
        <Home size={20} />
        Go to Homepage
      </a>
      
      <button 
        onclick={() => history.back()} 
        class="inline-flex items-center gap-2 border border-accent-red text-accent-red px-6 py-3 font-semibold hover:bg-accent-red hover:text-white transition-colors duration-300"
      >
        <ArrowLeft size={20} />
        Go Back
      </button>
    </div>
  
    <!-- Popular Articles Suggestion -->
    <div class="mt-16 text-left">
      <h3 class="font-playfair text-2xl font-bold text-text-black mb-6 text-center">Popular Articles</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <a href="/tomorrow-and-tomorrow-and-tomorrow" class="block p-4 border border-border-light hover:border-accent-red transition-colors duration-300">
          <h4 class="font-semibold text-text-black mb-2">Tomorrow, and Tomorrow, and Tomorrow</h4>
          <p class="text-text-light">Gabrielle Zevin • Fiction</p>
        </a>
        <a href="/klara-and-the-sun" class="block p-4 border border-border-light hover:border-accent-red transition-colors duration-300">
          <h4 class="font-semibold text-text-black mb-2">Klara and the Sun</h4>
          <p class="text-text-light">Kazuo Ishiguro • Literary Fiction</p>
        </a>
        <a href="/project-hail-mary" class="block p-4 border border-border-light hover:border-accent-red transition-colors duration-300">
          <h4 class="font-semibold text-text-black mb-2">Project Hail Mary</h4>
          <p class="text-text-light">Andy Weir • Science Fiction</p>
        </a>
      </div>
    </div>
  </section>