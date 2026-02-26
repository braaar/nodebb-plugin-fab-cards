'use strict';

const parser = require('./parser');
const test = require('node:test');

test('should parse a non HTMLised card string', (t) => {
	// Example input and expected output
	const input = 'Command and Conquer';
	const expected = '<a href="https://cards.fabtcg.com/card/command-and-conquer-1/" class="fab-card" target="_blank">Command and Conquer<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/ARC159.webp" alt="Command and Conquer"></a>';

	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
});

test('should parse a simple card string', (t) => {
	// Example input and expected output
	const input = '<p>Command and Conquer</p>';
	const expected = '<p><a href="https://cards.fabtcg.com/card/command-and-conquer-1/" class="fab-card" target="_blank">Command and Conquer<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/ARC159.webp" alt="Command and Conquer"></a></p>';

	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
	
});
test('should parse a card string with punctuation at the end', (t) => {
	// Example input and expected output
	const input = '<p>What Happens Next?</p>';
	const expected = '<p><a href="https://cards.fabtcg.com/card/what-happens-next-3/" class="fab-card" target="_blank">What Happens Next?<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/SUP209.webp" alt="What Happens Next?"></a></p>';

	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
	
});
test('should parse a card string with punctuation in the middle', (t) => {
	// Example input and expected output
	const input = '<p>There is a card called Argh... Smash! which is quite a card name!</p>';
	const expected = '<p>There is a card called <a href="https://cards.fabtcg.com/card/argh-smash-2/" class="fab-card" target="_blank">Argh... Smash!<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/CRU009.webp" alt="Argh... Smash!"></a> which is quite a card name!</p>';

	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
	
});
test('should parse leetspeak card names', (t) => {
	// Example input and expected output
	const input = '<p>The weirdest hero card name has to be Arakni, 5L!p3d 7hRu 7h3 cR4X...</p>';
	const expected = '<p>The weirdest hero card name has to be <a href="https://cards.fabtcg.com/card/arakni-5lp3d-7hru-7h3-cr4x/" class="fab-card" target="_blank">Arakni, 5L!p3d 7hRu 7h3 cR4X<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/AAC001.webp" alt="Arakni, 5L!p3d 7hRu 7h3 cR4X"></a>...</p>';

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

test('should handle a card following a link cards in the same content', (t) => {
	const input = '<p><a href="google.com">Command and Conquer</a> and Command and Conquer</p>';
	const expected = '<p><a href="google.com">Command and Conquer</a> and <a href="https://cards.fabtcg.com/card/command-and-conquer-1/" class="fab-card" target="_blank">Command and Conquer<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/ARC159.webp" alt="Command and Conquer"></a></p>';
	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
});

test('should handle cards with names that are subsets of other cards', (t) => {
	const input = '<p>Flex Strength is a card. So is Flex</p>';
	const expected = '<p><a href="https://cards.fabtcg.com/card/flex-strength-1/" class="fab-card" target="_blank">Flex Strength<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/SUP149.webp" alt="Flex Strength"></a> is a card. So is <a href="https://cards.fabtcg.com/card/flex-1/" class="fab-card" target="_blank">Flex<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/UPR191.webp" alt="Flex"></a></p>';
	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
});


test('should not match inside img', (t) => {
	const input = '<img src="Riptide.png" alt="Riptide">';
	const expected = '<img src="Riptide.png" alt="Riptide">';
	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
});

test('should not match usernames', (t) => {
	const input = '<p>@Riptide</p>';
	const expected = '<p>@Riptide</p>';
	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
});

test('should link a single card in a sentence', (t) => {
	const input = '<p>I wonder What Happens Next?</p>';
	const expected = '<p>I wonder <a href="https://cards.fabtcg.com/card/what-happens-next-3/" class="fab-card" target="_blank">What Happens Next?<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/SUP209.webp" alt="What Happens Next?"></a></p>';
	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
});

test('should link multiple cards in a list', (t) => {
	const input = '<p>Listing some cards:Betsy, Bravo, Fai– and of course ...Cindra!</p>';
	const expected = '<p>Listing some cards:<a href="https://cards.fabtcg.com/card/betsy/" class="fab-card" target="_blank">Betsy<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/HVY046.webp" alt="Betsy"></a>, <a href="https://cards.fabtcg.com/card/bravo/" class="fab-card" target="_blank">Bravo<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/WTR039.webp" alt="Bravo"></a>, <a href="https://cards.fabtcg.com/card/fai/" class="fab-card" target="_blank">Fai<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/UPR045.webp" alt="Fai"></a>– and of course ...<a href="https://cards.fabtcg.com/card/cindra/" class="fab-card" target="_blank">Cindra<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/HNT055.webp" alt="Cindra"></a>!</p>';
	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
});

test('should link brute cards in a list', (t) => {
	const input = '<ul><li>BRB</li><li>Flex Strength</li><li>Flex!!!!</li><li>Flex Speed?</li><li>Clash of Might</li><li><strong>Alpha Instinct</strong>💪🏼</li></ul>';
	const expected = '<ul><li>BRB</li><li><a href="https://cards.fabtcg.com/card/flex-strength-1/" class="fab-card" target="_blank">Flex Strength<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/SUP149.webp" alt="Flex Strength"></a></li><li><a href="https://cards.fabtcg.com/card/flex-1/" class="fab-card" target="_blank">Flex<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/UPR191.webp" alt="Flex"></a>!!!!</li><li><a href="https://cards.fabtcg.com/card/flex-speed-1/" class="fab-card" target="_blank">Flex Speed<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/SUP146.webp" alt="Flex Speed"></a>?</li><li><a href="https://cards.fabtcg.com/card/clash-of-might-1/" class="fab-card" target="_blank">Clash of Might<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/HVY137.webp" alt="Clash of Might"></a></li><li><strong><a href="https://cards.fabtcg.com/card/alpha-instinct-3/" class="fab-card" target="_blank">Alpha Instinct<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/ARR022.webp" alt="Alpha Instinct"></a></strong>💪🏼</li></ul>';
	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
});

test('should link agility and agile windup in sentences', (t) => {
	const input = '<p><a href="https://agility.com">Agility</a> in a sentence.<br>Agility in a sentence.<br>Agile Windup in a sentence.<br>This is Agility in a sentence.<br>This is Agile Windup in a sentence.</p>';
	const expected = '<p><a href="https://agility.com">Agility</a> in a sentence.<br><a href="https://cards.fabtcg.com/card/agility/" class="fab-card" target="_blank">Agility<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/HVY240.webp" alt="Agility"></a> in a sentence.<br><a href="https://cards.fabtcg.com/card/agile-windup-1/" class="fab-card" target="_blank">Agile Windup<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/HVY163.webp" alt="Agile Windup"></a> in a sentence.<br>This is <a href="https://cards.fabtcg.com/card/agility/" class="fab-card" target="_blank">Agility<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/HVY240.webp" alt="Agility"></a> in a sentence.<br>This is <a href="https://cards.fabtcg.com/card/agile-windup-1/" class="fab-card" target="_blank">Agile Windup<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/HVY163.webp" alt="Agile Windup"></a> in a sentence.</p>';
	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
});

test('should link snatch and aether hail in a sentence', (t) => {
	const input = '<p><strong>Snatch</strong> is amazing. So is ❄️Aether Hail❄️</p>';
	const expected = '<p><strong><a href="https://cards.fabtcg.com/card/snatch-1/" class="fab-card" target="_blank">Snatch<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/WTR167.webp" alt="Snatch"></a></strong> is amazing. So is ❄️<a href="https://cards.fabtcg.com/card/aether-hail-1/" class="fab-card" target="_blank">Aether Hail<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/UPR127.webp" alt="Aether Hail"></a>❄️</p>';
	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
});

test('should not link card names in usernames', (t) => {
	const input = '<p>What\'s your favourite card, @Flex?</p><p>@xXThunkLoverXx</p>';
	const expected = '<p>What\'s your favourite card, @Flex?</p><p>@xXThunkLoverXx</p>';
	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
});

test('should link Tiger Eye Reflex in a question', (t) => {
	const input = '<p>Do you also like Tiger Eye Reflex?</p>';
	const expected = '<p>Do you also like <a href="https://cards.fabtcg.com/card/tiger-eye-reflex-2/" class="fab-card" target="_blank">Tiger Eye Reflex<img src="https://d2wlb52bya4y8z.cloudfront.net/media/cards/normal/TCC098.webp" alt="Tiger Eye Reflex"></a>?</p>';
	const result = parser.insertCardLinks(input);
	t.assert.strictEqual(result, expected);
});