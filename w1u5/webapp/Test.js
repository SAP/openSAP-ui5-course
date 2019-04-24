sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/MessageToast"
], function (Object, MessageToast) {
	"use strict";

	return Object.extend("HelloWorld.Sample", {

		doSomething: function () {
			var sHelloWorld = "Hello world";

			MessageToast.show("Hello world", {duration: 1000});
			alert("Do not do this!");

			// this.oObject = 5;
			return this.oObject = 5;
		}
	});
});
