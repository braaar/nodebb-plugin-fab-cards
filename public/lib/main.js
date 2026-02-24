'use strict';
(async () => {
	const hooks = await app.require('hooks');

	hooks.on('action:ajaxify.end', async (/* data */) => {
		
	});
})();
