/* global module*/

module.exports = function(config) {
	"use strict";

	config.set({

		basePath: 'webapp',

		frameworks: ['qunit', 'openui5'],

		openui5: {
			path: 'http://localhost:8080/resources/sap-ui-core.js',
			useMockServer : true

		},

		client: {
			openui5: {
				config: {
					theme: 'sap_belize',
					language: 'EN',
					animation: false,
					compatVersion: 'edge',
					async: true,
					resourceroots: {'sap.ui.demo.basicTemplate': './base'}
				},
				tests: [
					'sap/ui/demo/basicTemplate/test/unit/AllTests',
					'sap/ui/demo/basicTemplate/test/integration/AllJourneys'
				],
				mockserver: {
					metadataURL: '/base/localService/metadata.xml'
				}
			},
			clearContext: false,
			qunit: {
				showUI: true
			}
		},

		files: [
			{ pattern: '**', included: false, served: true, watched: true}
		],

		reporters: ['progress'],

		logLevel: config.LOG_INFO,

		browserConsoleLogOptions: {
			level: 'warn'
		},

		autoWatch: true,

		browsers: ['Chrome'],

		singleRun: false
	});
};