export interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  excerpt: string;
  image: string;
  rating: number;
  ratingText: string;
  date: string;
  publishedAt?: string;
  slug?: string;
  content?: string;
  tags?: string[];
  readingTime?: string;
  metaDescription?: string;
  featured?: boolean;
  // Relation handling fields
  authorSlug?: string;
  authorRelationIds?: string[];
  tagRelationIds?: string[];
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string | null;
  articleCount: number;
  // Optional additional fields
  bio?: string;
  website?: string;
  twitter?: string;
}

export interface TagPage {
  name: string;
  slug: string;
  description?: string;
  articleCount?: number;
}

export interface NavItem {
  href: string;
  label: string;
  external?: boolean;
}

// Pagination types
export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalArticles: number;
  articlesPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Page data types for server loads
export interface HomePageData {
  articles: Article[];
  featuredArticles: Article[];
  totalArticles: number;
}

export interface ReviewsPageData {
  articles: Article[];
  pagination: PaginationData;
}

export interface ArticlePageData {
  article: Article;
  relatedArticles: Article[];
}

export interface AuthorPageData {
  author: string;
  authorDetails: Author;
  articles: Article[];
  articleCount: number;
}