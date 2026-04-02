<script lang="ts">
  import { Tag } from 'lucide-svelte';
  
  interface TagData {
    name: string;
    count: number;
    slug: string;
  }
  
  interface PageData {
    tags: TagData[];
    totalTags: number;
  }
  
  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Όλες οι Κατηγορίες - Books Are Cool</title>
  <meta name="description" content="Περιηγηθείτε σε όλες τις {data.totalTags} κατηγορίες που χρησιμοποιούνται στις κριτικές βιβλίων και τη λογοτεχνική μας κριτική." />
  <meta name="keywords" content="κατηγορίες, κατηγορίες, κριτικές βιβλίων, λογοτεχνική κριτική, θέματα" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="Όλες οι Κατηγορίες - Books Are Cool" />
  <meta property="og:description" content="Περιηγηθείτε σε όλες τις κατηγορίες που χρησιμοποιούνται στις κριτικές βιβλίων μας" />
  <meta property="og:type" content="website" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Όλες οι Κατηγορίες - Books Are Cool" />
  <meta name="twitter:description" content="Περιηγηθείτε σε όλες τις κατηγορίες που χρησιμοποιούνται στις κριτικές βιβλίων μας" />
</svelte:head>

<!-- Breadcrumb Navigation -->
<nav class="max-w-7xl mx-auto px-8 pt-8" aria-label="Breadcrumb">
  <ol class="flex items-center gap-2 text-sm text-text-light">
    <li><a href="/" class="hover:text-accent-red">Αρχική</a></li>
    <li class="before:content-['/'] before:mx-2 text-text-gray" aria-current="page">
      Κατηγορίες
    </li>
  </ol>
</nav>

<!-- Page Header -->
<header class="max-w-7xl mx-auto px-8 py-12">
  <div class="flex items-center mb-8">
    <h1 style="font-family: 'Playfair Display', serif" class="text-4xl lg:text-5xl font-black text-text-black uppercase tracking-tight">
      Όλες οι Κατηγορίες
    </h1>
    <div class="flex-1 h-1 gradient-news ml-8"></div>
  </div>
  
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <p class="text-text-gray text-lg">
      Εξερευνήστε θέματα και είδη στις κριτικές βιβλίων μας
    </p>
    <div class="flex items-center gap-4 text-sm text-text-light">
      <span>{data.totalTags} συνολικές κατηγορίες</span>
    </div>
  </div>
</header>

<!-- Tags Grid -->
<section class="max-w-7xl mx-auto px-8 pb-16">
  {#if data.tags.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each data.tags as tag}
        <a
          href="/tags/{tag.slug}"
          class="group block bg-white border border-border-light hover:border-accent-red p-6 transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
        >
          <div class="flex items-center justify-between mb-4">
            <Tag size={24} class="text-text-light group-hover:text-accent-red transition-colors duration-300" />
            <span class="text-xs text-text-light bg-light-gray px-2 py-1 rounded-full group-hover:bg-accent-red group-hover:text-white transition-colors duration-300">
              {tag.count}
            </span>
          </div>
          <h3 class="font-semibold text-text-black group-hover:text-accent-red transition-colors duration-300 mb-2 text-lg">
            {tag.name}
          </h3>
          <p class="text-sm text-text-light">
            {tag.count} {tag.count === 1 ? 'άρθρο' : 'άρθρα'}
          </p>
        </a>
      {/each}
    </div>
    
    <!-- Tags Summary -->
    <div class="mt-16 bg-light-gray border-l-4 border-accent-red p-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <div class="text-2xl font-bold text-accent-red mb-2">{data.totalTags}</div>
          <div class="text-text-gray text-sm uppercase tracking-wide">Συνολικές Κατηγορίες</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-accent-red mb-2">
            {data.tags.length > 0 ? data.tags[0].count : 0}
          </div>
          <div class="text-text-gray text-sm uppercase tracking-wide">Πιο Δημοφιλής</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-accent-red mb-2">
            {Math.round(data.tags.reduce((sum, tag) => sum + tag.count, 0) / data.tags.length) || 0}
          </div>
          <div class="text-text-gray text-sm uppercase tracking-wide">Μέσος Όρος ανά Κατηγορία</div>
        </div>
      </div>
    </div>
    
  {:else}
    <!-- Empty State -->
    <div class="text-center py-16">
      <div class="w-16 h-16 bg-light-gray rounded-full flex items-center justify-center mx-auto mb-6">
        <Tag size={32} class="text-text-light" />
      </div>
      <h2 class="text-2xl font-bold text-text-black mb-4">Δεν βρέθηκαν κατηγορίες</h2>
      <p class="text-text-gray mb-8 max-w-md mx-auto">
        Δεν υπάρχουν διαθέσιμες κατηγορίες αυτή τη στιγμή. Οι Κατηγορίες θα εμφανιστούν καθώς δημοσιεύονται άρθρα.
      </p>
      <a 
        href="/reviews"
        class="inline-flex items-center gap-2 bg-accent-red text-white px-6 py-3 font-semibold hover:bg-red-700 transition-colors duration-300"
      >
        Περιήγηση σε Όλες τις Κριτικές
      </a>
    </div>
  {/if}
</section>

<!-- Back Navigation -->
<div class="max-w-7xl mx-auto px-8 pb-8">
  <a 
    href="/"
    class="inline-flex items-center gap-2 text-accent-red font-semibold hover:underline"
  >
    ← Επιστροφή στην Αρχική
  </a>
</div>