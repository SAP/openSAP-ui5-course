sap.ui.define([], function() {
	"use strict";

	return {
		
		/**
		 * @public
		 * Determines a delivery method based on the weight of a product
		 * @param {string} sMeasure the measure of the weight to be formatted
		 * @param {integer} iWeight the weight to be formatted
		 * @returns {string} sValue the delivery method
		 */
		delivery: function(sMeasure, iWeight) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle(),
				sResult = "";

			if(sMeasure === "G") {
				iWeight = iWeight / 1000;
			}
			if (iWeight < 0.5) {
				sResult = oResourceBundle.getText("formatterMailDelivery");
			} else if (iWeight < 5) {
				sResult = oResourceBundle.getText("formatterParcelDelivery");
			} else {
				sResult = oResourceBundle.getText("formatterCarrierDelivery");
			}

			return sResult;
		},

		/**
		 * Formats an address to a static google maps image
		 * @public
		 * @param {string} sStreet the street
		 * @param {string} sZIP the postal code
		 * @param {string} sCity the city
		 * @param {string} sCountry the country
		 * @returns {string} sValue a google maps URL that can be bound to an image
		 */
		formatMapUrl: function(sStreet, sZIP, sCity, sCountry) {
			return "https://maps.googleapis.com/maps/api/staticmap?zoom=13&size=640x640&markers="
				+ jQuery.sap.encodeURL(sStreet + ", " + sZIP +  " " + sCity + ", " + sCountry);
		}
	};
});