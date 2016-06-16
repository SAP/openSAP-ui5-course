sap.ui.define([
		"opensap/manageproducts/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("opensap.manageproducts.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);