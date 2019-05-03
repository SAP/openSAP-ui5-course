sap.ui.define([
	"./BaseController",
	"sap/m/MessageToast"
], function (BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("opensap.orders.controller.Create", {

		onInit: function () {
			// create a message manager and register the message model
			this._oMessageManager = sap.ui.getCore().getMessageManager();
			this._oMessageManager.registerObject(this.getView(), true);
			this.setModel(this._oMessageManager.getMessageModel(), "message");

			this.getRouter().getRoute("create").attachPatternMatched(this._onCreateMatched, this);
		},

		_onCreateMatched: function (oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;

			// create a binding context for a new order item
			this.oContext = this.getModel().createEntry("/SalesOrderLineItemSet", {
				properties: {
					SalesOrderID: sObjectId,
					ProductID: "",
					Note: "",
					Quantity: "1",
					DeliveryDate: new Date()
				},
				success: this._onCreateSuccess.bind(this)
			});
			this.getView().setBindingContext(this.oContext);

			// reset potential server-side messages
			this._oMessageManager.removeAllMessages();

			// set a dynamic date constraint in controller, as "today" cannot be
			// defined declaratively in XMLView
			var oToday = new Date();
			oToday.setHours(0, 0, 0, 0);
			this.byId("deliveryDate").getBinding("value").getType().setConstraints({
				minimum: oToday
			});

			this.getModel("appView").setProperty("/layout", "ThreeColumnsMidExpanded");
		},

		_onCreateSuccess: function (oContext) {
			// show success message
			var sMessage = this.getResourceBundle().getText("newItemCreated", [oContext.ProductID]);
			MessageToast.show(sMessage, {
				closeOnBrowserNavigation : false
			});

			// navigate to the new item in display mode
			this.getRouter().navTo("Info", {
				objectId : oContext.SalesOrderID,
				itemPosition : oContext.ItemPosition
			}, true);
		},

		onCreate: function () {
			// send new item to server for processing
			this.getModel().submitChanges();
		},

		onCancel: function () {
			var sObjectId = this.getView().getBindingContext().getProperty("SalesOrderID");

			// discard the new context on cancel
			this.getModel().deleteCreatedEntry(this.oContext);

			// close the third column
			this.getRouter().navTo("object", {
				objectId : sObjectId
			}, true);
		},

		onNameChange: function () {
			// clear potential server-side messages to allow saving the item again
			this._oMessageManager.getMessageModel().getData().forEach(function(oMessage){
				if (oMessage.code) {
					this._oMessageManager.removeMessages(oMessage);
				}
			}.bind(this));
		},

		onOpenMessages: function (oEvent) {
			this.byId("messages").openBy(oEvent.getSource());
		}

	});

});