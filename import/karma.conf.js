/* global module*/

module.exports = function(config) {
	"use strict";

	config.set({

		basePath: 'webapp',

		frameworks: ['qunit', 'openui5'],

		openui5: {
			path: 'https://sapui5.hana.ondemand.com/resources/sap-ui-core.js',
			useMockServer: true
		},

		client: {
			openui5: {
				config: {
					theme: 'sap_belize',
					language: 'EN',
					animation: false,
					compatVersion: 'edge',
					async: true,
					resourceroots: {
						'opensap.orders': './base'
					}
				},
				mockserver: {
					metadataURL: '/base/localService/metadata.xml'
				},
				tests: [
					'opensap/orders/test/unit/AllTests'
				]
			},
			clearContext: false,
			qunit: {
				showUI: true
			}
		},

		files: [
			{ pattern: '**', included: false, served: true, watched: true },
			// ensure the right version of sinon and sinon-qunit is loaded
			"../node_modules/@openui5/sap.ui.core/src/sap/ui/thirdparty/sinon.js",
			"../node_modules/@openui5/sap.ui.core/src/sap/ui/thirdparty/sinon-qunit.js",
			// �autorun.js� script of the karma-openui5 plugin gets loaded BEFORE sinon / sinon-qunit. functionality via �attachInit� can not be guaranteed . Solution: put �autorun.js� always at the end of �files�
			"../node_modules/karma-openui5/lib/autorun.js"
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
