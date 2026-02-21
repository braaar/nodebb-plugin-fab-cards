'use strict';

const Utils = module.exports;

/**
 * Replaces each word in the list with a <b> tag in the text.
 * @param {string} text
 * @param {string[]} words
 */
Utils.insertWords = function (text, words) {
	words.forEach((word) => {
		const regex = new RegExp(`\\b${word}\\b`, 'gi');
		text = text.replace(regex, `<b class="fab-card">${word}</b>`);
	});
	return text;
};
