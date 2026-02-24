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
	sortedCardNames.forEach((cardName) => {
		const cardData = cardNameToData[cardName];
		const regexEscapedCardName = cardName.replace(
			/[-\/\\^$*+?.()|[\]{}]/g,
			'\\$&',
		);

		const expression = new RegExp(
			`(?<!<a[^>]*[^>]*>[^>]*|["@-_;:?!.,;:'^¨*#$€&/]|[0-9])${regexEscapedCardName}(?=[<?!.,;:\s])`,
			'g',
		);
		
		content = content.replaceAll(
			expression,
			`<a href="${cardData.url}" class="fab-card" target="_blank">${cardName}<img src="${cardData.image}" alt="${cardName}"></a>`,
		);
	});

			
	return content;
};