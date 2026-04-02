import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { promisify } from 'util';
import stream from 'stream';
import axios from 'axios';

const pipeline = promisify(stream.pipeline);

const STATIC_DIR = 'static';
const IMAGES_DIR = 'images/notion';
const DEST_DIR = path.join(process.cwd(), STATIC_DIR, IMAGES_DIR);

// Ensure destination directory exists
if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
}

interface ProcessedImage {
    src: string;
    width: number;
    height: number;
    blurDataUrl?: string; // Optional: for placeholder
}

/**
 * Generates a unique filename for an image based on its URL or ID.
 * For Notion URLs, we try to use the stable block/file ID if possible.
 */
function getFilename(url: string, id: string): string {
    // If it's a Notion AWS URL, parts of the path are stable IDs
    // https://prod-files-secure.s3.us-west-2.amazonaws.com/workspace-id/file-id/filename.jpg?...

    if (url.includes('amazonaws.com') && url.includes('/')) {
        const parts = url.split('?')[0].split('/');
        // The file ID is usually the second to last part
        if (parts.length >= 2) {
            const fileId = parts[parts.length - 2];
            return `${fileId}.webp`;
        }
    }

    // Fallback: hash the URL + ID to ensure uniqueness
    const hash = crypto.createHash('md5').update(url + id).digest('hex');
    return `${hash}.webp`;
}

export async function processImage(url: string, id: string): Promise<ProcessedImage> {
    if (!url) {
        return { src: '', width: 0, height: 0 };
    }

    try {
        const filename = getFilename(url, id);
        const relativePath = `/${IMAGES_DIR}/${filename}`;
        const absolutePath = path.join(DEST_DIR, filename);

        // 1. Check if image already exists locally efficiently
        if (fs.existsSync(absolutePath)) {
            try {
                const metadata = await sharp(absolutePath).metadata();
                return {
                    src: relativePath,
                    width: metadata.width || 800,
                    height: metadata.height || 600
                };
            } catch (e) {
                // If metadata read fails, re-download
                console.warn(`Failed to read metadata for cached image ${filename}, re-processing:`, e);
            }
        }

        console.log(`Downloading and processing image: ${url.substring(0, 50)}...`);

        // 2. Download image
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'arraybuffer'
        });

        // 3. Process with Sharp
        // Convert to WebP, resize if too large (e.g. max width 1200px), set quality
        const image = sharp(response.data);
        const metadata = await image.metadata();

        const maxWidth = 1200;
        const finalWidth = metadata.width && metadata.width > maxWidth ? maxWidth : metadata.width;

        await image
            .resize({ width: finalWidth, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(absolutePath);

        const finalMetadata = await sharp(absolutePath).metadata();

        return {
            src: relativePath,
            width: finalMetadata.width || 800,
            height: finalMetadata.height || 600
        };

    } catch (error) {
        console.error(`Error processing image ${url}:`, error);
        // Fallback to original URL if processing fails, though likely won't work well if it expires
        return {
            src: url,
            width: 800, // Guess
            height: 600 // Guess
        };
    }
}
