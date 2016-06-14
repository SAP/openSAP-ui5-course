jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
		"sap/ui/test/Opa5",
		"opensap/manageproducts/test/integration/pages/Common",
		"sap/ui/test/opaQunit",
		"opensap/manageproducts/test/integration/pages/NewProduct",
		"opensap/manageproducts/test/integration/pages/Worklist",
		"opensap/manageproducts/test/integration/pages/Object",
		"opensap/manageproducts/test/integration/pages/NotFound",
		"opensap/manageproducts/test/integration/pages/Browser",
		"opensap/manageproducts/test/integration/pages/App"
	], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "opensap.manageproducts.view."
	});

	sap.ui.require([
		"opensap/manageproducts/test/integration/WorklistJourney",
		"opensap/manageproducts/test/integration/ObjectJourney",
		"opensap/manageproducts/test/integration/NavigationJourney",
		"opensap/manageproducts/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});