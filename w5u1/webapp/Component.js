jQuery.sap.declare("SalesOrders.Component");
sap.ui.getCore().loadLibrary("sap.ui.generic.app");
jQuery.sap.require("sap.ui.generic.app.AppComponent");

sap.ui.generic.app.AppComponent.extend("SalesOrders.Component", {
	metadata: {
		"manifest": "json"
	}
});