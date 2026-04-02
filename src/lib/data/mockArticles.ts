import type { Article } from '$lib/types';
import { slugify, calculateReadingTime } from '$lib/utils';

const mockContent = `
<p>This groundbreaking novel represents a stunning achievement in contemporary literature, weaving together themes of friendship, creativity, and the transformative power of interactive media. The author's masterful storytelling creates an immersive experience that resonates long after the final page.</p>

<h2>A Story of Friendship and Creativity</h2>

<p>At its core, this is a story about the complex bonds between creative individuals. The relationship between the protagonists is portrayed with remarkable nuance, showing both the exhilarating highs of collaboration and the devastating lows of personal conflict. The author captures the delicate balance between artistic vision and commercial success with extraordinary insight.</p>

<blockquote class="bg-light-gray border-l-4 border-accent-red p-6 my-8 italic text-xl">
"The best games are the ones that make you forget you're playing a game at all. They become a part of your reality, a new way of seeing the world."
</blockquote>

<h2>Technical Excellence</h2>

<p>The writing itself is exceptional, with prose that shifts seamlessly between intimate character moments and sweeping philosophical observations. Each chapter builds upon the last, creating a narrative momentum that feels both inevitable and surprising. The dialogue crackles with authenticity, particularly in the gaming industry scenes.</p>

<h2>Cultural Impact</h2>

<p>This book arrives at a crucial moment in our cultural conversation about technology, creativity, and human connection. It offers profound insights into how digital spaces can become venues for genuine emotional experiences, while never losing sight of the very human needs that drive us to create and connect.</p>

<h2>Final Thoughts</h2>

<p>This is essential reading for anyone interested in contemporary literature, gaming culture, or simply a beautifully told story about the power of human creativity. It's a novel that respects both its characters and its readers, offering depth without pretension and emotion without manipulation.</p>

<p>The author has created something truly special here – a book that works equally well as a meditation on friendship, a commentary on modern creative industries, and a deeply engaging story. It's the kind of novel that reminds you why literature matters.</p>
`;

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    category: 'Fiction',
    excerpt: "Zevin's ambitious novel about friendship, creativity, and the gaming industry succeeds on multiple levels. Through the complex relationship between Sam, Sadie, and Marx, she explores how art and technology intersect with human connection...",
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&crop=center',
    rating: 5,
    ratingText: 'Exceptional',
    date: '2025-03-14',
    publishedAt: '2025-03-14T10:00:00Z',
    slug: 'tomorrow-and-tomorrow-and-tomorrow',
    content: mockContent,
    tags: ['Contemporary Fiction', 'Gaming Culture', 'Friendship', 'Technology'],
    readingTime: '8 min read'
  },
  {
    id: '2',
    title: 'The Seven Moons of Maali Almeida',
    author: 'Shehan Karunatilaka',
    category: 'Literary Fiction',
    excerpt: "Karunatilaka's darkly comic afterlife adventure transforms Sri Lankan civil war history into something unexpectedly magical. The bureaucracy of death becomes both absurd and profound in this innovative narrative...",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center',
    rating: 4,
    ratingText: 'Excellent',
    date: '2025-03-13',
    publishedAt: '2025-03-13T14:30:00Z',
    slug: 'seven-moons-maali-almeida',
    content: mockContent,
    tags: ['Magical Realism', 'Sri Lankan Literature', 'Historical Fiction', 'Dark Comedy'],
    readingTime: '7 min read'
  },
  {
    id: '3',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    category: 'Science Fiction',
    excerpt: "Weir's follow-up to 'The Martian' is even more ambitious—a story about sacrifice, friendship, and the lengths we'll go to save everything we love. Hard science fiction with genuine emotional weight...",
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600&h=400&fit=crop&crop=center',
    rating: 5,
    ratingText: 'Outstanding',
    date: '2025-03-12',
    publishedAt: '2025-03-12T16:15:00Z',
    slug: 'project-hail-mary',
    content: mockContent,
    tags: ['Hard Science Fiction', 'Space Opera', 'Friendship', 'Sacrifice'],
    readingTime: '9 min read'
  },
  {
    id: '4',
    title: 'Lessons in Chemistry',
    author: 'Bonnie Garmus',
    category: 'Contemporary',
    excerpt: "Garmus delivers a sharp, feminist tale disguised as a feel-good novel. Elizabeth Zott's journey from chemist to TV cook becomes a meditation on women's place in science and society...",
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=400&fit=crop&crop=center',
    rating: 4,
    ratingText: 'Very Good',
    date: '2025-03-11',
    publishedAt: '2025-03-11T11:45:00Z',
    slug: 'lessons-in-chemistry',
    content: mockContent,
    tags: ['Feminist Fiction', 'Science', 'Historical Fiction', '1960s'],
    readingTime: '6 min read'
  },
  {
    id: '5',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    category: 'Literary Fiction',
    excerpt: "Ishiguro's latest masterpiece examines consciousness and love through an AI's innocent eyes. Klara's observations reveal profound truths about humanity, devotion, and what it means to care...",
    image: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=600&h=400&fit=crop&crop=center',
    rating: 5,
    ratingText: 'Masterpiece',
    date: '2025-03-10',
    publishedAt: '2025-03-10T09:20:00Z',
    slug: 'klara-and-the-sun',
    content: mockContent,
    tags: ['Literary Fiction', 'AI', 'Philosophy', 'Nobel Prize Winner'],
    readingTime: '10 min read'
  },
  {
    id: '6',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    category: 'Philosophy',
    excerpt: "Haig's philosophical exploration of life's infinite possibilities resonates deeply in our age of endless choices. A meditation on regret, hope, and the lives we didn't live...",
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&crop=center',
    rating: 4,
    ratingText: 'Thoughtful',
    date: '2025-03-09',
    publishedAt: '2025-03-09T13:10:00Z',
    slug: 'midnight-library',
    content: mockContent,
    tags: ['Philosophy', 'Mental Health', 'Magical Realism', 'Self-Help'],
    readingTime: '5 min read'
  }
];

export function getArticleBySlug(slug: string): Article | null {
  return mockArticles.find(article => article.slug === slug) || null;
}

export function getRelatedArticles(currentArticle: Article, limit: number = 3): Article[] {
  return mockArticles
    .filter(article => 
      article.id !== currentArticle.id && 
      (article.category === currentArticle.category || 
       article.tags?.some(tag => currentArticle.tags?.includes(tag)))
    )
    .slice(0, limit);
}