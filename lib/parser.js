'use strict';

const PostParser = module.exports;

const cards = require('../cards/cards.json');

const cardNameToData = {};
Object.values(cards.cards).forEach((card) => {
	if (card.name && card.url && card.image) {
		cardNameToData[card.name] = {
			url: `https://cards.fabtcg.com${card.url}`,
			image: card.image,
		};
	}
});

// Sort card names by length descending to avoid partial matches
const sortedCardNames = Object.keys(cardNameToData).sort((a, b) => b.length - a.length);


PostParser.insertCardLinks = function (content) {
	const { JSDOM } = require('jsdom');

	// Parse HTML content into a DOM
	const dom = new JSDOM(content);
	const {document} = dom.window;

	// Prepare a regex for all card names, sorted by length descending
	const regexEscapedNames = sortedCardNames.map(name => name.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&'));
	const alternation = regexEscapedNames.join('|');
	const cardRegex = new RegExp(`\\b(${alternation})\\b`, 'g');

	// Recursively walk all nodes, skipping inside <a> tags, and replace card names in text nodes
	function walk(node) {
		if (node.nodeType === 3) { // TEXT_NODE
			// Skip empty text
			if (!node.nodeValue.trim()) return;
			// Replace card names in this text node
			const originalText = node.nodeValue;
			let lastIndex = 0;
			let match;
			const fragments = [];
			cardRegex.lastIndex = 0;
			while ((match = cardRegex.exec(originalText))) {
				const cardName = match[1];
				const cardData = cardNameToData[cardName];
				if (!cardData) continue;
				// Push preceding text
				if (match.index > lastIndex) {
					fragments.push(document.createTextNode(originalText.slice(lastIndex, match.index)));
				}
				// Create link node
				const a = document.createElement('a');
				a.href = cardData.url;
				a.className = 'fab-card';
				a.target = '_blank';
				a.textContent = cardName;
				const img = document.createElement('img');
				img.src = cardData.image;
				img.alt = cardName;
				a.appendChild(img);
				fragments.push(a);
				lastIndex = match.index + cardName.length;
			}
			// Push remaining text
			if (lastIndex < originalText.length) {
				fragments.push(document.createTextNode(originalText.slice(lastIndex)));
			}
			if (fragments.length) {
				// Replace the text node with the new nodes
				fragments.forEach(frag => node.parentNode.insertBefore(frag, node));
				node.parentNode.removeChild(node);
			}
		} else if (node.nodeType === 1 && node.nodeName.toLowerCase() !== 'a') { // ELEMENT_NODE, not <a>
			// Recurse into children
			// Use Array.from to avoid live NodeList issues when modifying children
			Array.from(node.childNodes).forEach(walk);
		}
	}
	walk(document.body || document);
	// Return the modified HTML
	return (document.body ? document.body.innerHTML : document.innerHTML);
};