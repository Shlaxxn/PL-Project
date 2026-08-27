const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');

function readDecks() {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    if (!Array.isArray(data.decks)) {
        throw new Error('data.json does not contain a decks array');
    }
    return data.decks;
}

function extractPageTitle(html) {
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    return titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : '(no page title)';
}

function extractDescription(html) {
    const descriptionMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
    return descriptionMatch ? descriptionMatch[1].trim() : '(no description)';
}

async function verifyDeck(deck) {
    const response = await fetch(deck.url, {
        headers: {
            'user-agent': 'Mozilla/5.0 (compatible; DeckStatTracker/1.0)',
            accept: 'text/html,application/xhtml+xml',
        },
    });
    const html = await response.text();

    console.log(`\n${deck.name}`);
    console.log(`  URL: ${deck.url}`);
    console.log(`  HTTP status: ${response.status} ${response.statusText}`);
    console.log(`  Final URL: ${response.url}`);
    console.log(`  Response bytes: ${Buffer.byteLength(html, 'utf8')}`);
    console.log(`  Page title: ${extractPageTitle(html)}`);
    console.log(`  Description: ${extractDescription(html)}`);
    console.log(`  Read successfully: ${response.ok ? 'yes' : 'no'}`);
}

async function main() {
    const decks = readDecks();
    console.log(`Reading ${decks.length} deck URL(s) from ${dataPath}`);

    for (const deck of decks) {
        try {
            await verifyDeck(deck);
        } catch (error) {
            console.log(`\n${deck.name}`);
            console.log(`  URL: ${deck.url}`);
            console.log(`  Request failed: ${error.message}`);
            console.log('  Read successfully: no');
        }
    }
}

main().catch(error => {
    console.error(`Verification failed: ${error.message}`);
    process.exitCode = 1;
});