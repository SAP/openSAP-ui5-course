/***
@controller Name:sap.suite.ui.generic.template.ObjectPage.view.Details,
*@viewId:nw.epm.refapps.st.prod.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product
*/
sap.ui.define([
        'sap/ui/core/mvc/ControllerExtension'
        // ,'sap/ui/core/mvc/OverrideExecution'
    ],
    function (
        ControllerExtension
        // ,OverrideExecution
    ) {
        "use strict";
        return ControllerExtension.extend("customer.opensap.manage.products.ObjectPage", {
            // this section allows to extend lifecycle hooks or override public methods of the base controller
            override: {
                //  /**
                //   * Called when a controller is instantiated and its View controls (if available) are already created.
                //   * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
                //   * @memberOf customer.acme.manage.products.ObjectPage.js
                //   */
                onInit: function () {
                    //configure map to use openstreetmap data
                    var oMapConfig = {
                        "MapProvider": [{
                            "name": "OSM",
                            "type": "",
                            "description": "",
                            "tileX": "256",
                            "tileY": "256",
                            "maxLOD": "20",
                            "copyright": "Tiles Courtesy of OpenMapTiles",
                            "Source": [{
                                "id": "s1",
                                "url": "https://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
                            }]
                        }],
                        "MapLayerStacks": [{
                            "name": "Default",
                            "MapLayer": [{
                                "name": "OSM",
                                "refMapProvider": "OSM"
                            }]
                        }]
                    };
                    var oSupplierMap = this.byId("supplierMap");
                    oSupplierMap.setMapConfiguration(oMapConfig);
                    
                    //bind the whole section to the supplier including the supplier address
                    var oSupplierSection = this.byId("supplierSection");
                    oSupplierSection.bindElement("to_Supplier", {
                        //inline the address data in the supplier 
                        expand: "to_Address"
                    });
                    
                
                    oSupplierMap.bindProperty("initialPosition", {
                        parts: [
                            "to_Address/Longitude",
                            "to_Address/Latitude"
                        ],
                        formatter : function(sLong,sLat){
                            return sLong +";" + sLat + ";0" ;
                        }
                    });
                }
            }
        });
    });
