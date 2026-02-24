'use strict';
(async () => {
	const hooks = await app.require('hooks');

	hooks.on('action:ajaxify.end', async (/* data */) => {
		const response = await fetch('/plugins/nodebb-plugin-fab-cards/cards/cards.json');
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

		function insertCardLinks(html) {
			sortedCardNames.forEach((cardName) => {
				// Use word boundaries and allow for punctuation after the card name
				const cardData = cardNameToData[cardName];
				const regexEscapedCardName = cardName.replace(
					/[-\/\\^$*+?.()|[\]{}]/g,
					'\\$&',
				);
				const expression = new RegExp(
					`(?<!<a[^>]*[^>]*>[^>]*|"|@|[0-9])${regexEscapedCardName}(?=[?!.,;:\s])`,
					'g',
				);
				html = html.replaceAll(
					expression,
					`<a href="${cardData.url}" class="fab-card" target="_blank">
					${cardName}<img src="${cardData.image}" alt="${cardName}">
					</a>`,
				);
			});

			
			return html;
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
