sap.ui.define([], function () {
	"use strict";

	return {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		currencyValue : function (sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		},

		/**
		 * Converts the delivery status value from the data into a number used for the colorScheme propery of the InfoLabel control.
		 *
		 * @public
		 * @param {string} sValue The value to be formatted
		 * @returns {int} The formatted delivery status value for the InfoLabel colorScheme
		 */
		deliveryStatus: function(sValue) {
			switch(sValue) {
				case "N": return 5;
				case "P": return 1;
				case "X": return 3;
				case "C": return 7;
				default: return 7;
			}
		}
	};

});