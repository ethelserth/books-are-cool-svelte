<script lang="ts">
  interface Breadcrumb {
    name: string;
    url: string;
  }

  interface ListItem {
    name: string;
    url: string;
    image?: string;
  }

  interface MetaProps {
    title: string;
    description: string;
    url: string;
    image?: string;
    type?: 'website' | 'article' | 'profile' | 'collection';
    keywords?: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    tags?: string[];
    rating?: number;
    ratingText?: string;
    breadcrumbs?: Breadcrumb[];
    itemList?: ListItem[];
    itemListName?: string;
    twitterCard?: 'summary' | 'summary_large_image';
    noIndex?: boolean;
    personSameAs?: string[];
  }

  const SITE_URL = 'https://www.booksarecool.gr';
  const SITE_NAME = 'Books Are Cool';
  const SITE_LOGO = `${SITE_URL}/favicon.png`;
  const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
  const TWITTER_HANDLE = '@booksarecool';
  const LOCALE = 'el-GR';
  const OG_LOCALE = 'el_GR';

  let {
    title,
    description,
    url,
    image = DEFAULT_OG_IMAGE,
    type = 'website',
    keywords = '',
    author = '',
    publishedTime = '',
    modifiedTime = '',
    tags = [],
    rating = 0,
    ratingText = '',
    breadcrumbs = [],
    itemList = [],
    itemListName = '',
    twitterCard = 'summary_large_image',
    noIndex = false,
    personSameAs = []
  }: MetaProps = $props();

  const fullTitle =
    type === 'article' && author
      ? `${title} - ${author} | ${SITE_NAME}`
      : title.includes(SITE_NAME)
        ? title
        : `${title} | ${SITE_NAME}`;

  function absoluteUrl(u: string): string {
    if (!u) return SITE_URL;
    if (u.startsWith('http')) return u;
    return `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`;
  }

  const canonicalUrl = absoluteUrl(url);
  const ogType = type === 'profile' ? 'profile' : type === 'article' ? 'article' : 'website';

  const organizationNode = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      url: SITE_LOGO,
      contentUrl: SITE_LOGO,
      caption: SITE_NAME
    },
    sameAs: ['https://twitter.com/booksarecool']
  };

  const websiteNode = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: LOCALE,
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/api/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  function buildGraph() {
    const graph: Record<string, unknown>[] = [organizationNode, websiteNode];

    if (breadcrumbs.length > 0) {
      graph.push({
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: absoluteUrl(b.url)
        }))
      });
    }

    const webPageBase: Record<string, unknown> = {
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: title,
      description,
      inLanguage: LOCALE,
      isPartOf: { '@id': `${SITE_URL}/#website` }
    };
    if (breadcrumbs.length > 0) {
      webPageBase.breadcrumb = { '@id': `${canonicalUrl}#breadcrumb` };
    }
    if (image) {
      webPageBase.primaryImageOfPage = { '@type': 'ImageObject', url: image };
    }

    if (type === 'article') {
      graph.push({ ...webPageBase, '@type': 'WebPage' });

      const blogPosting: Record<string, unknown> = {
        '@type': 'BlogPosting',
        '@id': `${canonicalUrl}#article`,
        isPartOf: { '@id': `${canonicalUrl}#webpage` },
        mainEntityOfPage: { '@id': `${canonicalUrl}#webpage` },
        headline: title,
        description,
        image: [image],
        url: canonicalUrl,
        inLanguage: LOCALE,
        author: { '@id': `${SITE_URL}/#organization` },
        publisher: { '@id': `${SITE_URL}/#organization` }
      };
      if (publishedTime) blogPosting.datePublished = publishedTime;
      if (modifiedTime || publishedTime) {
        blogPosting.dateModified = modifiedTime || publishedTime;
      }
      if (tags.length > 0) blogPosting.keywords = tags.join(', ');
      if (tags.length > 0) blogPosting.articleSection = tags[0];
      graph.push(blogPosting);

      if (rating > 0) {
        const review: Record<string, unknown> = {
          '@type': 'Review',
          '@id': `${canonicalUrl}#review`,
          name: title,
          reviewBody: description,
          url: canonicalUrl,
          inLanguage: LOCALE,
          author: { '@id': `${SITE_URL}/#organization` },
          publisher: { '@id': `${SITE_URL}/#organization` },
          itemReviewed: {
            '@type': 'Book',
            name: title,
            image,
            ...(author && {
              author: { '@type': 'Person', name: author }
            })
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: rating,
            bestRating: 5,
            worstRating: 1,
            ...(ratingText && { name: ratingText })
          }
        };
        if (publishedTime) review.datePublished = publishedTime;
        graph.push(review);
      }
    } else if (type === 'profile') {
      const person: Record<string, unknown> = {
        '@type': 'Person',
        '@id': `${canonicalUrl}#person`,
        name: author || title,
        description,
        url: canonicalUrl
      };
      if (image && image !== DEFAULT_OG_IMAGE) person.image = image;
      if (personSameAs.length > 0) person.sameAs = personSameAs;

      graph.push({
        ...webPageBase,
        '@type': 'ProfilePage',
        mainEntity: { '@id': `${canonicalUrl}#person` }
      });
      graph.push(person);

      if (itemList.length > 0) {
        graph.push({
          '@type': 'ItemList',
          '@id': `${canonicalUrl}#itemlist`,
          name: itemListName || `Works by ${author || title}`,
          numberOfItems: itemList.length,
          itemListElement: itemList.map((it, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: absoluteUrl(it.url),
            name: it.name,
            ...(it.image && { image: it.image })
          }))
        });
      }
    } else if (type === 'collection' || itemList.length > 0) {
      graph.push({
        ...webPageBase,
        '@type': 'CollectionPage',
        mainEntity:
          itemList.length > 0
            ? { '@id': `${canonicalUrl}#itemlist` }
            : undefined
      });
      if (itemList.length > 0) {
        graph.push({
          '@type': 'ItemList',
          '@id': `${canonicalUrl}#itemlist`,
          name: itemListName || title,
          numberOfItems: itemList.length,
          itemListElement: itemList.map((it, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: absoluteUrl(it.url),
            name: it.name,
            ...(it.image && { image: it.image })
          }))
        });
      }
    } else {
      graph.push({ ...webPageBase, '@type': 'WebPage' });
    }

    return { '@context': 'https://schema.org', '@graph': graph };
  }

  const jsonLd = JSON.stringify(buildGraph()).replace(/<\/script/gi, '<\\/script');
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  {#if keywords}
    <meta name="keywords" content={keywords} />
  {/if}
  <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
  {#if author && type === 'article'}
    <meta name="author" content={author} />
  {/if}
  <link rel="canonical" href={canonicalUrl} />

  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={title} />
  <meta property="og:type" content={ogType} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:locale" content={OG_LOCALE} />

  {#if type === 'article'}
    {#if author}
      <meta property="article:author" content={author} />
    {/if}
    {#if publishedTime}
      <meta property="article:published_time" content={publishedTime} />
    {/if}
    {#if modifiedTime}
      <meta property="article:modified_time" content={modifiedTime} />
    {/if}
    {#each tags as tag}
      <meta property="article:tag" content={tag} />
    {/each}
  {/if}

  <!-- Twitter -->
  <meta name="twitter:card" content={twitterCard} />
  <meta name="twitter:site" content={TWITTER_HANDLE} />
  <meta name="twitter:creator" content={TWITTER_HANDLE} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  <meta name="twitter:image:alt" content={title} />

  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>
