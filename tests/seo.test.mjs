import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { error, redirect } from '@sveltejs/kit';
import { loadTypescript } from './load-typescript.mjs';

const { buildSitemap } = loadTypescript('src/lib/seo/sitemap.ts');
const { archivePage } = loadTypescript('src/lib/seo/pagination.ts', {
	'@sveltejs/kit': { error, redirect }
});
const article = (i) => ({
	id: String(i),
	slug: `book-${i}`,
	title: `Book ${i}`,
	authorSlug: 'writer',
	tags: ['Crime'],
	date: '2025-01-01'
});

test('sitemap uses canonical review/tag pagination, deduplicates URLs and only uses actual modification dates', () => {
	const articles = Array.from({ length: 25 }, (_, i) => article(i));
	articles[0].modifiedAt = '2026-07-05T12:00:00Z';
	articles[1].modifiedAt = 'not-a-date';
	articles[2].tags = ['Crime', 'crime'];
	const xml = buildSitemap(articles);
	for (const path of ['/reviews/2', '/reviews/3', '/tags/crime/2', '/tags/crime/3'])
		assert.ok(xml.includes(`<loc>https://www.booksarecool.gr${path}</loc>`));
	assert.ok(
		!xml.includes('?page=') && !xml.includes('/reviews/1<') && !xml.includes('/reviews/4<')
	);
	const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
	assert.equal(urls.length, new Set(urls).size);
	assert.equal((xml.match(/<lastmod>/g) || []).length, 1);
	assert.ok(xml.includes('<lastmod>2026-07-05T12:00:00.000Z</lastmod>'));
});

test('sitemap encodes Greek and reserved characters and rejects missing article slugs', () => {
	const xml = buildSitemap([{ ...article(1), slug: 'βιβλίο & ιστορία', tags: ['Art & History'] }]);
	assert.ok(xml.includes(encodeURIComponent('βιβλίο & ιστορία')));
	assert.ok(xml.includes('art-%26-history'));
	assert.throws(() => buildSitemap([{ ...article(1), slug: '' }]), /missing its slug/);
});

test('robots permits render assets and contains only valid directives', () => {
	const robots = fs.readFileSync('static/robots.txt', 'utf8');
	assert.ok(!robots.includes('Disallow: /_app/'));
	assert.ok(robots.includes('Sitemap: https://www.booksarecool.gr/sitemap.xml'));
	assert.ok(
		robots.split('\n').every((line) => !line || /^(User-agent|Allow|Disallow|Sitemap): /.test(line))
	);
});

test('pagination rejects malformed values and redirects duplicate page one', () => {
	assert.equal(archivePage('2', '/reviews'), 2);
	for (const value of ['0', '-1', '02', '2oops', '2.5', '9007199254740992'])
		assert.throws(
			() => archivePage(value, '/reviews'),
			(e) => e.status === 404
		);
	assert.throws(
		() => archivePage('1', '/reviews'),
		(e) => e.status === 308 && e.location === '/reviews'
	);
});

test('collection and detail routes propagate upstream failures instead of returning empty or 404 pages', async () => {
	const unavailable = new Error('Upstream unavailable');
	const fail = async () => {
		throw unavailable;
	};
	const mocks = {
		'@sveltejs/kit': { error, redirect },
		'$lib/notion/client': {
			getRecentArticles: fail,
			getFeaturedArticles: fail,
			getAllArticles: fail,
			getAllTags: fail,
			getArticleBySlug: fail,
			getArticlesByTag: fail,
			getAuthorBySlug: fail
		}
	};
	for (const route of [
		'+page.server.ts',
		'reviews/+page.server.ts',
		'tags/+page.server.ts',
		'[slug]/+page.server.ts',
		'authors/[slug]/+page.server.ts',
		'tags/[slug]/+page.server.ts',
		'tags/[slug]/[page]/+page.server.ts',
		'reviews/[page]/+page.server.ts'
	]) {
		const { load } = loadTypescript(`src/routes/${route}`, mocks);
		await assert.rejects(
			() => load({ params: { slug: 'crime', page: '2' } }),
			(e) => e === unavailable,
			route
		);
	}
});

test('missing articles and out-of-range archive pages still return 404', async () => {
	const mocks = {
		'@sveltejs/kit': { error, redirect },
		'$lib/notion/client': {
			getArticleBySlug: async () => null,
			getAllArticles: async () => [article(1)]
		}
	};
	const detail = loadTypescript('src/routes/[slug]/+page.server.ts', mocks);
	await assert.rejects(
		() => detail.load({ params: { slug: 'missing' } }),
		(e) => e.status === 404
	);
	const archive = loadTypescript('src/routes/reviews/[page]/+page.server.ts', mocks);
	await assert.rejects(
		() => archive.load({ params: { page: '9' } }),
		(e) => e.status === 404
	);
});
