'use strict';

const path = require('path');
const cheerio = require('cheerio');

const CARD_INDEX_PATH = path.join(__dirname, 'data', 'cards-index.json');
const CARD_HOST = 'https://cards.fabtcg.com';

let cardData = null;
let cardMatcher = null;

function loadCardData() {
  if (cardData) {
    return cardData;
  }

  cardData = require(CARD_INDEX_PATH);
  const cardNames = Object.keys(cardData.cards || {});

  if (!cardNames.length) {
    cardMatcher = null;
    return cardData;
  }

  const escaped = cardNames
    .sort((first, second) => second.length - first.length)
    .map(escapeRegExp);

  cardMatcher = new RegExp(`(^|[^\\p{L}\\p{N}])(${escaped.join('|')})(?=$|[^\\p{L}\\p{N}])`, 'giu');
  return cardData;
}

function normalize(input) {
  return String(input || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function shouldSkipNode(node) {
  const parentTag = node.parent && node.parent.tagName ? node.parent.tagName.toLowerCase() : '';
  return ['a', 'code', 'pre', 'script', 'style', 'textarea'].includes(parentTag);
}

export function linkifyText(text, cards) {
if (!cardMatcher || !text || !text.trim()) {
    return text;
  }

  cardMatcher.lastIndex = 0;
  return text.replace(cardMatcher, (fullMatch, prefix, cardName) => {
    const normalized = normalize(cardName);
    const card = cards[normalized];

    if (!card) {
      return fullMatch;
    }

    const href = `${CARD_HOST}${card.url}`;
    const safeName = escapeHtml(card.name || cardName);
    const safeImage = escapeHtml(card.image || '');
    const safeHref = escapeHtml(href);

    return `${prefix}<a class="fab-card-link" href="${safeHref}" target="_blank" rel="noopener noreferrer" data-fab-card-name="${safeName}" data-fab-card-image="${safeImage}">${cardName}</a>`;
  });
}

function processNode($, node, cards) {
  if (!node) {
    return;
  }

  if (node.type === 'text' && !shouldSkipNode(node)) {
    const original = node.data || '';
    const replaced = linkifyText(original, cards);
    if (replaced !== original) {
      $(node).replaceWith(replaced);
    }
    return;
  }

  if (node.children && node.children.length) {
    node.children.slice().forEach((child) => processNode($, child, cards));
  }
}

const plugin = {};

plugin.parsePost = async function (payload) {
  const data = payload || {};
  const carrier = data.postData && typeof data.postData.content === 'string'
    ? data.postData
    : (typeof data.content === 'string' ? data : null);

  if (!carrier || !carrier.content) {
    return payload;
  }

  const type = data.type || data.postData?.type || 'default';
  if (type !== 'default') {
    return payload;
  }

  const loaded = loadCardData();
  if (!loaded || !loaded.cards || !cardMatcher) {
    return payload;
  }

  const $ = cheerio.load(carrier.content, {
    decodeEntities: false,
  }, false);

  const root = $.root().get(0);
  if (root && root.children) {
    root.children.slice().forEach((child) => processNode($, child, loaded.cards));
  }

  carrier.content = $.root().html() || carrier.content;
  return payload;
};

module.exports = plugin;
