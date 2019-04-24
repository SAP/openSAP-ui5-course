sap.ui.define([
	"sap/ui/core/Component",
	"sap/m/Button",
	"sap/m/Bar",
	"sap/m/MessageToast",
	"sap/m/Input",
	"sap/m/Panel",
	"sap/m/Dialog"
], function (Component, Button, Bar, MessageToast, Input, Panel, Dialog) {

	return Component.extend("bookmarkplugin.Component", {

		metadata: {
			"manifest": "json"
		},

		init: function () {
			var rendererPromise = this._getRenderer();

			// This is example code. Please replace with your implementation!

			/**
			 * Add item to the header
			 */
			rendererPromise.then(function (oRenderer) {
				oRenderer.addHeaderItem({
					icon: "sap-icon://add",
					tooltip: "Add bookmark",
					press: this.createDialog.bind(this)
				}, true, true);
			}.bind(this));

		},

		createDialog: function() {
			var oInputURL = new Input({
				placeholder: "Enter a URL"
			});
			var oInputTitle = new Input({
				placeholder: "Enter a title for your bookmark"
			});
			var oPanel = new Panel({
				content: [oInputTitle, oInputURL]
			});
			this.oDialog = new Dialog({
				content: oPanel,
				title: "Add your custom bookmark",
				beginButton: new Button({
					text: "Add bookmark",
					press: function() {
						this._addBookmark(oInputTitle.getValue(), oInputURL.getValue());
						this.oDialog.close();
					}.bind(this)
				}),
				endButton: new Button({
					text: "Cancel",
					press: function() {
						this.oDialog.close();
					}.bind(this)
				})
			}).open();
		},

		_addBookmark: function(sTitle, sUrl) {
			sap.ushell.Container.getService("Bookmark").addBookmark({
				title: sTitle,
				url: sUrl
			});
		},

		/**
		 * Returns the shell renderer instance in a reliable way,
		 * i.e. independent from the initialization time of the plug-in.
		 * This means that the current renderer is returned immediately, if it
		 * is already created (plug-in is loaded after renderer creation) or it
		 * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
		 * before the renderer is created).
		 *
		 *  @returns {object}
		 *      a jQuery promise, resolved with the renderer instance, or
		 *      rejected with an error message.
		 */
		_getRenderer: function () {
			var that = this,
				oDeferred = new jQuery.Deferred(),
				oRenderer;

			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
			if (!that._oShellContainer) {
				oDeferred.reject(
					"Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
			} else {
				oRenderer = that._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					that._onRendererCreated = function (oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
						}
					};
					that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
				}
			}
			return oDeferred.promise();
		}
	});
});
