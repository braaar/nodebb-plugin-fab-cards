'use strict';

const parser = require('./parser');
const test = require('node:test');

test('should parse a simple card string', (t) => {
	// Example input and expected output
	const input = '<p>Command and Conquer</p>';
	const expected = '<p><a href="https://cards.fabtcg.com/card/command-and-conquer-1/" class="fab-card" target="_blank">Command and Conquer<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/ARC159.webp" alt="Command and Conquer"></a></p>';

	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
	
});

test('should not link partial matches', (t) => {
	const input = '<p>Command and</p>';
	const expected = '<p>Command and</p>';
	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
});

test('should not link cards inside other links', (t) => {
	const input = '<a href="https://example.com">Command and Conquer</a>';
	const expected = '<a href="https://example.com">Command and Conquer</a>';
	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
});

test('should handle multiple cards in the same content', (t) => {
	const input = '<p>Command and Conquer and Command and Conquer</p>';
	const expected = '<p><a href="https://cards.fabtcg.com/card/command-and-conquer-1/" class="fab-card" target="_blank">Command and Conquer<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/ARC159.webp" alt="Command and Conquer"></a> and <a href="https://cards.fabtcg.com/card/command-and-conquer-1/" class="fab-card" target="_blank">Command and Conquer<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/ARC159.webp" alt="Command and Conquer"></a></p>';
	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
});