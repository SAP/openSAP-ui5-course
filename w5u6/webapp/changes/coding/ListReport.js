/***
@controller Name:sap.suite.ui.generic.template.ListReport.view.ListReport,
*@viewId:nw.epm.refapps.st.prod.manage::sap.suite.ui.generic.template.ListReport.view.ListReport::SEPMRA_C_PD_Product
*/
sap.ui.define([
	"sap/ui/core/mvc/ControllerExtension",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
	// ,"sap/ui/core/mvc/OverrideExecution"
],
function (
	ControllerExtension,
	Filter,
	FilterOperator
	// ,OverrideExecution
) {
	"use strict";

	//box type definition:
	var BOX_TYPES = {
		small: new Filter({
			filters: [
				new Filter({
					path: "Height",
					operator: FilterOperator.BT,
					value1: 0,
					value2: 10
				}),
				new Filter({
					path: "Width",
					operator: FilterOperator.BT,
					value1: 0,
					value2: 10
				}),
				new Filter({
					path: "Depth",
					operator: FilterOperator.BT,
					value1: 0,
					value2: 10
				})
			],
			and: true
		}),
		medium: new Filter({
			filters: [
				new Filter({
					path: "Height",
					operator: FilterOperator.BT,
					value1: 10,
					value2: 20
				}),
				new Filter({
					path: "Width",
					operator: FilterOperator.BT,
					value1: 10,
					value2: 20
				}),
				new Filter({
					path: "Depth",
					operator: FilterOperator.BT,
					value1: 10,
					value2: 20
				})
			],
			and: true
		}),
		large: new Filter({
			filters: [
				new Filter({
					path: "Height",
					operator: FilterOperator.GT,
					value1: 20
				}),
				new Filter({
					path: "Width",
					operator: FilterOperator.GT,
					value1: 20
				}),
				new Filter({
					path: "Depth",
					operator: FilterOperator.GT,
					value1: 20
				})
			],
			and: true
		})
	};
	return ControllerExtension.extend("customer.opensap.manage.products.ListReport", {
		// this section allows to extend lifecycle hooks or override public methods of the base controller
		override: {
			// 	override public method of the ListReport controller
			templateBaseExtension: {
				/**
				 * Can be used to add filters. They will be combined via AND with all other filters
				 * sControlId is the ID of the control on which extension logic to be applied.
				 * For each filter the extension must call fnAddFilter(oControllerExtension, oFilter)
				 * oControllerExtension must be the ControllerExtension instance which adds the filter
				 * oFilter must be an instance of sap.ui.model.Filter
				 */
				addFilters: function (fnAddFilter, sControlId) {
					var oComboBox = this.byId("boxTypes");
					var sSelectedBoxType = oComboBox.getSelectedKey();
					var oFilter = BOX_TYPES[sSelectedBoxType];
					if (oFilter){
						fnAddFilter(this, oFilter);
					}
				}
			}
		},
		onShare: function (oEvent) {
			//Similar use case: https://sapui5.hana.ondemand.com/#/topic/a269671fc49e4c75920c108961bf31f2

			// 1. Get SAP Fiori elements extensionAPI instance:
			// * SAP Fiori elements ListReport base controller is accessed by this.base
			// * templateBaseExtension provides public API for SAP Fiori elements extensions, like the extensionAPI that is also used by SAP Fiori elements developers
			var oExtensionAPI = this.base.templateBaseExtension.getExtensionAPI();

			// 2. Get selected products via extensionAPI methods
			// see https://sapui5.hana.ondemand.com/#/api/sap.suite.ui.generic.template.ListReport.extensionAPI.ExtensionAPI/methods/getSelectedContexts
			var aSeletion = oExtensionAPI.getSelectedContexts();
			if (aSeletion.length > 0) {
				// access our i18n model where the texts are available
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

				var sTo = "nobody@sap.com";
				var sSubject = oResourceBundle.getText("SHARE_SUBJECT");
				var sProducts = aSeletion.reduce(function (sText, oSelectedContext) {
					// for each selected product, get the OData entity
					var mSelectedData = oSelectedContext.getObject();
					// add a line with some entity informaton to our email
					return sText + oResourceBundle.getText("SHARE_PRODUCT", [mSelectedData.Product, mSelectedData.Price, mSelectedData.Currency]);
				}, "");
				// combine the body text
				var sBody = oResourceBundle.getText("SHARE_BODY", [sProducts]);
				// use SAPUI5 helper functionality to prepare the email
				sap.m.URLHelper.triggerEmail(sTo, sSubject, sBody);
			}
		}
	});
});
