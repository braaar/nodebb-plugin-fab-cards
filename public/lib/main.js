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
		console.log('hello 0.1.7!');
	});

	hooks.on('action:ajaxify.end', async (/* data */) => {
		// called everytime user navigates between pages including first load

		const words = ['Command and conquer',
			'Flex claws',
			'Flex'];


		function insertWords(text) {
			words.forEach((word) => {
				const regex = new RegExp(`\\b${word}\\b`, 'gi');
				text = text.replace(regex, `<a href="http://google.com" class="fab-card">${word}</a>`);
			});
			return text;
		};
		// find each element with the attribute component="post/content"
		// and replace all instances of "NodeBB" with <b class="fab-card">NodeBB</b> in the DOM
		$('[component="post/content"]').each((i, el) => {
			const html = $(el).html();
			const replaced = insertWords(html);
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
