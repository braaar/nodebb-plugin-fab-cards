'use strict';

/**
 * This file shows how client-side javascript can be included via a plugin.
 * If you check `plugin.json`, you'll see that this file is listed under "scripts".
 * That array tells NodeBB which files to bundle into the minified javascript
 * that is served to the end user.
 *
 * There are two (standard) ways to wait for when NodeBB is ready.
 * This one below executes when NodeBB reports it is ready...
 */



(async () => {
	const hooks = await app.require('hooks');

	hooks.on('action:app.load', () => {
		// called once when nbb has loaded
		console.log('hello Ste111v23e!!');
	});

	hooks.on('action:ajaxify.end', async (/* data */) => {


		// retrieve card list from "/plugins/nodebb-plugin-fab-cards-2/cards/cards.json"
		const response = await fetch('/plugins/nodebb-plugin-fab-cards-2/cards/cards.json');
		const fabCardIndex = await response.json();

		// Build a map of display names to URL and image
		const cardNameToData = {};
		Object.values(fabCardIndex.cards).forEach(card => {
			if (card.name && card.url && card.image) {
				cardNameToData[card.name] = {
					url: `https://cards.fabtcg.com${card.url}`,
					image: card.image,
				};
			}
		});

		// Sort card names by length descending to avoid partial matches
		const sortedCardNames = Object.keys(cardNameToData).sort((a, b) => b.length - a.length);

		function insertCardLinks(text) {
			sortedCardNames.forEach((cardName) => {
				// Use word boundaries and allow for punctuation after the card name
				const cardData = cardNameToData[cardName];
				text = text.replace(cardName, `<a href="${cardData.url}" class="fab-card" target="_blank">
					<img src="${cardData.image}" alt="${cardName}">
					${cardName}</a>`);
			});
			return text;
		}
		// find each element with the attribute component="post/content"
		// and insert card links
		$('[component="post/content"]').each((i, el) => {
			const html = $(el).html();
			const replaced = insertCardLinks(html);
			$(el).html(replaced);
		});
	});
})();

/**
 * ... and this one reports when the DOM is loaded (but NodeBB might not be fully ready yet).
 * For most cases, you'll want the one above.
 */

$(document).ready(function () {
	// ...
});
