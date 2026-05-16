<script lang="ts">
  import type { PageData } from './$types';
  import ArticleCard from '$lib/components/ArticleCard.svelte';
  import Pagination from '$lib/components/Pagination.svelte';
  import Meta from '$lib/components/Meta.svelte';

  let { data }: { data: PageData } = $props();

  const itemList = $derived(
    data.articles.map((article) => ({
      name: article.title,
      url: `/${article.slug}`,
      image: article.image
    }))
  );
</script>

<Meta
  title={`Κριτικές Βιβλίων - Σελίδα ${data.pagination.currentPage}`}
  description={`Κριτικές βιβλίων και λογοτεχνική κριτική - Σελίδα ${data.pagination.currentPage} από ${data.pagination.totalPages}.`}
  url={`/reviews/${data.pagination.currentPage}`}
  type="collection"
  keywords={`κριτικές βιβλίων, λογοτεχνική κριτική, σελίδα ${data.pagination.currentPage}`}
  breadcrumbs={[
    { name: 'Αρχική', url: '/' },
    { name: 'Κριτικές', url: '/reviews' },
    { name: `Σελίδα ${data.pagination.currentPage}`, url: `/reviews/${data.pagination.currentPage}` }
  ]}
  {itemList}
  itemListName={`Κριτικές - Σελίδα ${data.pagination.currentPage}`}
/>

<svelte:head>
  {#if data.pagination.hasPreviousPage}
    <link
      rel="prev"
      href={data.pagination.currentPage === 2 ? '/reviews' : `/reviews/${data.pagination.currentPage - 1}`}
    />
  {/if}
  {#if data.pagination.hasNextPage}
    <link rel="next" href={`/reviews/${data.pagination.currentPage + 1}`} />
  {/if}
</svelte:head>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div class="text-center mb-12">
    <h1 class="text-4xl md:text-5xl font-bold text-text-black mb-4">
      Κριτικές Βιβλίων
    </h1>
    <p class="text-xl text-text-gray max-w-2xl mx-auto">
      Εις βάθος κριτικές και λογοτεχνική ανάλυση σύγχρονης και κλασικής λογοτεχνίας
    </p>
  </div>

  <!-- Articles Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {#each data.articles as article (article.id)}
      <ArticleCard {article} />
    {/each}
  </div>

  <!-- Pagination -->
  <Pagination 
    currentPage={data.pagination.currentPage}
    totalPages={data.pagination.totalPages}
    totalArticles={data.pagination.totalArticles}
    baseUrl="/reviews"
  />
</main>