sap.ui.define([
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("opensap.orders.controller.Info", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf opensap.orders.view.Info
		 */
		onInit: function () {
			this.getRouter().getRoute("Info").attachPatternMatched(this._onInfoMatched, this);
		},

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onInfoMatched: function (oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId,
				sItemPosition = oEvent.getParameter("arguments").itemPosition;

			this.getModel("appView").setProperty("/selectedItemId", sItemPosition);
			this.getModel("appView").setProperty("/layout", "ThreeColumnsEndExpanded");
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("SalesOrderLineItemSet", {
					SalesOrderID: sObjectId,
					ItemPosition: sItemPosition
				});
				this.getView().bindElement({
					path: "/" + sObjectPath,
					parameters: {
						'expand': 'ToHeader'
					}
				});
			}.bind(this));
		}

	});

});