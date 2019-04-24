sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/base/Log"
], function (Controller, Log) {
	"use strict";

	return Controller.extend("opensap.movies.controller.App", {

		onInit: function () {
			Log.info("Controller has been initialized.");
		},
		
		onBeforeRendering: function () {
			Log.info("View will shortly be rendered.");
		},
		
		onAfterRendering: function () {
			Log.info("View has been rendered.");
		},

		onExit: function () {
			Log.info("Controller will shortly be destroyed.");
		},

		onPress: function (sValue) {
			sap.ui.require(["sap/m/MessageToast"], function (oMessage) {
				oMessage.show("Searching..." + " " + sValue);
});
		}

	});
});