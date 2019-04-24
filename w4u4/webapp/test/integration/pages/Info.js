sap.ui.define([
	"sap/ui/test/Opa5",
	"./Common"
], function (Opa5, Common) {
	"use strict";
	Opa5.createPageObjects({
		onTheInfoPage: {
			baseClass: Common,
			assertions: {
				iShouldSeeTheInfoPage: function () {
					return this.waitFor({
						viewName: "Info",
						id: "objectPageLayout",
						success: function (oPage) {
							Opa5.assert.ok(oPage, "Found the info page");
						}
					});
				}
			}
		}
	});
});