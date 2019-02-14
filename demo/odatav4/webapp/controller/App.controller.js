sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType"
], function (Controller, MessageToast, Filter, FilterOperator, FilterType) {
	"use strict";

	return Controller.extend("sap.ui.demo.odataV4.controller.App", {
		onFilter: function (oEvent) {
			var oView = this.getView(),
				oTable = oView.byId("peopleList"),
				oBinding = oTable.getBinding("items"),
				oFilter;
			if (oEvent.getSource().getPressed()) {
				// apply filter for users having any trips with budget greater than 3000
				oFilter = new Filter({
					path: "Trips",
					operator: FilterOperator.Any,
					variable: "trip",
					condition: new Filter({
						path: "trip/Budget",
						operator: FilterOperator.GT,
						value1: 3000
					})
				});

				oBinding.filter(oFilter, FilterType.Application);
				oTable.getHeaderToolbar().getContent()[0].setText(this._getText("peopleListTitleBudgetFilter"));
				MessageToast.show(this._getText("peopleListTitleBudgetFilter"));
			} else {
				// remove the applied filter
				oBinding.filter();
				oTable.getHeaderToolbar().getContent()[0].setText(this._getText("peopleListTitle"));
				MessageToast.show(this._getText("peopleListTitle"));
			}
		},

		_getText : function (sTextId, aArgs) {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sTextId, aArgs);
		}
	});
});