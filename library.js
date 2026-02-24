'use strict';

const nconf = require.main.require('nconf');
const winston = require.main.require('winston');

const meta = require.main.require('./src/meta');

const controllers = require('./lib/controllers');

const routeHelpers = require.main.require('./src/routes/helpers');

const plugin = {};


const cards = require('./cards/cards.json');

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


function insertCardLinks(html) {
	sortedCardNames.forEach((cardName) => {
		// Use word boundaries and allow for punctuation after the card name
		const cardData = cardNameToData[cardName];
		const regexEscapedCardName = cardName.replace(
			/[-\/\\^$*+?.()|[\]{}]/g,
			'\\$&',
		);
		const expression = new RegExp(
			`(?<!<a[^>]*[^>]*>[^>]*|["@-_;:?!.,;:'^¨*#$€&/]|[0-9])${regexEscapedCardName}(?=[<?!.,;:\s])`,
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

plugin.parsePost = async (data) => {
	const updatedContent = insertCardLinks(data.postData.content);
	data.postData.content = updatedContent;
	
	return data;
};

plugin.init = async (params) => {
	const { router /* , middleware , controllers */ } = params;

	// Settings saved in the plugin settings can be retrieved via settings methods
	const { setting1, setting2 } = await meta.settings.get('quickstart');
	if (setting1) {
		console.log(setting2);
	}

	/**
	 * We create two routes for every view. One API call, and the actual route itself.
	 * Use the `setupPageRoute` helper and NodeBB will take care of everything for you.
	 *
	 * Other helpers include `setupAdminPageRoute` and `setupAPIRoute`
	 * */
	routeHelpers.setupPageRoute(router, '/quickstart', [(req, res, next) => {
		winston.info(`[plugins/quickstart] In middleware. This argument can be either a single middleware or an array of middlewares`);
		setImmediate(next);
	}], (req, res) => {
		winston.info(`[plugins/quickstart] Navigated to ${nconf.get('relative_path')}/quickstart`);
		res.render('quickstart', { uid: req.uid });
	});

	routeHelpers.setupAdminPageRoute(router, '/admin/plugins/quickstart', controllers.renderAdminPage);
};

/**
 * If you wish to add routes to NodeBB's RESTful API, listen to the `static:api.routes` hook.
 * Define your routes similarly to above, and allow core to handle the response via the
 * built-in helpers.formatApiResponse() method.
 *
 * In this example route, the `ensureLoggedIn` middleware is added, which means a valid login
 * session or bearer token (which you can create via ACP > Settings > API Access) needs to be
 * passed in.
 *
 * To call this example route:
 *   curl -X GET \
 *     http://example.org/api/v3/plugins/quickstart/test \
 *     -H "Authorization: Bearer some_valid_bearer_token"
 *
 * Will yield the following response JSON:
 * {
 *  "status": {
 *    "code": "ok",
 *    "message": "OK"
 *  },
 *  "response": {
 *    "foobar": "test"
 *  }
 * }
 */
plugin.addRoutes = async ({ router, middleware, helpers }) => {
	const middlewares = [
		middleware.ensureLoggedIn, // use this if you want only registered users to call this route
		// middleware.admin.checkPrivileges, // use this to restrict the route to administrators
	];

	routeHelpers.setupApiRoute(router, 'get', '/quickstart/:param1', middlewares, (req, res) => {
		helpers.formatApiResponse(200, res, {
			foobar: req.params.param1,
		});
	});
};

plugin.addAdminNavigation = (header) => {
	header.plugins.push({
		route: '/plugins/quickstart',
		icon: 'fa-tint',
		name: 'Quickstart',
	});

	return header;
};

module.exports = plugin;
