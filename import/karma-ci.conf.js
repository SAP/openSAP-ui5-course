/* global module require*/

module.exports = function(config) {
	"use strict";

	/* eslint-disable no-unused-vars*/
	require("./karma.conf")(config);
	/* eslint-enable no-unused-vars*/

	config.set({

		browsers: ['ChromeHeadless'],

		singleRun: true

	});
};
