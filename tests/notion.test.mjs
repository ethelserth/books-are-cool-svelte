import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './load-typescript.mjs';

const { createNotionQueue } = loadTypescript('src/lib/notion/requests.ts');
function fixture(overrides = {}) {
	const calls = { databases: 0, pages: 0, blocks: 0 };
	const page = {
		id: 'book',
		last_edited_time: '2026-01-02T00:00:00Z',
		properties: {
			'Post Title': { title: [{ plain_text: 'A ' }, { plain_text: 'book' }] },
			Slug: { rich_text: [{ plain_text: 'a-book' }] },
			Date: { date: { start: '2026-01-01' } },
			Author: { relation: [{ id: 'author' }] }
		}
	};
	const api = {
		databases: {
			query: async () => {
				calls.databases++;
				return { results: [page], has_more: false };
			}
		},
		pages: {
			retrieve: async () => {
				calls.pages++;
				return {
					properties: {
						Name: { title: [{ plain_text: 'Writer' }] },
						Slug: { rich_text: [{ plain_text: 'writer' }] }
					}
				};
			}
		},
		blocks: {
			children: {
				list: async () => {
					calls.blocks++;
					return {
						results: [
							{
								id: 'text',
								type: 'paragraph',
								paragraph: { rich_text: [{ plain_text: 'Review content.' }] }
							}
						],
						has_more: false
					};
				}
			}
		}
	};
	overrides.configure?.(api, page);
	const client = loadTypescript('src/lib/notion/client.ts', {
		'@notionhq/client': {
			Client: class {
				constructor() {
					return api;
				}
			}
		},
		'$env/static/private': { NOTION_API_KEY: 'test', NOTION_DATABASE_ID: 'test' },
		'./images': {
			processImage: async () => {
				throw new Error('Unexpected image request');
			}
		},
		'./requests': { createNotionQueue: () => createNotionQueue(0, async () => {}) }
	});
	return { client, calls, api };
}

test('parallel content consumers share one database initialization and author fetch', async () => {
	const { client, calls } = fixture();
	const [recent] = await Promise.all([
		client.getRecentArticles(),
		client.getFeaturedArticles(),
		client.getAllTags(),
		client.getAllArticles()
	]);
	assert.equal(calls.databases, 1);
	assert.equal(calls.pages, 1);
	assert.equal(recent[0].title, 'A book');
	assert.equal(recent[0].modifiedAt, '2026-01-02T00:00:00Z');
});

test('failed initialization rejects all consumers and can be retried', async () => {
	const { client, api } = fixture();
	const healthy = api.databases.query;
	api.databases.query = async () => {
		throw new Error('Temporary failure');
	};
	const results = await Promise.allSettled([client.getAllArticles(), client.getRecentArticles()]);
	assert.ok(results.every((result) => result.status === 'rejected'));
	api.databases.query = healthy;
	assert.equal((await client.getAllArticles()).length, 1);
});

test('empty or malformed published collections cannot populate the build cache', async () => {
	const empty = fixture({
		configure(api) {
			api.databases.query = async () => ({ results: [], has_more: false });
		}
	});
	await assert.rejects(empty.client.getAllArticles(), /empty site/);
	const invalid = fixture({
		configure(api, page) {
			page.properties.Slug.rich_text = [];
		}
	});
	await assert.rejects(invalid.client.getAllArticles(), /missing title\/slug/);
});

test('relation failures are not cached as Unknown authors', async () => {
	const { client, api } = fixture();
	const healthy = api.pages.retrieve;
	api.pages.retrieve = async () => {
		throw new Error('Relation unavailable');
	};
	await assert.rejects(client.getAllArticles(), /Relation unavailable/);
	api.pages.retrieve = healthy;
	assert.equal((await client.getAllArticles())[0].author, 'Writer');
});

test('failed or empty article bodies cannot be cached as successful reviews', async () => {
	const { client, api } = fixture();
	const healthy = api.blocks.children.list;
	api.blocks.children.list = async () => {
		throw new Error('Body unavailable');
	};
	await assert.rejects(client.getArticleBySlug('a-book'), /Body unavailable/);
	api.blocks.children.list = async () => ({ results: [], has_more: false });
	await assert.rejects(client.getArticleBySlug('a-book'), /no readable content/);
	api.blocks.children.list = healthy;
	assert.match((await client.getArticleBySlug('a-book')).content, /Review content/);
});

test('request queue spaces calls, honors Retry-After and recovers after an error', async () => {
	let clock = 0;
	const queue = createNotionQueue(
		400,
		async (ms) => {
			clock += ms;
		},
		() => clock
	);
	const starts = [];
	let attempts = 0;
	await Promise.all([
		queue(async () => {
			starts.push(clock);
			if (attempts++ === 0) throw { status: 429, headers: new Headers({ 'retry-after': '2' }) };
			return 'ok';
		}),
		queue(async () => {
			starts.push(clock);
		})
	]);
	assert.deepEqual(starts, [0, 2000, 2400]);
	await assert.rejects(
		queue(async () => {
			throw new Error('Failed');
		}),
		/Failed/
	);
	assert.equal(await queue(async () => 'recovered'), 'recovered');
});
