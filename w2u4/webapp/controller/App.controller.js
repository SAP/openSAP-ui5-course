sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/base/Log",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/UIComponent"
], function (Controller, Log, JSONModel, formatter, Filter, FilterOperator, UIComponent) {
	"use strict";

	return Controller.extend("opensap.movies.controller.App", {

		formatter: formatter,

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
				var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				oMessage.show(oResourceBundle.getText("search") + " " + sValue);
			}.bind(this));

			var sCity = this.byId('city').getValue(),
				sGenre = this.byId('genre').getSelectedItem().getKey(),
				oCalendar = this.byId("calendar"),
				oRowBinding = oCalendar.getBinding("rows"),
				oFilterGenre,
				oFilterCity;

			// Create filters for genre and city according to user inputs
			oFilterGenre = sGenre ? new Filter("genre", FilterOperator.EQ, sGenre) : null;
			oFilterCity = sCity ? new Filter("info", FilterOperator.Contains, sCity) : null;

			// Apply genre filter to calendar rows
			oRowBinding.filter(oFilterGenre);

			// Apply city filter to row appointments
			var aRows = oCalendar.getAggregation("rows");
			aRows.forEach(function (oItem) {
				var oAppointmentsBinding = oItem.getBinding("appointments");
				oAppointmentsBinding.filter(oFilterCity);
			});
		},

		onAppointmentSelect: function (oAppointment) {
			var oContext = oAppointment.getBindingContext("movies"),
				sPath = oContext.getPath();

			var aParameters=sPath.split("/");
			UIComponent.getRouterFor(this).navTo("Detail", {
				movieId: aParameters[2],
				appointmentId: aParameters[4]
			});
		}

	});
});