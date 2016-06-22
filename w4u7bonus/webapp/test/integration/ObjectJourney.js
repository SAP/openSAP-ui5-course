sap.ui.define([
		"sap/ui/test/opaQunit"
	], function (opaTest) {
		"use strict";

		QUnit.module("Object");

		opaTest("Should see the busy indicator on object view after metadata is loaded", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();

			//Actions
			When.onTheWorklistPage.iRememberTheItemAtPosition(1);
			When.onTheBrowser.iRestartTheAppWithTheRememberedItem({
				delay: 1000
			});
			When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

			// Assertions
			Then.onTheObjectPage.iShouldSeeTheObjectViewsBusyIndicator().
				and.theObjectViewsBusyIndicatorDelayIsRestored().
				and.iShouldSeeTheRememberedObject().
				and.theObjectViewShouldContainOnlyFormattedUnitNumbers().and.iTeardownMyAppFrame();
		});

		opaTest("Should see the 'New Product' view after pressing the 'Add' button", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();
			//Actions
			When.onTheWorklistPage.iWaitUntilTheTableIsLoaded().and.iPressAdd();
			//Assertions
			Then.onTheNewProductPage.iShouldSeeThePage().and.iTeardownMyAppFrame();
		});
	}
);