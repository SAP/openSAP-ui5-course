sap.ui.define([], function () {
	"use strict";

	return {

		formatDate: function (sValue) {
			if (!sValue) {
				return null;
			}

			return new Date(sValue);
		}
	};

});