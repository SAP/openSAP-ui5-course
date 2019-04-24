/* global module require*/

module.exports = function(config) {
	"use strict";

	/* eslint-disable no-unused-vars*/
	require("./karma.conf")(config);
	/* eslint-enable no-unused-vars*/

	config.set({

		preprocessors: {
			'{webapp,webapp/!(test)}/*.js': ['coverage']
		},

		coverageReporter: {
			includeAllSources: true,
			reporters: [
				{
					type: 'html',
					dir: '../coverage/'
				},
				{
					type: 'text'
				}
			],
			check: {
				each: {
					statements: 100,
					branches: 100,
					functions: 100,
					lines: 100
				}
			}
		},

		client: {
			qunit: {
				showUI: false
			}
		},

		reporters: ['progress', 'coverage'],

		browsers: ['ChromeHeadless'],

		singleRun: true

	});
};
