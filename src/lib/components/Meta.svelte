<script lang="ts">
    interface MetaProps {
      title: string;
      description: string;
      url: string;
      image?: string;
      type?: 'website' | 'article';
      keywords?: string;
      author?: string;
      publishedTime?: string;
      tags?: string[];
      rating?: number;
    }
  
    let {
      title,
      description,
      url,
      image = 'https://www.booksarecool.gr/og-image.jpg',
      type = 'website',
      keywords = '',
      author = '',
      publishedTime = '',
      tags = [],
      rating = 0
    }: MetaProps = $props();
  
    const fullTitle = type === 'article' ? `${title} - Books Are Cool` : title;
    const canonicalUrl = url.startsWith('http') ? url : `https://www.booksarecool.gr${url}`;
  </script>
  
  <svelte:head>
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    {#if keywords}
      <meta name="keywords" content={keywords} />
    {/if}
    
    <!-- Enhanced Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content={title} />
    <meta property="og:type" content={type} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:site_name" content="Books Are Cool" />
    <meta property="og:locale" content="en_US" />
    
    {#if type === 'article'}
      <meta property="article:author" content={author} />
      {#if publishedTime}
        <meta property="article:published_time" content={publishedTime} />
      {/if}
      {#each tags as tag}
        <meta property="article:tag" content={tag} />
      {/each}
    {/if}
    
    <!-- Enhanced Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@booksarecool" />
    <meta name="twitter:creator" content="@booksarecool" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    
    <!-- Additional SEO -->
    <meta name="robots" content="index, follow" />
    {#if author}
      <meta name="author" content={author} />
    {/if}
    <link rel="canonical" href={canonicalUrl} />
    
    {#if type === 'article' && rating > 0}
      <!-- Structured Data for Book Review -->
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Review",
        "itemReviewed": {
          "@type": "Book",
          "name": "{title}",
          "image": "{image}"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": {rating},
          "bestRating": 5,
          "worstRating": 1
        },
        "author": {
          "@type": "Person",
          "name": "{author}"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Books Are Cool"
        },
        "datePublished": "{publishedTime}",
        "headline": "{title}",
        "description": "{description}",
        "url": "{canonicalUrl}",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "{canonicalUrl}"
        }
      }
      </script>
    {:else if type === 'website'}
      <!-- Structured Data for Website -->
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Books Are Cool",
        "description": "{description}",
        "url": "https://www.booksarecool.gr",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.booksarecool.gr/api/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Books Are Cool",
          "url": "https://www.booksarecool.gr"
        }
      }
      </script>
    {/if}
  </svelte:head>