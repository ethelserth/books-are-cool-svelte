import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';

const source = fs.readFileSync('src/lib/components/Meta.svelte', 'utf8');
const compiled = compile(source, { generate: 'server', filename: 'Meta.svelte' }).js.code;
const resolved = compiled.replace(/from (['"])(svelte[^'"]+)\1/g, (_, quote, name) => `from ${JSON.stringify(import.meta.resolve(name))}`);
const { default: Meta } = await import(`data:text/javascript;base64,${Buffer.from(resolved).toString('base64')}`);
const props = { title: 'Ένα βιβλίο', description: 'Μια κριτική.', url: '/a-book', type: 'article', author: 'Writer', image: '/images/cover.webp', publishedTime: '2026-01-01', modifiedTime: '2026-02-01', rating: 4, breadcrumbs: [{ name: 'Ένα βιβλίο', url: '/a-book' }] };
const schema = head => JSON.parse(head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);

test('server HTML exposes absolute canonical, article, review, breadcrumb and image URLs', () => {
	const { head } = render(Meta, { props });
	assert.match(head, /rel="canonical" href="https:\/\/www.booksarecool.gr\/a-book"/);
	const graph = schema(head)['@graph'];
	const post = graph.find(node => node['@type'] === 'BlogPosting');
	assert.equal(post.url, 'https://www.booksarecool.gr/a-book');
	assert.deepEqual(post.image, ['https://www.booksarecool.gr/images/cover.webp']);
	assert.equal(post.datePublished, '2026-01-01');
	assert.equal(post.dateModified, '2026-02-01');
	assert.equal(graph.find(node => node['@type'] === 'Review').itemReviewed.author.name, 'Writer');
	assert.equal(graph.find(node => node['@type'] === 'BreadcrumbList').itemListElement[0].item, post.url);
	assert.ok(!head.includes('property="og:image:width"'), 'Do not invent article image dimensions');
});

test('structured data preserves special characters without closing the script tag', () => {
	const title = '</script><img src=x onerror=alert(1)> & "book"';
	const { head } = render(Meta, { props: { ...props, title } });
	assert.equal(schema(head)['@graph'].find(node => node['@type'] === 'BlogPosting').headline, title);
	assert.ok(!head.includes('</script><img'));
});

test('default sharing image has its actual dimensions and empty ratings do not emit reviews', () => {
	const { head } = render(Meta, { props: { title: 'Home', description: 'Books', url: '/' } });
	assert.match(head, /og:image:width" content="1200"/);
	assert.match(head, /og:image:height" content="630"/);
	assert.ok(!schema(head)['@graph'].some(node => node['@type'] === 'Review'));
});
