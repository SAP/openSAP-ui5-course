sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType"
], function (Controller, MessageToast, Filter, FilterOperator, FilterType) {
	"use strict";

	return Controller.extend("sap.ui.demo.odataV4.controller.App", {

		// filters the data in the table
		onFilter: function (oEvent) {
			var oView = this.getView(),
				oTable = oView.byId("peopleList"),
				oBinding = oTable.getBinding("items"),
				oFilter;

			if (oBinding) {
				oBinding.attachChange(this.onBindingChanged, this);
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
				} else {
					// remove the applied filter
					oBinding.filter();
				}
			}
		},

		// helper function to show message toast when the data is changed
		onBindingChanged: function (oEvent) {
			var oBinding = oEvent.getSource();
			oBinding.detachChange(this.onBindingChanged, this);
			if (oBinding.aApplicationFilters.length) {
				MessageToast.show(this._getText("peopleListTitleBudgetFilter"));
			} else {
				MessageToast.show(this._getText("peopleListTitleWithExpand"));
			}
		},

		_getText: function (sTextId, aArgs) {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sTextId, aArgs);
		}
	});
});
