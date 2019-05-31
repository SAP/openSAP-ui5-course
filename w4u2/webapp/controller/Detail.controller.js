/*global location */
sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/m/library",
	"sap/ui/Device",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, formatter, mobileLibrary, Device, MessageToast) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return BaseController.extend("opensap.orders.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit : function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy : false,
				delay : 0,
				lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading")
			});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this.getRouter().getRoute("Info").attachPatternMatched(this._onObjectMatched, this);
			this.getRouter().getRoute("create").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		onCreate: function (oEvent) {
			var bReplace = !Device.system.phone;

			this.getRouter().navTo("create", {
				objectId : oEvent.getSource().getBindingContext().getProperty("SalesOrderID")
			}, bReplace);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onSendEmailPress : function () {
			var oViewModel = this.getModel("detailView");

			URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},


		/**
		 * Updates the item count within the line item table's header
		 * @param {object} oEvent an event containing the total number of items in the list
		 * @private
		 */
		onListUpdateFinished : function (oEvent) {
			var sTitle,
				iTotalItems = oEvent.getParameter("total"),
				oViewModel = this.getModel("detailView");

			// only update the counter if the length is final
			if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
				if (iTotalItems) {
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
				} else {
					//Display 'Line Items' instead of 'Line items (0)'
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
				}
				oViewModel.setProperty("/lineItemListTitle", sTitle);
			}
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched : function (oEvent) {
			var sObjectId =  oEvent.getParameter("arguments").objectId;

			if (!sObjectId) {
				return;
			}
			if (oEvent.getParameter("name") === "object") {
				this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			}

			this.getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getModel().createKey("SalesOrderSet", {
					SalesOrderID : sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView : function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path : sObjectPath,
				events: {
					change : this._onBindingChange.bind(this),
					dataRequested : function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
			this.byId("orderPreparations").reset();
		},

		_onBindingChange : function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath),
				sObjectId = oObject.SalesOrderID,
				sObjectName = oObject.CustomerName,
				oViewModel = this.getModel("detailView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},

		_onMetadataLoaded : function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView"),
				oLineItemTable = this.byId("lineItemsList"),
				iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);
			oViewModel.setProperty("/lineItemTableDelay", 0);

			oLineItemTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for line item table
				oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
			});

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},

		/**
		 * Set the full screen mode to false and navigate to master page
		 */
		onCloseDetailPress: function () {
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			this.byId("lineItemsList").removeSelections(true);
			// No item should be selected on master after detail page is closed
			this.getOwnerComponent().oListSelector.clearMasterListSelection();
			this.getRouter().navTo("master");
		},

		/**
		 * Toggle between full and non full screen mode.
		 */
		toggleFullScreen: function () {
			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			} else {
				// reset to previous layout
				this.getModel("appView").setProperty("/layout",  this.getModel("appView").getProperty("/previousLayout"));
			}
		},

		/**
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 */
		action: function (oEvent) {
			var bReplace = !Device.system.phone;
			this.getRouter().navTo("Info", {
				objectId : (oEvent.getParameter("listItem") || oEvent.getSource()).getBindingContext().getProperty("SalesOrderID"),
				itemPosition : (oEvent.getParameter("listItem") || oEvent.getSource()).getBindingContext().getProperty("ItemPosition")
			}, bReplace);
		},

		onConfirm: function (oEvent) {
			var oBinding = oEvent.getSource().getBindingContext().getObject();
			var oMessage = this.getResourceBundle().getText("OrderPreparationMessage", [oBinding.CustomerID, oBinding.CustomerName]);
			MessageToast.show(oMessage);
		},

		/**
		 * Delete list items according to drag and drop actions
		 * @param {sap.ui.base.Event} oEvent the drop event of the sap.ui.core.dnd.DropInfo
		 */
		onDelete : function (oEvent) {
			// delete the dragged item
			var oItemToDelete = oEvent.getParameter("draggedControl");

			// delete the selected item from the list - if nothing selected, remove the first item
			if (!oItemToDelete) {
				var oList = this.byId("lineItemsList");
				oItemToDelete = oList.getSelectedItem() || oList.getItems()[0];
			}

			// delete the item after user confirmation
			var sPath = oItemToDelete.getBindingContextPath(),
				sTitle = oItemToDelete.getBindingContext().getProperty("ProductID");
			this._confirmDelete(sPath, sTitle);
		},

		_confirmDelete : function (sPath, sTitle) {
			var oResourceBundle = this.getResourceBundle();
			sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
				MessageBox.confirm(oResourceBundle.getText("deleteConfirmationMessage", [sTitle]), {
					title: oResourceBundle.getText("confirmTitle"),
					onClose: function (sAction) {
						if (sAction === "OK") {
							this.getModel().remove(sPath, {
								success : function () {
									MessageToast.show(oResourceBundle.getText("deleteSuccessMessage"));
								},
								error : function () {
									MessageBox.error(oResourceBundle.getText("deleteErrorMessage"));
								}
							});
						}
					}.bind(this)
				});
			}.bind(this));
		},

		/**
		 * Reorder the list based on drag and drop actions
		 * @param {sap.ui.base.Event} oEvent the drop event of the sap.ui.core.dnd.DragDropInfo
		 */
		onReorder : function (oEvent) {
			var oDraggedItem = oEvent.getParameter("draggedControl"),
				oDroppedItem = oEvent.getParameter("droppedControl"),
				sDropPosition = oEvent.getParameter("dropPosition"),
				oList = this.byId("lineItemsList"),
				// get the index of dragged item
				iDraggedIndex = oList.indexOfItem(oDraggedItem),
				// get the index of dropped item
				iDroppedIndex = oList.indexOfItem(oDroppedItem),
				// get the new dropped item index
				iNewDroppedIndex = iDroppedIndex + (sDropPosition === "Before" ? 0 : 1) + (iDraggedIndex < iDroppedIndex ? -1 : 0);

			// remove the dragged item
			oList.removeItem(oDraggedItem);
			// insert the dragged item on the new drop index
			oList.insertItem(oDraggedItem, iNewDroppedIndex);
		},

		/**
		 * Move up the selected item
		 * This is an alternative to reorder the list item
		 * for devices that do not support drag and drop
		 */
		onMoveUp : function () {
			var oList = this.byId("lineItemsList"),
				oSelectedItem = oList.getSelectedItem();
			if (!oSelectedItem) {
				this._showItemNotSelectedMsg();
				return;
			}
			this._moveSelectedItem(oSelectedItem, "Up");
		},

		/**
		 * Move down the selected item
		 * This is an alternative to reorder the list item
		 * for devices that do not support drag and drop
		 */
		onMoveDown : function () {
			var oList = this.byId("lineItemsList"),
				oSelectedItem = oList.getSelectedItem();
			if (!oSelectedItem) {
				this._showItemNotSelectedMsg();
				return;
			}
			this._moveSelectedItem(oSelectedItem, "Down");
		},

		/**
		 * Move the selected item in the given direction (up or down)
		 * @param {oSelectedItem} The selected item object
		 * @param {sDirection} Direction in which the item should move
		 */
		_moveSelectedItem : function (oSelectedItem, sDirection) {
			var oList = this.byId("lineItemsList"),
				iIndex = oList.indexOfItem(oSelectedItem);
			oList.removeItem(oSelectedItem);
			if (sDirection === "Up") {
				iIndex += (iIndex <= 0 ? 0 : -1);
			} else {
				iIndex += (iIndex >= oList.getItems().length ? 0 : 1);
			}
			oList.insertItem(oSelectedItem, iIndex);
		},

		/**
		 * Inform the user if no item is selected to move
		 */
		_showItemNotSelectedMsg : function () {
			var oResourceBundle = this.getResourceBundle();
			MessageToast.show(oResourceBundle.getText("selectItemToMoveMsg"));
		}
	});

});