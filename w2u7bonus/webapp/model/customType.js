sap.ui.define([
	"sap/ui/model/SimpleType"
], function (SimpleType) {
	"use strict";
	return SimpleType.extend("opensap.myapp.model.customType", {
		/**
		 * Formats for the ui representation
		 *
		 */
		formatValue: function () {
	
		},
		/**
		 * Parsing for writing back to the model
		 *
		 */
		parseValue: function () {

		},
		/**
		 * Validates the value to be parsed
		 *
		 */
		validateValue: function () {
		}

	});
});