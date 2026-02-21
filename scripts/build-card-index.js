'use strict';

const fs = require('fs/promises');
const path = require('path');

const API_ENDPOINT = 'https://cards.fabtcg.com/api/search/v1/cards/?limit=200';
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'cards-index.json');

function normalize(input) {
  return String(input || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${url}`);
  }

  return response.json();
}

function toAbsoluteUrl(url) {
  if (!url) {
    return null;
  }

  try {
    return new URL(url, 'https://cards.fabtcg.com').toString();
  } catch (error) {
    return null;
  }
}

async function run() {
  const cards = {};
  let pageUrl = API_ENDPOINT;
  let pageCount = 0;
  let recordCount = 0;

  while (pageUrl) {
    pageCount += 1;
    const payload = await fetchJson(pageUrl);

    const results = Array.isArray(payload.results) ? payload.results : [];
    recordCount += results.length;

    for (const card of results) {
      const name = String(card.name || '').trim();
      if (!name) {
        continue;
      }

      const normalized = normalize(name);
      if (!normalized || cards[normalized]) {
        continue;
      }

      const relativeCardUrl = card.url || `/card/${card.card_id || ''}/`;
      const cardUrl = toAbsoluteUrl(relativeCardUrl);
      const image = card.image?.normal || card.image?.large || card.image?.small || '';

      if (!cardUrl || !image) {
        continue;
      }

      cards[normalized] = {
        name,
        url: new URL(cardUrl).pathname,
        image,
      };
    }

    pageUrl = payload.next || null;
    process.stdout.write(`Fetched page ${pageCount} - indexed ${Object.keys(cards).length} unique card names\n`);
  }

  const output = {
    generatedAt: new Date().toISOString(),
    source: API_ENDPOINT,
    fetchedRecords: recordCount,
    uniqueCards: Object.keys(cards).length,
    cards,
  };

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2));

  process.stdout.write(`\nSaved ${output.uniqueCards} cards to ${OUTPUT_FILE}\n`);
}

run().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
