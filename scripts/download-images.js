import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = path.join(process.cwd(), 'static');
const IMAGES_DIR = 'images/notion';
const DEST_DIR = path.join(STATIC_DIR, IMAGES_DIR);

// Ensure destination directory exists
if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
}

// Initialize Notion
const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

async function main() {
    console.log('Fetching articles for image pre-loading...');

    if (!process.env.NOTION_DATABASE_ID) {
        throw new Error('NOTION_DATABASE_ID not found in env');
    }

    const articles = [];
    let hasMore = true;
    let startCursor = undefined;

    while (hasMore) {
        const response = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID,
            filter: { property: 'Publish', checkbox: { equals: true } },
            start_cursor: startCursor,
        });

        articles.push(...response.results);
        hasMore = response.has_more;
        startCursor = response.next_cursor;
    }

    console.log(`Found ${articles.length} articles. scanning for images...`);

    // Process concurrency limit
    const CONCURRENCY = 5;
    const queue = [];

    for (const page of articles) {
        queue.push(() => processPageImages(page));
    }

    // Run queue with limit
    await runQueue(queue, CONCURRENCY);
    console.log('All images processed successfully.');
}

async function runQueue(tasks, concurrency) {
    const results = [];
    const running = new Set();

    for (const task of tasks) {
        const p = task().then(result => {
            running.delete(p);
            return result;
        });
        running.add(p);
        results.push(p);

        if (running.size >= concurrency) {
            await Promise.race(running);
        }
    }
    return Promise.all(results);
}

async function processPageImages(page) {
    // 1. Cover
    const coverUrl = extractCoverImage(page.cover);
    if (coverUrl) await processImage(coverUrl, page.id);

    // 2. Icon
    const iconUrl = extractIconImage(page.icon);
    if (iconUrl) await processImage(iconUrl, page.id);

    // 3. To handle content, we'd need to fetch blocks.
    // NOTE: Fetching ALL blocks for ALL pages might be slow (~API rate limits).
    // But essential for strict self-hosting.
    console.log(`Scanning content for ${page.id}...`);
    await processPageContentImages(page.id);
}

async function processPageContentImages(pageId) {
    try {
        const blocks = await getAllBlocksRecursively(pageId);
        // Recursively find images
        const imageUrls = findImagesInBlocks(blocks);
        for (const url of imageUrls) {
            await processImage(url, pageId);
        }
    } catch (e) {
        console.error(`Error processing content images for ${pageId}`, e);
    }
}

function findImagesInBlocks(blocks) {
    let urls = [];
    for (const block of blocks) {
        if (block.type === 'image') {
            const url = block.image.file?.url || block.image.external?.url;
            if (url) urls.push(url);
        }
        if (block.has_children && block.children) {
            urls = urls.concat(findImagesInBlocks(block.children));
        }
    }
    return urls;
}

async function getAllBlocksRecursively(blockId) {
    const blocks = [];
    let hasMore = true;
    let startCursor = undefined;

    while (hasMore) {
        const response = await notion.blocks.children.list({
            block_id: blockId,
            start_cursor: startCursor,
        });

        for (const block of response.results) {
            blocks.push(block);
            if (block.has_children) {
                // Sequential to play nice with rate limits
                block.children = await getAllBlocksRecursively(block.id);
            }
        }
        hasMore = response.has_more;
        startCursor = response.next_cursor;
    }
    return blocks;
}

// ------ copied helpers ------

function extractCoverImage(cover) {
    if (!cover) return null;
    if (cover.type === 'file') return cover.file?.url;
    if (cover.type === 'external') return cover.external?.url;
    return null;
}
function extractIconImage(icon) {
    if (!icon) return null;
    if (icon.type === 'file') return icon.file?.url;
    if (icon.type === 'external') return icon.external?.url;
    return null;
}

function getFilename(url, id) {
    if (url.includes('amazonaws.com') && url.includes('/')) {
        const parts = url.split('?')[0].split('/');
        if (parts.length >= 2) {
            const fileId = parts[parts.length - 2];
            return `${fileId}.webp`;
        }
    }
    const hash = crypto.createHash('md5').update(url + id).digest('hex');
    return `${hash}.webp`;
}

async function processImage(url, id) {
    if (!url) return;

    try {
        const filename = getFilename(url, id);
        const absolutePath = path.join(DEST_DIR, filename);

        if (fs.existsSync(absolutePath)) {
            return; // Skip existing
        }

        console.log(`Downloading: ${url.substring(0, 40)}...`);
        const response = await axios({ url, method: 'GET', responseType: 'arraybuffer' });

        const image = sharp(response.data);
        const metadata = await image.metadata();
        const maxWidth = 1200;
        const finalWidth = metadata.width && metadata.width > maxWidth ? maxWidth : metadata.width;

        await image
            .resize({ width: finalWidth, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(absolutePath);

    } catch (error) {
        console.error(`Failed to process ${url}:`, error.message);
    }
}

main().catch(console.error);
