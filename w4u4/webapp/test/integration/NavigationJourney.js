/*global QUnit*/
sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/Master",
	"./pages/Detail",
	"./pages/Browser",
	"./pages/App",
	"./pages/Info"
], function (opaTest) {
	"use strict";

	QUnit.module("Desktop navigation");

	opaTest("Should navigate on press", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Actions
		When.onTheMasterPage.iRememberTheIdOfListItemAtPosition(1).
			and.iPressOnTheObjectAtPosition(1);

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheRememberedObject().
			and.iShouldSeeHeaderActionButtons();
		Then.onTheBrowserPage.iShouldSeeTheHashForTheRememberedObject();
	});

	opaTest("Should press full screen toggle button: The app shows one column", function (Given, When, Then) {
		// Actions
		When.onTheDetailPage.iPressTheHeaderActionButton("enterFullScreen");

		// Assertions
		Then.onTheAppPage.theAppShowsFCLDesign("MidColumnFullScreen");
		Then.onTheDetailPage.iShouldSeeTheFullScreenToggleButton("exitFullScreen");
	});

	opaTest("Should press full screen toggle button: The app shows two columns", function (Given, When, Then) {
		// Actions
		When.onTheDetailPage.iPressTheHeaderActionButton("exitFullScreen");

		// Assertions
		Then.onTheAppPage.theAppShowsFCLDesign("TwoColumnsMidExpanded");
		Then.onTheDetailPage.iShouldSeeTheFullScreenToggleButton("enterFullScreen");
	});

	opaTest("Open Third Column", function (Given, When, Then) {
		// Actions
		When.onTheDetailPage.iPressOnTheFirstObject();

		// Assertions
		Then.onTheAppPage.theAppShowsFCLDesign("ThreeColumnsEndExpanded");
		Then.onTheInfoPage.iShouldSeeTheInfoPage();

		// Cleanup
		Then.iTeardownMyApp();
	});

});