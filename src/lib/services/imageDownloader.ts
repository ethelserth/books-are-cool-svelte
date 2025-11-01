import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface ImageDownloadResult {
  originalUrl: string;
  localUrl: string;
  filename: string;
}

export class ImageDownloader {
  private static staticDir = path.join(process.cwd(), 'static', 'images', 'articles');
  private static baseUrl = '/images/articles';
  private static downloadedImages = new Map<string, string>();

  static async initialize() {
    // Ensure static images directory exists
    if (!fs.existsSync(this.staticDir)) {
      fs.mkdirSync(this.staticDir, { recursive: true });
      console.log('Created static images directory');
    }
  }

  static generateImageFilename(url: string, extension?: string): string {
    // Create deterministic filename from URL hash
    const hash = crypto.createHash('md5').update(url).digest('hex');
    const ext = extension || this.extractExtension(url) || 'jpg';
    return `${hash}.${ext}`;
  }

  static extractExtension(url: string): string | null {
    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname;
      const match = pathname.match(/\.([a-zA-Z0-9]+)$/);
      if (match) {
        const ext = match[1].toLowerCase();
        // Only allow common image formats
        if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
          return ext;
        }
      }
    } catch (error) {
      console.error('Error extracting extension from URL:', url);
    }
    return null;
  }

  static async downloadImage(imageUrl: string): Promise<ImageDownloadResult | null> {
    try {
      // Check if already downloaded
      if (this.downloadedImages.has(imageUrl)) {
        const localUrl = this.downloadedImages.get(imageUrl)!;
        return {
          originalUrl: imageUrl,
          localUrl,
          filename: path.basename(localUrl)
        };
      }

      console.log('Downloading image:', imageUrl);

      // Download the image
      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        console.error(`Failed to download image: ${response.status} ${response.statusText}`);
        return null;
      }

      // Get content type for proper extension
      const contentType = response.headers.get('content-type');
      let extension = 'jpg';
      
      if (contentType?.includes('image/png')) extension = 'png';
      else if (contentType?.includes('image/webp')) extension = 'webp';
      else if (contentType?.includes('image/gif')) extension = 'gif';
      else if (contentType?.includes('image/svg')) extension = 'svg';

      const filename = this.generateImageFilename(imageUrl, extension);
      const filePath = path.join(this.staticDir, filename);
      const localUrl = `${this.baseUrl}/${filename}`;

      // Check if file already exists
      if (fs.existsSync(filePath)) {
        this.downloadedImages.set(imageUrl, localUrl);
        console.log('Image already exists locally:', filename);
        return {
          originalUrl: imageUrl,
          localUrl,
          filename
        };
      }

      // Save the image
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      fs.writeFileSync(filePath, buffer);
      
      this.downloadedImages.set(imageUrl, localUrl);
      console.log('Downloaded and saved image:', filename);

      return {
        originalUrl: imageUrl,
        localUrl,
        filename
      };

    } catch (error) {
      console.error('Error downloading image:', imageUrl, error);
      return null;
    }
  }

  static async processNotionImageUrl(url: string): Promise<string> {
    if (!url) return '';

    // Skip if not a Notion image
    // if (!url.includes('notion.so') && !url.includes('amazonaws.com/secure.notion-static.com')) {
    //   return url;
    // }

    const result = await this.downloadImage(url);
    return result ? result.localUrl : url;
  }

  static async processAllImagesInContent(content: string): Promise<string> {
    const imageRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
    let processedContent = content;
    const imagePromises: Promise<void>[] = [];

    let match;
    while ((match = imageRegex.exec(content)) !== null) {
      const originalUrl = match[1];
      
      if (true) {
        const promise = this.processNotionImageUrl(originalUrl).then(newUrl => {
          processedContent = processedContent.replace(originalUrl, newUrl);
        });
        imagePromises.push(promise);
      }
    }

    await Promise.all(imagePromises);
    return processedContent;
  }

  static getImageStats(): { totalImages: number; downloadedImages: string[] } {
    return {
      totalImages: this.downloadedImages.size,
      downloadedImages: Array.from(this.downloadedImages.values())
    };
  }

  static cleanupOldImages(keepDays: number = 30): void {
    try {
      const cutoffTime = Date.now() - (keepDays * 24 * 60 * 60 * 1000);
      
      if (!fs.existsSync(this.staticDir)) return;
      
      const files = fs.readdirSync(this.staticDir);
      let deletedCount = 0;
      
      files.forEach(file => {
        const filePath = path.join(this.staticDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime.getTime() < cutoffTime) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      });
      
      console.log(`Cleaned up ${deletedCount} old images`);
    } catch (error) {
      console.error('Error cleaning up old images:', error);
    }
  }
}