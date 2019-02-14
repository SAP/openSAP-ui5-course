sap.ui.define([], function () {
	"use strict";

	return {

		formatDate: function (iValue) {
			if (!iValue) {
				return null;
			}

			return new Date(iValue);
		}
	};

});
