sap.ui.require([
		"sap/ui/test/Opa5",
		"opensap/manageproducts/test/integration/pages/Common"
	], function(Opa5, Press, EnterText, Common) {
		"use strict";

		var sViewName = "Add",
			sPageId = "page";

		Opa5.createPageObjects({
			onTheNewProductPage : {
				baseClass : Common,
				assertions : {
					iShouldSeeThePage : function () {
						return this.waitFor({
							id : sPageId,
							viewName : sViewName,
							success : function () {
								Opa5.assert.ok(true, "The 'New Product' title is shown.");
							},
							errorMessage : "Did not display the 'New Product' page."
						});
					}
				}
			}
		});
	}
);