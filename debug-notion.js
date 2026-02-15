// debug-notion.js - Updated to parse your page structure
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Your page ID (not database ID)
const pageId = 'b9b3674cac1a452eba0fe7a437ca0532';

console.log('🔍 Testing Notion connection with your page structure...');
console.log('API Key:', process.env.NOTION_API_KEY ? 'Present ✅' : 'Missing ❌');
console.log('Page ID:', pageId);

async function debugNotionPage() {
  try {
    console.log('\n📄 Fetching page info...');
    
    // Get the main page
    const page = await notion.pages.retrieve({
      page_id: pageId,
    });
    
    console.log('Page Title:', page.properties?.title?.title?.[0]?.plain_text || 'No title found');
    
    console.log('\n🧱 Fetching page blocks (looking for databases)...');
    
    // Get all blocks in the page (this will include the database)
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
    });
    
    console.log(`Found ${blocks.results.length} blocks in the page`);
    
    // Look for database blocks
    const databaseBlocks = blocks.results.filter(block => 
      block.type === 'child_database' || block.type === 'database'
    );
    
    console.log(`Found ${databaseBlocks.length} database block(s)`);
    
    if (databaseBlocks.length > 0) {
      const databaseBlock = databaseBlocks[0];
      const databaseId = databaseBlock.id;
      
      console.log('\n📋 Database found!');
      console.log('Database ID:', databaseId);
      
      // Now query the actual database
      console.log('\n📊 Querying database...');
      
      const databaseInfo = await notion.databases.retrieve({
        database_id: databaseId,
      });
      
      console.log('Database Title:', databaseInfo.title[0]?.plain_text || 'No title');
      console.log('Database Properties:', Object.keys(databaseInfo.properties));
      
      // Log each property type
      for (const [key, value] of Object.entries(databaseInfo.properties)) {
        console.log(`  ${key}: ${value.type}`);
      }
      
      // Get database entries
      const entries = await notion.databases.query({
        database_id: databaseId,
      });
      
      console.log(`\n📚 Found ${entries.results.length} entries in database`);
      
      if (entries.results.length > 0) {
        const firstEntry = entries.results[0];
        console.log('\n📝 First entry details:');
        
        // Log all properties of first entry
        for (const [key, value] of Object.entries(firstEntry.properties)) {
          console.log(`  ${key}:`, JSON.stringify(value, null, 2));
        }
        
        // Try to get the page content
        console.log('\n📖 Getting page content...');
        const pageContent = await notion.blocks.children.list({
          block_id: firstEntry.id,
        });
        
        console.log(`Page has ${pageContent.results.length} content blocks`);
        pageContent.results.forEach((block, index) => {
          console.log(`  Block ${index}: ${block.type}`);
        });
      }
      
      return databaseId; // Return the actual database ID
      
    } else {
      console.log('❌ No database blocks found in the page');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

debugNotionPage();