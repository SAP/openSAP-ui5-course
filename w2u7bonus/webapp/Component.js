sap.ui.define([
	"sap/ui/core/UIComponent"
], function (UIComponent) {
	"use strict";

	return UIComponent.extend("opensap.myapp.Component", {

		metadata : {
			manifest: "json"
		},

		init : function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// used only for this lessons to show the request individually...
			this.getModel().setUseBatch(false);

			// additional initialization can be done here
		}

	});
});