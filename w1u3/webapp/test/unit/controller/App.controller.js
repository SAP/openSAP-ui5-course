/*global QUnit*/

sap.ui.define([
	"sap/ui/demo/basicTemplate/controller/App.controller"
], function(Controller) {
	"use strict";

	QUnit.module("App Controller");

	QUnit.test("I should test the app controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
