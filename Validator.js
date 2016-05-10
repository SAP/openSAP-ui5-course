/*global opensap,sinon*/

sap.ui.require([
	"sap/ui/test/Opa",
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/matchers/Properties",
	"sap/ui/test/matchers/Ancestor",
	"sap/ui/test/matchers/BindingPath"
], function (Opa, Opa5, Press, EnterText, AggregationFilled, PropertyStrictEquals, Properties, Ancestor, BindingPath) {
	"use strict";

	// reduce global timeout to 5s
	Opa.config.timeout = 5;

	sap.ui.base.Object.extend("opensap.Validator", {
		init: function () {
			this.bPressBlocker = false;
			opensap.reuse = {};

			this.injectTestButton();
			this.bindTestKey();
		},

		/**** Helper functions ***/

		// injects a simple testing button in the lower left area of the current app
		injectTestButton: function () {
			this._oValidateButton = new sap.m.Button("validate", {
				icon: "sap-icon://wrench",
				tooltip: "Click here or press F9 to execute the tests for this exercise",
				press: function () {
					// sometimes button triggers tap twice or user double clicks
					// therefore we add a slight timeout of 1s before resetting again
					setTimeout(function () {
						this.bPressBlocker = false;
					}.bind(this), 1000);
					if (!this.bPressBlocker) {
						this.runTests();
					} else {
						this._oPopover.openBy(this._oValidateButton);
					}
					this.bPressBlocker = true;
				}.bind(this)
			}).placeAt("content", -1);

			// CSS manupulation for the validator button
			this._oValidateButton.addEventDelegate({
				onAfterRendering: function (oEvent) {
					var oButton = oEvent.srcControl;
					oButton.$().css("position", "absolute");
					oButton.$().css("z-index", "100000");
					oButton.$().css("width", "100px");
					oButton.$().css("height", "100px");
					oButton.$().css("left", "50px");
					oButton.$().css("bottom", "50px");
					oButton.$().css("border-radius", "500px");

					oButton.$("inner").css("width", "100px");
					oButton.$("inner").css("height", "100px");
					oButton.$("inner").css("border-radius", "100px");
					oButton.$("inner").css("background", "#009de0");
					oButton.$("inner").css("text-shadow", "0 1px 50px #ffffff");

					oButton.$("img").css("color", "#eee");
					oButton.$("img").css("width", "100px");
					oButton.$("img").css("height", "100px");
					oButton.$("img").css("line-height", "100px");
					oButton.$("img").css("font-size", "35pt");
					oButton.$("img").control(0).setColor("#eee");
				}
			});
		},

		// bind F9 globally to trigger the tests
		bindTestKey: function () {
			var fnKeyDown = function (oEvent) {
				if (oEvent.keyCode === 120) { // F9 key triggers tests
					this.runTests();
				}
			}.bind(this);
			jQuery(window.document).bind("keydown", fnKeyDown);
		},

		// saves the current test unit to the cookies
		setUnitCookie: function(sKey) {
			document.cookie="unit=" + sKey;
		},

		// reads the current test unit from the cookies
		getUnitCookie: function() {
			var sCookieUnit = document.cookie.split(";").filter(function (sItem) { return sItem.split("=")[0].trim() === "unit"; });
			if (sCookieUnit.length) {
				return sCookieUnit[0].split("=").pop();
			}
			return "";
		},

		// convert the first 15 chars of the input string to an integer hash
		createHash : function(sInput) {
			var iHash = 0;

			for (var i = 0; i < sInput.length; i++ ) {
				iHash = ((iHash << 4) - iHash) + sInput.charCodeAt(i);
				iHash  = iHash & iHash;
			}
			return iHash;
		},

		// create a secret result code
		rankTest : function (sTestName, sMessage, bStatus) {
			this._sResult = this.createHash(this._sResult + btoa(sTestName + sMessage.substr(0,15) + bStatus));
		},

		/**** Layout functions ***/

		// returns a lazy loaded instance of the result popover
		getPopover: function () {
			if (!this._oPopover) {
				var oModel = new sap.ui.model.json.JSONModel();
				var mData = {
					"items": [
						{
							"key": "",
							"text": "..."
						},
						{
							"key": "w1u1",
							"text": "Week 1 Unit 1"
						},
						{
							"key": "w1u2",
							"text": "Week 1 Unit 2"
						},
						{
							"key": "w1u3",
							"text": "Week 1 Unit 3"
						},
						{
							"key": "w1u4",
							"text": "Week 1 Unit 4"
						},
						{
							"key": "w1u5",
							"text": "Week 1 Unit 5"
						},
						{
							"key": "w1u6",
							"text": "Week 1 Unit 6"
						},
						{
							"key": "w2u1",
							"text": "Week 2 Unit 1"
						},
						{
							"key": "w2u2",
							"text": "Week 2 Unit 2"
						},
						{
							"key": "w2u3",
							"text": "Week 2 Unit 3"
						},
						{
							"key": "w2u4",
							"text": "Week 2 Unit 4"
						},
						{
							"key": "w2u5",
							"text": "Week 2 Unit 5"
						},
						{
							"key": "w2u6",
							"text": "Week 2 Unit 6"
						},
						{
							"key": "w2u7bonus",
							"text": "Week 2 Bonus"
						},
						{
							"key": "w3u1",
							"text": "Week 3 Unit 1"
						},
						{
							"key": "w3u2",
							"text": "Week 3 Unit 2"
						},
						{
							"key": "w3u3",
							"text": "Week 3 Unit 3"
						},
						{
							"key": "w3u4",
							"text": "Week 3 Unit 4"
						},
						{
							"key": "w3u5",
							"text": "Week 3 Unit 5"
						},
						{
							"key": "w3u6",
							"text": "Week 3 Unit 6"
						},
						{
							"key": "w4u1",
							"text": "Week 4 Unit 1"
						},
						{
							"key": "w4u2",
							"text": "Week 4 Unit 2"
						},
						{
							"key": "w4u3",
							"text": "Week 4 Unit 3"
						},
						{
							"key": "w4u4",
							"text": "Week 4 Unit 4"
						},
						{
							"key": "w4u5",
							"text": "Week 4 Unit 5"
						},
						{
							"key": "w4u7bonus",
							"text": "Week 4 Bonus"
						}
					]
				};
				oModel.setData(mData);

				// create a select control that triggers the selected test run
				var oItemTemplate = new sap.ui.core.Item({
					key: "{key}",
					text: "{text}"
				});
				var oSelect = new sap.m.Select({
					width: "200px",
					selectedKey: this.getUnitCookie(),
					items: {
						path: "/items",
						template: oItemTemplate
					},
					change: function(oControlEvent) {
						var oSelectedItem = oControlEvent.getParameter("selectedItem");

						if (oSelectedItem) {
							this.runTests(oSelectedItem.getKey());
						}
					}.bind(this)
				});
				oSelect.setModel(oModel);

				this._oPopover = new sap.m.Popover("validatePopover", {
					customHeader: new sap.m.Bar({
						contentMiddle: [
							new sap.m.Text({text: "Validating..."}).addEventDelegate({
								onAfterRendering: function (oEvent) {
									var $Control = oEvent.srcControl.$();
									$Control.css("font-size", "1.125rem");
								}
							}).addStyleClass("sapUiSmallMarginBeginEnd"),
							oSelect
						]
					}),
					initialFocus: oSelect,
					content: [
						new sap.m.ProgressIndicator({
							height: "15px"
						}).addEventDelegate({
							onAfterRendering: function (oEvent) {
								var $Control = oEvent.srcControl.$();
								$Control.css("margin", "0");
								$Control.css("border", "0px");
								oEvent.srcControl.$("textLeft").css("line-height", "15px");
								oEvent.srcControl.$("textRight").css("line-height", "15px");
							}
						}),
						new sap.m.List({
							noDataText: "Please select a unit"
						})
					],
					placement: sap.m.PlacementType.HorizontalPreferredRight
				});
			}

			this._oPopover.openBy(this._oValidateButton);
			this._oPopover.oPopup.setAutoClose(false);
			return this._oPopover;
		},

		// update the progress bar based on the number of ran tests
		updateProgress: function (iValue) {
			var oProgress = this.getPopover().getContent()[0];

			oProgress.setPercentValue(iValue);
			oProgress.setDisplayValue(Math.round(iValue) + "%");
		},

		// add a new test to the result list
		addTestStatus: function (sTestName) {
			var oDisplayListItem = new sap.m.CustomListItem({
				content: [
					new sap.m.Text({
						text: sTestName
					}).addStyleClass("sapUiTinyMarginEnd"),
					new sap.m.BusyIndicator()
				]
			}).addStyleClass("sapUiSmallMargin");

			this.getPopover().getContent()[1].addItem(oDisplayListItem);
		},

		// update the current test result
		updateTestResult: function (sTestName, sMessage, bStatus, bFinal) {
			var oDisplayListItem;

			if (sTestName) {
				oDisplayListItem = this.getPopover().getContent()[1].getItems().filter(function (oItem) {
					return (oItem.getContent()[0].getText().split(":")[0] === sTestName);
				})[0];
			} else {
				oDisplayListItem = this.getPopover().getContent()[1].getItems().pop();
				sTestName = oDisplayListItem.getContent()[0].getText().split(":")[0];
			}

			if (bStatus) {
				jQuery.sap.log.info("Validator - " + sTestName + (sMessage ? ": " + sMessage : ""));
			} else {
				jQuery.sap.log.error("Validator - " + sTestName + (sMessage ? ": " + sMessage : ""));
			}
			oDisplayListItem.getContent()[0].setText(sTestName + (sMessage ? ": " + sMessage : ""));
			oDisplayListItem.removeContent(1);
			oDisplayListItem.insertContent(
				new sap.ui.core.Icon({
					src: (bStatus ? "sap-icon://sys-enter" : "sap-icon://sys-cancel"),
					color: (bStatus ? "#007833" : "#cc1919")
				}),
				1
			);
			if(oDisplayListItem.getContent().length === 2 && !bFinal) {
				oDisplayListItem.addContent(new sap.m.BusyIndicator().addStyleClass("sapUiTinyMarginBegin"));
			}
		},

		removeTestBusy: function (sTestName) {
			var oDisplayListItem = this.getPopover().getContent()[1].getItems().filter(function (oItem) {
				return (oItem.getContent()[0].getText().split(":")[0] === sTestName);
			})[0];
			// clear busy indication on the list
			if(oDisplayListItem.getContent().length === 3) {
				oDisplayListItem.removeContent(2);
			}
		},

		// add a new test to the result list
		showCode: function () {
			var oDisplayListItem = new sap.m.CustomListItem({
				content: [
					new sap.m.Text({
						text: "Your result code is: "
					}).addStyleClass("sapUiTinyMarginEnd").addEventDelegate({
						onAfterRendering: function (oEvent) {
							var $Control = oEvent.srcControl.$();
							$Control.css("font-weight", "bold");
						}
					}),
					new sap.m.Text({
						text: Math.abs(this._sResult).toString()
					}).addEventDelegate({
						onAfterRendering: function (oEvent) {
							var $Control = oEvent.srcControl.$();
							$Control.css("font-weight", "bold");
						}
					})
				]
			}).addStyleClass("sapUiSmallMargin");

			// new sap.m.DisplayListItem({label: sMessage});
			this.getPopover().getContent()[1].addItem(oDisplayListItem);
		},

		// update the result after processing all the tests (title, progress, button)
		showResult: function (sMessage, bStatus) {
			var oPopover = this.getPopover(),
				oProgress = this.getPopover().getContent()[0],
				oTitle = oPopover.getCustomHeader().getContentMiddle()[0],
				oButton = sap.ui.getCore().byId("validate");

			// clear busy indication on the list
			this.getPopover().getContent()[1].getItems().forEach(function (oItem) {
				if(oItem.getContent().length === 3) {
					oItem.removeContent(2);
				}
			});

			// show semantics in result popover
			oTitle.setText(sMessage);
			if (bStatus !== undefined) {
				if (bStatus) {
					oTitle.$().css("color", "#007833");
					oProgress.setState("Success");
					oButton.$("inner").css("background", "#007833");
				} else {
					oTitle.$().css("color", "#cc1919");
					oProgress.setState("Error");
					oButton.$("inner").css("background", "#cc1919");
				}
			} else {
				oTitle.$().css("color", "");
				oProgress.setState("None");
				oButton.$("inner").css("background", "#009de0");
			}
			// allow closing again after 1s
			setTimeout(function () {
				this._oPopover.oPopup.setAutoClose(true);
				this._oPopover.focus();
			}.bind(this), 1000);
		},

		/**** Test runner functions ***/

		// clears the test results for the next run
		reset: function () {
			// clear list
			var oPopover = this.getPopover();
			this.showResult("Validating...");
			if (oPopover && oPopover.getContent()[1]) {
				oPopover.getContent()[0].setState("None");
				oPopover.getContent()[1].removeAllItems();
			}
			this._aAllTests = [];
			this._iTotalCount = 0;
			this._sResult = "";
			if (Opa5.stopQueue) {
				Opa5.stopQueue();
			}

			// locally override this flag as OPA is running 300 seconds in debug mode
			window["sap-ui-debug"] = false;
		},

		// run all tests for the currently selected unit
		runTests: function (sKey) {
			var fnUpdateTestResult = this.updateTestResult.bind(this),
				fnRemoveTestBusy = this.removeTestBusy.bind(this),
				fnRankTest = this.rankTest.bind(this),
				fnShowCode = this.showCode.bind(this),
				fnShowResult = this.showResult.bind(this),
				fnReopenPopover = function () {
					this._oPopover.openBy(this._oValidateButton);
				}.bind(this),
				bSomeTestFailed = false,
				bDebugMode = window["sap-ui-debug"],
				sCookieKey = sKey || this.getUnitCookie() || "";

			this.setUnitCookie(sCookieKey);

			// still old tests running, no further action
			if (!Opa5.stopQueue && this._aAllTests && this._aAllTests.length) {
				return;
			}

			// clear last run
			this.reset();

			// create our own promise-based queue
			var fnProcessAllTests = function () {
				// custom assert object similar to QUnit assert (but way simpler)
				var assert = {
					ok: function (sMessage) {
						if (bSomeTestFailed) {
							return;
						}
						fnRankTest(this.testName, sMessage, true);
						fnUpdateTestResult(this.testName, sMessage,  true);
					},
					notOk: function (sMessage) {
						bSomeTestFailed = true;
						if (Opa5.stopQueue) {
							Opa5.stopQueue();
						}
						fnRankTest(this.testName, sMessage, false);
						fnUpdateTestResult(this.testName, sMessage, false, true);
					},
					strictEqual: function (vValue1, vValue2, sMessage) {
						if (vValue1 === vValue2) {
							if (bSomeTestFailed) {
								return;
							}
							fnRankTest(this.testName, sMessage, true);
							fnUpdateTestResult(this.testName, sMessage, true);
						} else {
							bSomeTestFailed = true;
							if (Opa5.stopQueue) {
								Opa5.stopQueue();
							}
							fnRankTest(this.testName, sMessage, false);
							fnUpdateTestResult(this.testName, sMessage, false, true);
						}
					}
				};

				// store number of tests to execute
				if (!this._iTotalCount) {
					this._iTotalCount = this._aAllTests.length;
				}

				var aTest = this._aAllTests.shift();
				if (aTest) {
					var sTestName = aTest[0],
						fnTest = aTest[1];

					jQuery.sap.log.debug("executing test '" + sTestName + "'");
					this.addTestStatus(sTestName, "Running...");
					this.updateProgress((this._iTotalCount - this._aAllTests.length) * 100 / this._iTotalCount);
					fnTest(assert).done(fnProcessAllTests).fail(function () {
						this._aAllTests = null;
						window["sap-ui-debug"] = bDebugMode;
						fnUpdateTestResult("", "A validation error occured, check the console", false, true);
					}.bind(this));
				} else {
					if (!bSomeTestFailed && this._iTotalCount > 0) {
						fnShowResult("All good!", true);
						if(sCookieKey.search("bonus") > 0 ) {
							fnShowCode();
						}
					} else if (this._iTotalCount > 0) {
						fnShowResult("Failed!", false);
					}
					window["sap-ui-debug"] = bDebugMode;
				}
			}.bind(this);

			// execute the queue after all OpaTest calls are processed
			setTimeout(fnProcessAllTests, 0);

			// create our own opaTest wrapper (instead of QUnit we render the output to the popover directly)
			var opaTest = function (testName, callback) {
				var config = Opa.config;
				Opa.config.timeout = 5;

				var testBody = function (assert) {
					assert.testName = testName;

					callback.call(this, config.arrangements, config.actions, config.assertions, assert);
					fnReopenPopover();

					var promise = Opa.emptyQueue();
					promise.done(function () {
						Opa.assert = undefined;
						Opa5.assert = undefined;
						fnReopenPopover();
						fnRemoveTestBusy(assert.testName);
					});

					promise.fail(function () {
						Opa.assert = undefined;
						Opa5.assert = undefined;
						fnReopenPopover();
						bSomeTestFailed = true;
						fnShowResult("Failed!", false);
						if(sCookieKey.search("opt") > 0 ) {
							fnShowCode();
						}
					});
					return promise;
				}.bind(this);
				this._aAllTests.push([testName, testBody]);
			}.bind(this);

			/********* reuse logic for first two week test cases starts here *********/

			opensap.reuse.onMyApp = {};
			opensap.reuse.onMyApp.goToTab = function (sTabKey) {
				opaTest("Go to tab with key '" + sTabKey +"'", function (Given, When, Then, assert) {
					Then.waitFor({
						controlType: "sap.m.IconTabBar",
						success: function (aIconTabBars) {
							var oIconTabBar = aIconTabBars[0];
							if ((oIconTabBar.getSelectedKey() === sTabKey && oIconTabBar.getExpanded() !== true) || oIconTabBar.getSelectedKey() !== sTabKey) {
								this.waitFor({
									controlType: "sap.m.IconTabFilter",
									matchers: [
										new PropertyStrictEquals({name : "key", value : sTabKey}),
										new Ancestor(oIconTabBar)
									],
									actions: new Press(),
									success: function () {
										assert.ok("Opened the '" + sTabKey + "' tab");
									}, error: function () {
										assert.notOk("Could not press the '" + sTabKey + "' tab");
									}
								});
							} else {
								assert.ok("Is already on the '" + sTabKey + "' tab");
							}
						},
						error: function () {
							assert.notOk("Could not open the '" + sTabKey + "' tab");
						}
					});
				});
			};

			// special case as this one does not have a key in the exercises
			opensap.reuse.onMyApp.goToStartTab = function () {
				opaTest("Go to tab with id 'start'", function (Given, When, Then, assert) {
					Then.waitFor({
						controlType: "sap.ui.core.mvc.View",
						success: function (aViews) {
							var oView = aViews[0];

							Then.waitFor({
								controlType: "sap.m.IconTabBar",
								success: function (aIconTabBars) {
									var oIconTabBar = aIconTabBars[0],
										oIconTabFilter = oView.byId("start");

									assert.ok("Found an sap.m.IconTabBar");

									if (oIconTabFilter) {
										assert.ok("Found IconTabFilter with the id 'start'");
									} else {
										assert.notOk("Did not find IconTabFilter with the id 'start'");
									}

									if (
										oIconTabFilter.getKey() === "start" && ((oIconTabBar.getSelectedKey() === "start" && oIconTabBar.getExpanded() !== true) || oIconTabBar.getSelectedKey() !== "start") ||
										oIconTabFilter.getKey() !== "start" && ((oIconTabBar.getSelectedKey() !== oIconTabFilter.getId() && oIconTabBar.getExpanded() !== true) || oIconTabBar.getSelectedKey() !== oIconTabFilter.getId())
									) {
										this.waitFor({
											controlType: "sap.m.IconTabFilter",
											matchers: [
												new PropertyStrictEquals({
													name: "id",
													value: oIconTabFilter.getId()
												}),
												new Ancestor(oIconTabBar)
											],
											actions: new Press(),
											success: function () {
												assert.ok("Opened 'start' tab");
											},
											error: function () {
												assert.notOk("Could not open 'start' tab");
											}
										});
									}
								},
								error: function () {
									assert.notOk("Did not find an sap.m.IconTabBar");
								}
							});
						},
						error: function () {
							assert.notOk("Did not find a view");
						}
					});
				});
			};

			// special case as this one does not have a key in the exercises
			opensap.reuse.onMyApp.goToLayoutTab = function () {
				opaTest("Go to tab with id 'layouts'", function (Given, When, Then, assert) {
					Then.waitFor({
						controlType: "sap.ui.core.mvc.View",
						success: function (aViews) {
							var oView = aViews[0];

							Then.waitFor({
								controlType: "sap.m.IconTabBar",
								success: function (aIconTabBars) {
									var oIconTabBar = aIconTabBars[0],
										oIconTabFilter = oView.byId("layouts");

									assert.ok("Found an sap.m.IconTabBar");

									if (oIconTabFilter) {
										assert.ok("Found IconTabFilter with the id 'layout'");
									} else {
										assert.notOk("Did not find IconTabFilter with the id 'layout'");
									}

									if (
										oIconTabFilter.getKey() === "layouts" && ((oIconTabBar.getSelectedKey() === "layouts" && oIconTabBar.getExpanded() !== true) || oIconTabBar.getSelectedKey() !== "layouts") ||
										oIconTabFilter.getKey() !== "layouts" && ((oIconTabBar.getSelectedKey() !== oIconTabFilter.getId() && oIconTabBar.getExpanded() !== true) || oIconTabBar.getSelectedKey() !== oIconTabFilter.getId())
									) {
										this.waitFor({
											controlType: "sap.m.IconTabFilter",
											matchers: [
												new PropertyStrictEquals({
													name: "id",
													value: oIconTabFilter.getId()
												}),
												new Ancestor(oIconTabBar)
											],
											actions: new Press(),
											success: function () {
												assert.ok("Opened 'layouts' tab");
											},
											error: function () {
												assert.notOk("Could not open 'layouts' tab");
											}
										});
									} else {
										assert.ok("Opened 'layouts' tab");
									}
								},
								error: function () {
									assert.notOk("Did not find an sap.m.IconTabBar");
								}
							});
						},
						error: function () {
							assert.notOk("Did not find a view");
						}
					});
				});
			};

			opensap.reuse.onMyApp.checkDataBindingTable = function () {
				opaTest("Find a list inside the 'db' tab", function (Given, When, Then, assert) {
					// Assertions (check if there is a list inside the filter)
					Then.waitFor({
						controlType: "sap.m.IconTabFilter",
						matchers : new PropertyStrictEquals({name : "key", value : "db"}),
						success: function (aFilters) {
							var oFilter = aFilters[0];

							this.waitFor({
								controlType : "sap.m.List",
								matchers: new Ancestor(oFilter),
								success: function () {
									assert.ok("Found a sap.m.List inside the IconTabFilter");
								},
								error: function () {
									assert.notOk("Did not find the list");
								}
							});
						},
						error: function () {
							assert.notOk("Did not find the IconTabFilter");
						}
					});
				});

				opaTest("Check that the list of products is not empty", function (Given, When, Then, assert) {
					Then.waitFor({
						controlType: "sap.m.IconTabFilter",
						matchers : new PropertyStrictEquals({name : "key", value : "db"}),
						success: function (aFilters) {
							var oFilter = aFilters[0];

							this.waitFor({
								controlType : "sap.m.List",
								matchers: [
									new AggregationFilled({name: "items"}),
									new Ancestor(oFilter)
								],
								success: function () {
									assert.ok("The list is not empty");
								},
								error: function () {
									assert.notOk("The list is empty");
								}
							});
						},
						error: function () {
							assert.notOk("Did not find the IconTabFilter");
						}
					});

				});
			};

			/********* reuse logic for last two week test cases starts here *********/

			opensap.reuse.onAnyPage = {};
			opensap.reuse.onAnyPage.goToWorklist = function () {
				opaTest("Go to the 'worklist' page", function (Given, When, Then, assert) {
					When.waitFor({
						controlType: "sap.m.Page",
						actions: function (oPage) {
							if (oPage.$().find("button").length) {
								jQuery(oPage.$().find("button")[0]).trigger("tap");
							} else if (oPage.$().find("a").length) {
								oPage.$().find("a").control(0).firePress();
							}
						},
						success: function () {
							assert.ok("Went back to the 'worklist' page");
						},
						error: function () {
							assert.notOk("Is already on the 'worklist' page or did not find the page");
						}
					});
				});
			};

			opensap.reuse.onAnyPage.goToNthProduct = function (iWhich) {
				var sId = "";

				opaTest("Find the binding path of product '" + iWhich + "' in the table", function (Given, When, Then, assert) {
					When.waitFor({
						controlType: "sap.m.Page",
						actions: function (oPage) {
							if (oPage.$().find("button").length) {
								jQuery(oPage.$().find("button")[0]).trigger("tap");
							} else if (oPage.$().find("a").length) {
								oPage.$().find("a").control(0).firePress();
							}
						},
						success: function () {
							assert.ok("Went back to the 'worklist' page");
						},
						error: function () {
							assert.notOk("Is already on the 'worklist' page or did not find the page");
						}
					});

					When.waitFor({
						controlType: "sap.m.ColumnListItem",
						success: function (aListItems) {
							var oItem;

							if (aListItems.length >= iWhich) {
								oItem = aListItems[iWhich - 1];
								sId = oItem.getBindingContext().getObject().ProductID;
							} else {
								assert.notOk("The table has less than '" + iWhich + "' items");
							}
							assert.ok("The product '" + iWhich + "' has binding path '" + sId + "'");
						},
						error: function () {
							assert.notOk("Could not find the product '" + iWhich + "'");
						}
					});
				});

				opaTest("Go to product with the id '" + sId +"'", function (Given, When, Then, assert) {
					When.waitFor({
						controlType: "sap.m.ColumnListItem",
						matchers:  new BindingPath({
							path: "/ProductSet('" + sId + "')"
						}),
						success: function (aListItems) {
							aListItems[0].$().trigger("tap");
							assert.ok("Pressed the product with the id '" + sId + "'");
						},
						error: function () {
							assert.notOk("No product with the id '" + sId + "' was found.");
						}
					});
				});
			};

			opensap.reuse.onAnyPage.setCloseDialogs = function (bValue) {
				opaTest("Set CloseDialogs to false", function (Given, When, Then, assert) {
					// Arrangements
					// Actions
					// Assertions
					Then.waitFor({
						controlType: "sap.m.App",
						success: function (aApps) {
							var oApp = aApps[0],
								oRouter = oApp.getParent().getController().getOwnerComponent().getRouter();

							if (oRouter) {
								oRouter.getTargetHandler().setCloseDialogs(bValue);
								assert.ok("Property set to '" + bValue +"'");
							} else {
								assert.notOk("The router has not been found");
							}
						},
						error: function () {
							assert.notOk("Did not find an sap.m.App");
						}
					});
				});
			};

			opensap.reuse.onTheWorklistPage = {};
			opensap.reuse.onTheWorklistPage.goToTab = function (sTabKey) {
				opaTest("Go to tab with key '" + sTabKey +"'", function (Given, When, Then, assert) {
					Then.waitFor({
						controlType: "sap.m.IconTabBar",
						success: function (aIconTabBars) {
							var oIconTabBar = aIconTabBars[0];
							if ((oIconTabBar.getSelectedKey() === sTabKey && oIconTabBar.getExpanded() !== true) || oIconTabBar.getSelectedKey() !== sTabKey) {
								this.waitFor({
									controlType: "sap.m.IconTabFilter",
									matchers: [
										new PropertyStrictEquals({name : "key", value : sTabKey}),
										new Ancestor(oIconTabBar)
									],
									actions: new Press(),
									success: function () {
										assert.ok("Opened the '" + sTabKey + "' tab");
									}, error: function () {
										assert.notOk("Could not press the '" + sTabKey + "' tab");
									}
								});
							} else {
								assert.ok("Is already on the '" + sTabKey + "' tab");
							}
						},
						error: function () {
							assert.notOk("Could not open the '" + sTabKey + "' tab");
						}
					});
				});
			};

			opensap.reuse.onTheWorklistPage.checkTableHasLessItemsThan = function (sTabKey, iTotal) {
				opaTest("Find a filtered table for the '" + sTabKey + "' tab", function (Given, When, Then, assert) {
					Then.waitFor({
						controlType: "sap.m.IconTabBar",
						success: function (aIconTabBars) {
							var oIconTabBar = aIconTabBars[0];

							this.waitFor({
								controlType: "sap.m.Table",
								matchers: [
									new AggregationFilled({name: "items"}),
									new Ancestor(oIconTabBar)
								],
								success: function (aTables) {
									var oTable = aTables[0];

									assert.ok("Found a sap.m.Table inside the IconTabFilter");
									assert.strictEqual(oTable.getBinding("items").aFilters.length, 1, "The 'items' binding is filtered");

									if (oTable.getBinding("items").getLength() < iTotal) {
										assert.ok("The table has less items than originally displayed");
									}  else {
										assert.notOk("The table has the same number of items than originally displayed");
									}
								},
								error: function () {
									assert.notOk("Did not find the table");
								}
							});
						},
						error: function () {
							assert.notOk("Did not find the IconTabBar");
						}
					});
				});
			};

			opensap.reuse.onTheWorklistPage.checkFilterCountIsLessThan = function (sTabKey, iTotal) {
				opaTest("Check the count for the '" + sTabKey + "' filter", function (Given, When, Then, assert) {
					Then.waitFor({
						controlType: "sap.m.IconTabFilter",
						matchers : [
							new PropertyStrictEquals({name : "key", value : sTabKey})
						],
						success: function (aIconTabFilters) {
							var oIconTabFilter = aIconTabFilters[0];
							if (oIconTabFilter.getCount() === "") {
								assert.notOk("The count for the filter is not set");
							} else if (oIconTabFilter.getCount() < iTotal) {
								assert.ok("The count for the filter is less than all items");
							} else {
								assert.notOk("The count for the filter is not set correctly");
							}
						},
						error: function () {
							assert.notOk("Could not check the count of the '" + sTabKey + "' tab");
						}
					});
				});
			};
			/********* test cases start here *********/
			var oTests = {

				/*** week 1 tests ***/

				"w1u1": function () {
					opaTest("SAPUI5 is loaded", function (Given, When, Then, assert) {
						assert.ok("ok");
					});
				},
				"w1u2": function () {
					opaTest("Find a Carousel control", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.Carousel",
							success: function () {
								assert.ok("ok");
							},
							error: function () {
								assert.notOk("Could not find a carousel");
							}
						});
					});

					opaTest("Find two Images inside the carousel", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.Carousel",
							success: function (aCarousels) {
								var oCarousel = aCarousels[0];

								this.waitFor({
									controlType: "sap.m.Image",
									matchers: new Ancestor(oCarousel),
									success: function (aImages) {
										if (aImages.length >= 2) {
											assert.ok("2 Images found");
										} else {
											assert.notOk("Less than 2 Images");
										}
									},
									error: function () {
										assert.notOk("Did not find 2 Images");
									}
								});
							},
							error: function () {
								assert.notOk("Could not find a carousel");
							}
						});
					});
				},
				"w1u3": function () {
					opaTest("Find a Button control", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Button",
							success: function (aButtons) {
								var oButton = aButtons[0];

								if (oButton && oButton.getId() === "validate") {
									oButton = aButtons[1];

									this.waitFor({
										controlType: "sap.m.Button",
										id: oButton.getId(),
										actions: new Press(),
										success: function () {
											assert.ok("Button was pressed");
										},
										error: function () {
											assert.notOk("Button could not be pressed");
										}
									});
								} else {
									assert.notOk("Could not find a button");
								}

							},
							error: function () {
								assert.notOk("Could not find a button");
							}
						});

						Then.waitFor({
							check: function () {
								return !!$(".sapMMessageToast").length;
							},
							success: function () {
								assert.ok("MessageToast is displayed");
							},
							error: function () {
								assert.notOk("Could not find a MessageToast");
							}
						});
					});
				},
				"w1u4": function () {
					opaTest("Find a Component", function (Given, When, Then, assert) {
						Given.waitFor({
							controlType: "sap.ui.core.mvc.View",
							success: function (aViews) {
								var oView = aViews[0];

								if (oView.getController().getOwnerComponent()) {
									assert.ok("Found a Component");
								} else {
									assert.notOk("Did not find a Component");
								}
							},
							error: function () {
								assert.notOk("Did not find a View");
							}
						});
					});

					opaTest("Find an App Descriptor", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.ui.core.mvc.View",
							success: function (aViews) {
								var oView = aViews[0];

								if (oView.getController().getOwnerComponent().getManifest()) {
									assert.ok("Found a Manifest");
								} else {
									assert.notOk("Did not find a Manifest");
								}

								if (oView.getController().getOwnerComponent().getManifestEntry("sap.app").id) {
									assert.ok("Found the id 'opensap.myapp' in the manifest");
								} else {
									assert.notOk("Did not find the 'opensap.myapp' in the manifest");
								}
							},
							error: function () {
								assert.notOk("Did not find a View");
							}
						});
					});
				},
				"w1u5": function () {
					opaTest("Read from the 'helloPanel' model", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.ui.core.mvc.View",
							success: function (aViews) {
								var oView = aViews[0];

								if (oView.getModel("helloPanel")) {
									assert.ok("Found the 'i18n' model");
								} else {
									assert.notOk("Did not find the 'i18n' model");
								}
								if (oView.getModel("helloPanel").getProperty("/recipient/name").length) {
									assert.ok("Found the '/recipient/name' property in the 'helloPanel' model");
								} else {
									assert.notOk("Did not find the '/recipient/name' property in the 'helloPanel' model");
								}
							},
							error: function () {
								assert.notOk("Did not find a View");
							}
						});
					});

					opaTest("Read from the 'i18n' model", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.ui.core.mvc.View",
							success: function (aViews) {
								var oView = aViews[0];

								if (oView.getModel("i18n")) {
									assert.ok("Found the 'i18n' model");
								}
								if (oView.getModel("i18n").getResourceBundle().getText("helloMsg").length) {
									assert.ok("Found the 'helloMsg' property in the 'i18n' model");
								} else {
									assert.notOk("Did not find the 'helloMsg' property in the 'i18n' model");
								}
							},
							error: function () {
								assert.notOk("Did not find a View");
							}
						});
					});
				},
				"w1u6": function () {
					opaTest("Find a Page in an App", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.App",
							success: function (aApps) {
								var oApp = aApps[0];
								assert.ok("Found an sap.m.App");

								this.waitFor({
									controlType: "sap.m.Page",
									matchers: [
										new Ancestor(oApp)
									],
									success: function () {
										assert.ok("Found a sap.m.Page inside the App");
									},
									error: function () {
										assert.notOk("Did not find a sap.m.Page inside the App");
									}
								});

							},
							error: function () {
								assert.notOk("Did not find an sap.m.App");
							}
						});
					});

					opaTest("Find an IconTabBar", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.IconTabBar",
							success: function (aIconTabBars) {
								var oIconTabBar = aIconTabBars[0];
								assert.ok("Found an sap.m.IconTabBar");

								this.waitFor({
									controlType: "sap.m.IconTabFilter",
									matchers: [
										new Ancestor(oIconTabBar)
									],
									success: function (aFilters) {
										var oIconTabBar = aFilters[0].getParent().getParent();
										if (oIconTabBar.aCustomStyleClasses && oIconTabBar.aCustomStyleClasses[0].search("sapUiResponsiveContentPadding") >= 0) {
											assert.ok("IconTabBar has class 'sapUiResponsiveContentPadding'");
										} else {
											assert.notOk("IconTabBar does not have class 'sapUiResponsiveContentPadding'");
										}

										if (aFilters.length >= 2) {
											assert.ok("There are two tabs inside the IconTabBar");
										} else {
											assert.notOk("There are less than two tabs inside the IconTabBar");
										}
									},
									error: function () {
										assert.notOk("Did not find a sap.m.IconTabFilter");
									}
								});

							},
							error: function () {
								assert.notOk("Did not find an sap.m.IconTabBar");
							}
						});
					});

					opensap.reuse.onMyApp.goToLayoutTab();

					opaTest("Find a SimpleForm", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.IconTabBar",
							success: function (aIconTabBars) {
								var oIconTabBar = aIconTabBars[0];

								assert.ok("Found an sap.m.IconTabBar");
								this.waitFor({
									controlType: "sap.ui.layout.form.SimpleForm",
									matchers: [
										new PropertyStrictEquals({name: "title", value: "Address"}),
										new Ancestor(oIconTabBar)
									],
									success: function () {
										assert.ok("Found a SimpleForm with the title 'Address'");
									},
									error: function () {
										assert.notOk("Could not find a SimpleForm with the title 'Address'");
									}
								});
							},
							error: function () {
								assert.notOk("Did not find an sap.m.IconTabBar");
							}
						});
					});

					opaTest("Read from the 'address' model", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.ui.core.mvc.View",
							success: function (aViews) {
								var oView = aViews[0];

								if (oView.getModel("address")) {
									assert.ok("Found the 'address' model");
								}
								if (oView.getModel("address").getProperty("/Name").length) {
									assert.ok("Found the '/Name' property in the 'address' model");
								} else {
									assert.notOk("Did not find the '/Name' property in the 'address' model");
								}
							},
							error: function () {
								assert.notOk("Did not find a View");
							}
						});
					});

					opaTest("Find a Toolbar", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.ui.core.mvc.View",
							success: function (aViews) {
								var oView = aViews[0];

								Then.waitFor({
									controlType: "sap.m.IconTabBar",
									success: function (aIconTabBars) {
										var oIconTabBar = aIconTabBars[0],
											oIconTabFilter = oView.byId("layouts");

										assert.ok("Found an sap.m.IconTabBar");

										if (oIconTabFilter) {
											assert.ok("Found IconTabFilter with the id 'layout'");
										} else {
											assert.notOk("Did not find IconTabFilter with the id 'layout'");
										}

										if ((oIconTabBar.getSelectedKey() !== oIconTabFilter.getId() && oIconTabBar.getExpanded() !== true) || oIconTabBar.getSelectedKey() !== oIconTabFilter.getId()) {
											this.waitFor({
												controlType: "sap.m.IconTabFilter",
												matchers: [
													new PropertyStrictEquals({
														name: "id",
														value: oIconTabFilter.getId()
													}),
													new Ancestor(oIconTabBar)
												],
												actions: new Press(),
												success: function () {
													assert.ok("Opened 'layouts' tab");
												},
												error: function () {
													assert.notOk("Could not open 'layouts' tab");
												}
											});
										}

										this.waitFor({
											controlType: "sap.m.Toolbar",
											success: function (aToolbars) {
												var oToolbar = aToolbars[0];

												assert.ok("Found a toolbar");

												this.waitFor({
													controlType: "sap.m.Button",
													matchers: new Ancestor(oToolbar),
													success: function (aButtons) {
														assert.strictEqual(aButtons.length, 2, "2 Buttons found inside the toolbar");
													},
													error: function () {
														assert.notOk("Did not find 2 Buttons inside the toolbar");
													}
												});
											}
										});
									},
									error: function () {
										assert.notOk("Did not find an sap.m.IconTabBar");
									}
								});
							},
							error: function () {
								assert.notOk("Did not find a View");
							}
						});
					});
				},

				/*** week 2 tests ***/

				"w2u1": function () {
					opensap.reuse.onMyApp.goToTab("db");
					opensap.reuse.onMyApp.checkDataBindingTable();
				},
				"w2u2": function () {
					opensap.reuse.onMyApp.goToTab("db");
					opensap.reuse.onMyApp.checkDataBindingTable();

					opaTest("Find the number unit", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.ObjectListItem",
							matcher: function (oItem) {
								return oItem.getNumberUnit().length > 0;
							},
							success: function () {
								assert.ok("The number unit is set");
							},
							error: function () {
								assert.notOk("The number unit is not set");
							}
						});
					});

					opaTest("Check the price expression", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.ObjectListItem",
							success: function (aItems) {
								aItems.forEach(function (oItem) {
									if (oItem.getBindingContext().getObject().Price > 500 && oItem.getNumberState() === "Error" || oItem.getNumberState() === "Success") {
										assert.ok("The price '" + oItem.getBindingContext().getObject().Price + "' has status '" + oItem.getNumberState() + "'");
									} else {
										assert.notOk("The price '" + oItem.getBindingContext().getObject().Price + "' has status '" + oItem.getNumberState() + "'");
									}
								});
							},
							error: function () {
								assert.notOk("No items found in the list");
							}
						});
					});

					opaTest("Find the delivery status", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.ObjectStatus",
							success: function (aStatuses) {
								var oStatus = aStatuses[0];

								assert.ok("There is an ObjectStatus on the detail page");
								if (oStatus.getText().search("deliver via") >= 0) {
									assert.ok("The status contains the delivery information");
								} else {
									assert.notOk("The status does not contain the delivery information");
								}
							},
							error: function () {
								assert.notOk("There is no ObjectStatus on the detail page");
							}
						});
					});

					opaTest("Check the delivery formatter logic", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.ui.core.mvc.View",
							success: function (aViews) {
								var oView = aViews[0],
									fnFormatter = oView.getController().formatter.delivery,
									fnIsolatedFormatter = fnFormatter.bind(oView.getController());

								if (fnFormatter) {
									assert.ok("Found a formatter with the name 'delivery'");

									assert.strictEqual(fnIsolatedFormatter("KG", 0.2), "deliver via mail", "A weight of 0.2kg will convert to the mail delivery method");
									assert.strictEqual(fnIsolatedFormatter("G", 200), "deliver via mail", "A weight of 200g will convert to the mail delivery method");
									assert.strictEqual(fnIsolatedFormatter("G", -11), "deliver via mail", "A weight of -11kg will convert to the mail delivery method");
									assert.ok("Mail delivery formatter logic works fine");

									assert.strictEqual(fnIsolatedFormatter("G", 500), "deliver via parcel", "A weight of 500g will convert to the parcel delivery method");
									assert.strictEqual(fnIsolatedFormatter("KG", 3), "deliver via parcel", "A weight of 3kg will convert to the parcel delivery method");
									assert.ok("Parcel delivery formatter logic works fine");

									assert.strictEqual(fnIsolatedFormatter("KG", 23), "deliver via carrier", "A weight of 23kg will convert to the carrier delivery method");
									assert.strictEqual(fnIsolatedFormatter("KG", 5), "deliver via carrier", "A weight of 5kg will convert to the carrier delivery method");
									assert.strictEqual(fnIsolatedFormatter("foo", "bar"), "deliver via carrier", "Invalid values will convert to the carrier delivery method");
									assert.ok("Carrier delivery formatter logic works fine");
								} else {
									assert.notOk("Did not find a formatter with the name 'delivery'");
								}
							},
							error: function () {
								assert.notOk("Could not find the 'Object' view");
							}
						});
					});
				},
				"w2u3": function () {
					opensap.reuse.onMyApp.goToTab("db");
					opensap.reuse.onMyApp.checkDataBindingTable();

					opaTest("Check the currency format", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.ObjectListItem",
							success: function (aObjectListItems) {
								var oObjectListItem = aObjectListItems[0];

								if (oObjectListItem.getNumber()) {
									assert.ok("The number is set to '" + oObjectListItem.getNumber() + "' for the product '" + oObjectListItem.getTitle() + "'");
								} else {
									assert.notOk("The number is not set for the product '" + oObjectListItem.getTitle() + "'");
								}

								if (oObjectListItem.getNumberUnit()) {
									assert.ok("The numberUnit is set to '" + oObjectListItem.getNumberUnit() + "' for the product '" + oObjectListItem.getTitle() + "'");
								} else {
									assert.notOk("The numberUnit is not set for the product '" + oObjectListItem.getTitle() + "'");
								}

								if (oObjectListItem.getBinding("number") && oObjectListItem.getBinding("number").getType()) {
									assert.ok("The number is formatted with a type");
								} else {
									assert.notOk("The number is not formatted with a type");
								}

								if (oObjectListItem.getBinding("number").getType().getName() === "Currency") {
									assert.ok("The number is formatted with type 'Currency'");
								} else {
									assert.notOk("The number is not formatted with type 'Currency'");
								}

								if (oObjectListItem.getBinding("number").getType().oFormatOptions.showMeasure === false) {
									assert.ok("The format option 'showMeasure' is set to 'false' for the 'Currency' type");
								} else {
									assert.notOk("The format option 'showMeasure' is not set to 'false' for the 'Currency' type");
								}

							},
							error: function () {
								assert.notOk("There is no ObjectListItem on the detail page");
							}
						});
					});

					opaTest("Check if validation is turned on in the App Descriptor", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.ui.core.mvc.View",
							success: function (aViews) {
								var oView = aViews[0];

								if (oView.getController().getOwnerComponent().getManifest()) {
									assert.ok("Found a Manifest");
								} else {
									assert.notOk("Did not find a Manifest");
								}

								if (oView.getController().getOwnerComponent().getManifestEntry("sap.ui5").handleValidation === true) {
									assert.ok("The parameter 'handleValidation' is set to 'true' in the manifest");
								} else {
									assert.notOk("The parameter 'handleValidation' is not set to 'true' in the manifest");
								}
							},
							error: function () {
								assert.notOk("Did not find a View");
							}
						});
					});

					opensap.reuse.onMyApp.goToStartTab();

					opaTest("Check the input value type", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Input",
							success: function (aInputs) {
								var oInput = aInputs[0];

								if (oInput.getBinding("value") && oInput.getBinding("value").getType()) {
									assert.ok("The input value is formatted with a type");
								} else {
									assert.notOk("The input value is not formatted with a type");
								}

								if (oInput.getBinding("value").getType().getName() === "Float") {
									assert.ok("The input value is formatted with type 'Float'");
								} else {
									assert.notOk("The input value is not formatted with type 'Float'");
								}

								if (oInput.getBinding("value").getType().oFormatOptions.minFractionDigits === 2) {
									assert.ok("The format option 'minFractionDigits' is set to '2' for the 'Float' type");
								} else {
									assert.notOk("The format option 'minFractionDigits' is not set to '2' for the 'Float' type");
								}

								if (oInput.getBinding("value").getType().oConstraints.maximum === 3000) {
									assert.ok("The type constraint 'maximum' is set to '3000' for the 'Float' type");
								} else {
									assert.notOk("The type constraint 'maximum' is not set to '3000' for the 'Float' type");
								}

								this.waitFor({
									controlType: "sap.m.Input",
									actions: new EnterText({
										text: "4"
									}),
									success: function () {
										this.waitFor({
											controlType: "sap.m.Input",
											matchers: function (oInput) {
												return (oInput.getValue() === "4.00" || oInput.getValue() === "4,00");
											},
											success: function () {
												assert.ok("The input value is formatted to a float value after entering '4' as a value");
											},
											error: function () {
												assert.notOk("The input value is not formatted to a float value after entering '4' as a value");
											}
										});
									},
									error: function () {
										assert.notOk("Could not enter text into the input field");
									}
								});

								this.waitFor({
									controlType: "sap.m.Input",
									actions: new EnterText({
										text: "abc"
									}),
									success: function () {
										this.waitFor({
											controlType: "sap.m.Input",
											matchers: function (oInput) {
												return (oInput.getValueState() === "Error");
											},
											success: function () {
												assert.ok("The input is in state 'Error' after entering a string value");
											},
											error: function () {
												assert.notOk("The input is not in state 'Error' after entering a string value");
											}
										});
									},
									error: function () {
										assert.notOk("Could not enter text into the input field");
									}
								});
							},
							error: function () {
								assert.notOk("There is no input control on the 'start' tab");
							}
						});
					});
				},
				"w2u4": function () {
					var iOriginalLength = 999;

					opensap.reuse.onMyApp.goToTab("db");
					opensap.reuse.onMyApp.checkDataBindingTable();

					opaTest("Check the search field", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.IconTabFilter",
							matchers : new PropertyStrictEquals({name : "key", value : "db"}),
							success: function (aFilters) {
								var oFilter = aFilters[0];

								this.waitFor({
									controlType: "sap.m.List",
									matchers: new Ancestor(oFilter),
									success: function (aLists) {
										var oList = aLists[0];

										this.waitFor({
											controlType: "sap.m.Toolbar",
											matchers: new Ancestor(oList),
											success: function (aToolbars) {
												var oToolbar = aToolbars[0];

												assert.ok("Found a sap.m.Toolbar inside the list");
												this.waitFor({
													controlType: "sap.m.SearchField",
													matchers: new Ancestor(oToolbar),
													success: function () {
														assert.ok("Found a sap.m.SearchField inside the toolbar");
													},
													error: function () {
														assert.notOk("Did not find a sap.m.SearchField inside the toolbar");
													}
												});
											},
											error: function () {
												assert.notOk("Did not find a sap.m.Toolbar inside the list");
											}
										});
									},
									error: function () {
										assert.notOk("Did not find the list");
									}
								});
							},
							error: function () {
								assert.notOk("Did not find the IconTabFilter");
							}
						});

						opaTest("Submit a search", function (Given, When, Then, assert) {
							Then.waitFor({
								controlType: "sap.m.SearchField",
								actions: [
									new EnterText({
										text: ""
									}),
									new Press()
								],
								success: function () {
									this.waitFor({
										controlType: "sap.m.IconTabFilter",
										matchers: new PropertyStrictEquals({name: "key", value: "db"}),
										success: function (aFilters) {
											var oFilter = aFilters[0];

											this.waitFor({
												controlType: "sap.m.List",
												matchers: new Ancestor(oFilter),
												success: function (aLists) {
													var oList = aLists[0];
													iOriginalLength = oList.getItems().length;

													assert.ok("The list has '" + iOriginalLength + "' items when resetting the search");
												},
												error: function () {
													assert.notOk("Did not find the list");
												}
											});
										},
										error: function () {
											assert.notOk("Did not find the IconTabFilter");
										}
									});
								},
								error: function () {
									assert.notOk("Did not find a sap.m.SearchField inside the toolbar");
								}
							});

							Then.waitFor({
								controlType: "sap.m.SearchField",
								actions: [
									new EnterText({
										text: "100"
									}),
									new Press()
								],
								success: function () {
									this.waitFor({
										controlType: "sap.m.IconTabFilter",
										matchers: new PropertyStrictEquals({name: "key", value: "db"}),
										success: function (aFilters) {
											var oFilter = aFilters[0];

											this.waitFor({
												controlType: "sap.m.List",
												matchers: new Ancestor(oFilter),
												success: function (aLists) {
													var oList = aLists[0];

													if (iOriginalLength > oList.getItems().length) {
														assert.ok("The list has less than '" + iOriginalLength + "' items when searching for 'o'");
													} else {
														assert.notOk("The list does not have less than '" + iOriginalLength + "' items when searching for 'o'");
													}
												},
												error: function () {
													assert.notOk("Did not find the list");
												}
											});
										},
										error: function () {
											assert.notOk("Did not find the IconTabFilter");
										}
									});
								},
								error: function () {
									assert.notOk("Did not find a sap.m.SearchField inside the toolbar");
								}
							});
						});


						opaTest("Reset the search", function (Given, When, Then, assert) {
							Then.waitFor({
								controlType: "sap.m.SearchField",
								actions: [
									new EnterText({
										text: ""
									}),
									new Press()
								],
								success: function () {
									assert.ok("The search is reset");
								},
								error: function () {
									assert.notOk("Could not reset the search");
								}
							});
						});

						opaTest("Check the sorter", function (Given, When, Then, assert) {
							Then.waitFor({
								controlType: "sap.m.IconTabFilter",
								matchers : new PropertyStrictEquals({name : "key", value : "db"}),
								success: function (aFilters) {
									var oFilter = aFilters[0];

									this.waitFor({
										controlType: "sap.m.List",
										matchers: new Ancestor(oFilter),
										success: function (aLists) {
											var oList = aLists[0],
												oSorter;

											assert.ok("Found a sap.m.List inside the IconTabFilter");
											assert.strictEqual(oList.getBinding("items").aSorters.length, 1, "The 'items' binding is sorted");
											oSorter = oList.getBinding("items").aSorters[0];
											assert.strictEqual(oSorter.sPath, "Category", "The path of the sorter is 'Category'");
											assert.strictEqual(oSorter.vGroup, true, "Grouping is turned on for the sorter");
										},
										error: function () {
											assert.notOk("Did not find the list");
										}
									});
								},
								error: function () {
									assert.notOk("Did not find the IconTabFilter");
								}
							});
						});
					});
				},
				"w2u5": function () {
					opensap.reuse.onMyApp.goToTab("db");
					opensap.reuse.onMyApp.checkDataBindingTable();

					opaTest("Paging is active on the table", function (Given, When, Then, assert) {
					// Actions (click on db tab)
						Then.waitFor({
							controlType: 'sap.m.List',
							success : function (oLists) {
								//first list seems to be something different
								var oList = oLists[1];
								if (oList.getGrowing() && !oList.getGrowingScrollToLoad()) {
									assert.ok("Paging on the List is enabled");
								} else {
									assert.notOk("The growing feature is not enabled on the list");
								}
							},
							error: function () {
								assert.notOk("The growing feature is not enabled on the list");
							}
						});
					});
					opaTest("A click on an item triggers the panel", function (Given, When, Then, assert){
						var oItem;
						Then.waitFor({
							controlType: "sap.m.ObjectListItem",
							success: function (aListItems) {
								oItem = aListItems[0];
								oItem.$().trigger("tap");
								return this.waitFor({
									controlType: "sap.m.Panel",
									success: function(){
										assert.ok("Panel found in the view");
									},
									error: function() {
										assert.notOk("Could not detect a panel in the view");
									}
								});
							},
							error: function () {
								assert.notOk("Could not find list items");
							}
						});
					});
					opaTest("The panel contains a grid with data", function (Given, When, Then, assert){
						Then.waitFor({
							controlType:"sap.ui.layout.Grid",
							success: function (aGrids){
								var oGrid = aGrids[0];

								assert.ok("Found the Grid in the panel");
								return this.waitFor({
									controlType: "sap.m.Text",
									matchers : [
										new Ancestor(oGrid)
									],
									success: function(aTexts){
										if (aTexts[0].getText()){
											assert.ok("The panel contains data");
										} else {
											assert.notOk("(At least) The first field in the panel does not contain any data");
										}
									},
									error: function (){
										assert.notOk("Did not find any text fields in the Grid");
									}

								});
							},
							error : function () {
								assert.notOk("Could not detect Grid in the panel");
							}
						});
					});
					},
				"w2u6": function () {
					opensap.reuse.onMyApp.goToTab("db");
					opensap.reuse.onMyApp.checkDataBindingTable();

					opaTest("Find the supplier expand", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.IconTabFilter",
							matchers: new PropertyStrictEquals({name: "key", value: "db"}),
							success: function (aFilters) {
								var oFilter = aFilters[0];

								this.waitFor({
									controlType: "sap.m.List",
									matchers: new Ancestor(oFilter),
									success: function (aLists) {
										var oList = aLists[0];

										assert.ok("Found a sap.m.List inside the IconTabFilter");

										if (oList.getBinding("items").mParameters) {
											assert.strictEqual(oList.getBinding("items").mParameters.expand, 'ToSupplier', "The 'items' binding is expanded with the navigation property 'ToSupplier'");
										} else {
											assert.notOk("The 'items' binding is not expanded");
										}

									},
									error: function () {
										assert.notOk("Did not find the list");
									}
								});
							},
							error: function () {
								assert.notOk("Did not find the IconTabFilter");
							}
						});
					});

					opaTest("Find the supplier status", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.ObjectStatus",
							success: function (aStatuses) {
								var oStatus = aStatuses[1];

								assert.ok("There is an ObjectStatus on the 'db' tab");
								if (oStatus.getTitle().search("From") >= 0) {
									assert.ok("The status title contains the 'From' information");
								} else {
									assert.notOk("The status title does not contains the 'From' information");
								}
								if (oStatus.getText().length > 0) {
									assert.ok("The status text contains the 'Supplier' information");
								}
								// no else as this does not work with generated mock data
							},
							error: function () {
								assert.notOk("There is no ObjectStatus on the 'db' tab");
							}
						});
					});

					opaTest("Check if batch is disabled", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.ui.core.mvc.View",
							success: function (aViews) {
								var oView = aViews[0];

								assert.strictEqual(oView.getModel().bUseBatch, false, "Batch grouping on the default model has been disabled for debugging purposes");
							},
							error: function () {
								assert.notOk("Did not find the view");
							}
						});
					});

				},
				"w2u7bonus": function () {
					opensap.reuse.onMyApp.goToLayoutTab();

					opaTest("Find the location panel", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.IconTabBar",
							success: function (aIconTabBars) {
								var oIconTabBar = aIconTabBars[0];

								assert.ok("Found an sap.m.IconTabBar");
								this.waitFor({
									controlType: "sap.m.Panel",
									matchers: [
										new PropertyStrictEquals({name: "headerText", value: "Location"}),
										new Ancestor(oIconTabBar)
									],
									success: function () {
										assert.ok("Found a panel with the title 'Location'");
									},
									error: function () {
										assert.notOk("Could not find a panel with the title 'Location'");
									}
								});
							},
							error: function () {
								assert.notOk("Did not find an sap.m.IconTabBar");
							}
						});
					});

					opaTest("Find an image in the panel", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.Panel",
							matchers: [
								new PropertyStrictEquals({name: "headerText", value: "Location"})
							],
							success: function (aPanels) {
								var oPanel = aPanels[0];

								assert.ok("Found a panel with the title 'Location'");

								this.waitFor({
									controlType: "sap.m.Image",
									matchers: new Ancestor(oPanel),
									success: function (aImages) {
										var oImage = aImages[0];

										assert.ok("Location image found");

										if (oImage.getSrc().search("maps.googleapis.com/maps/api/staticmap") >= 0) {
											assert.ok("Image URL contains the 'staticmap' API");
										} else {
											assert.notOk("Image URL does not contain the 'staticmap' API");
										}

										if (oImage.getSrc().search("&markers") >= 0) {
											assert.ok("Image URL contains the 'markers' parameter");
										} else {
											assert.notOk("Image URL does not contain the 'markers' parameter");
										}
									},
									error: function () {
										assert.notOk("Did not find an image");
									}
								});
							},
							error: function () {
								assert.notOk("Could not find a panel with the title 'Location'");
							}
						});
					});

					opaTest("Check the location formatter", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.ui.core.mvc.View",
							success: function (aViews) {
								var oView = aViews[0],
									fnFormatter = oView.getController().formatter.formatMapUrl;

								if (fnFormatter) {
									assert.ok("Found a formatter with the name 'formatMapUrl'");
								} else {
									assert.notOk("Did not find a formatter with the name 'formatMapUrl'");
								}

								if (fnFormatter) {
									this.waitFor({
										controlType: "sap.m.Image",
										success: function (aImages) {
											var oImage = aImages[0],
												sResult;

											sResult = fnFormatter.apply(oImage, ["Address", "can", "be", "in", "any", "format"]);

											if (sResult.search("maps.googleapis.com/maps/api/staticmap") >= 0) {
												assert.ok("Image URL contains the 'staticmap' API");
											} else {
												assert.notOk("Image URL does not contain the 'staticmap' API");
											}

											if (sResult.search("&markers") >= 0) {
												assert.ok("Image URL contains the 'markers' parameter");
											} else {
												assert.notOk("Image URL does not contain the 'markers' parameter");
											}

											if (sResult.search("Address") >= 0) {
												assert.ok("Image URL contains parts of the address");
											} else {
												assert.notOk("Image URL does not contain parts of the address");
											}
										},
										error: function () {
											assert.notOk("Could not find an image");
										}
									});
								}
							},
							error: function () {
								assert.notOk("Could not find a view");
							}
						});
					});
				},

				/*** week 3 tests ***/

				"w3u1" : function () {
					var sViewNamespace = "opensap.manageproducts.view.",
						sViewName = "Worklist";

					opensap.reuse.onAnyPage.setCloseDialogs(false);
					opensap.reuse.onAnyPage.goToWorklist();

					opaTest("Check the template metadata", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.ui.core.mvc.View",
							success: function (aViews) {
								var oView = aViews[0],
									oComponent,
									fVersion;

								if (oView.getController().getOwnerComponent().getManifest()) {
									assert.ok("Found a Manifest");
								} else {
									assert.notOk("Did not find a Manifest");
								}

								// static checks
								oComponent = oView.getController().getOwnerComponent();
								if (oComponent.getManifestEntry("sap.app").sourceTemplate.id.search("worklist") >= 0) {
									assert.ok("Template is of type 'worklist'");
								} else {
									assert.notOk("Did not find the 'worklist' template");
								}

								// version is not so important and might change, make it a soft check
								if (oComponent.getManifestEntry("sap.app").sourceTemplate.version) {
									assert.ok("Found a template version number");
									fVersion = Number.parseFloat(oComponent.getManifestEntry("sap.app").sourceTemplate.version);
									if (fVersion >= 1.36) {
										assert.ok("Template is of UI5 version 1.36 or higher");
									} else {
										assert.ok("Template is lower than UI5 version 1.36");
									}
								} else {
									assert.ok("Could not find a tempalte version number");
								}

								if (oComponent.getManifestEntry("sap.app").id === "opensap.manageproducts") {
									assert.ok("Found the id 'opensap.manageproducts' in the manifest");
								} else {
									assert.notOk("Did not find the 'opensap.manageproducts' id in the manifest");
								}

								if (oComponent.getManifestEntry("sap.app").dataSources.mainService.uri.search("destinations/ES4") >= 0) {
									assert.ok("Found a destination called 'ES4' in the manifest");
								} else {
									assert.notOk("Could not find a destination called 'ES4' in the manifest");
								}

								if (oComponent.getManifestEntry("sap.app").dataSources.mainService.uri.search("GWSAMPLE_BASIC") >= 0) {
									assert.ok("Found a service called 'GWSAMPLE_BASIC' in the manifest");
								} else {
									assert.notOk("Could not find a service called 'GWSAMPLE_BASIC' in the manifest");
								}
							},
							error: function () {
								assert.notOk("Did not find a View");
							}
						});
					});

					opaTest("Check the worklist table", function (Given, When, Then, assert) {
						Then.waitFor({
							//controlType: "sap.m.Table",
							id: 'table',
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							matchers: [
								new AggregationFilled({name: "items"})
							],
							success: function () {
								assert.ok("Found a sap.m.Table with the id 'table'");
							},
							error: function () {
								assert.notOk("Did not find a sap.m.Table with the id 'table' or the table is empty");
							}
						});
					});

					// navigation
					opensap.reuse.onAnyPage.goToNthProduct(3);
				},
				"w3u2" : function () {
					var sViewNamespace = "opensap.manageproducts.view.",
						sViewName = "Worklist",
						iSupplierColumnIndex = -1,
						iWebColumnIndex = -1;

					opensap.reuse.onAnyPage.setCloseDialogs(false);
					opensap.reuse.onAnyPage.goToWorklist();

					opaTest("Check the table columns", function (Given, When, Then, assert) {
						// click on header here
						Then.waitFor({
							//controlType: "sap.m.Table",
							id: 'table',
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							success: function (aTables) {
								var i,
									oTable = aTables[0],
									aColumns = oTable.getColumns(),
									oSupplierColumn,
									oWebColumn;

								for (i = 0; i < aColumns.length; i++) {
									if (aColumns[i].getId().search("supplier") >= 0) {
										iSupplierColumnIndex = i;
										oSupplierColumn = aColumns[iSupplierColumnIndex];
									}
								}
								for (i = 0; i < aColumns.length; i++) {
									if (aColumns[i].getId().search("web") >= 0) {
										iWebColumnIndex = i;
										oWebColumn = aColumns[iWebColumnIndex];
									}
								}

								if (oSupplierColumn) {
									assert.ok("There is a supplier column");

									assert.strictEqual(oSupplierColumn.getDemandPopin(), true, "The property 'demandPopin' is 'true' for the supplier column");
									assert.strictEqual(oSupplierColumn.getMinScreenWidth().toLowerCase(), "tablet", "The property 'minScreenWidth' is 'Tablet' for the supplier column");

									if (oSupplierColumn.getHeader() instanceof sap.m.Text) {
										assert.ok("There is a 'sap.m.Text' control inside the supplier cell");
										assert.strictEqual(oSupplierColumn.getHeader().getText(), "Supplier", "The supplier column is labeled 'Supplier'");
									} else {
										assert.notOk("There is no 'sap.m.Text' control inside the supplier cell");
									}
								} else {
									assert.notOk("Could not find a supplier column");
								}

								if (oWebColumn) {
									assert.ok("There is a web address column");

									assert.strictEqual(oWebColumn.getDemandPopin(), false, "The property 'demandPopin' is 'false' for the web address column");
									assert.strictEqual(oWebColumn.getMinScreenWidth().toLowerCase(), "tablet", "The property 'minScreenWidth' is 'Tablet' for the web address column");

									if (oWebColumn.getHeader() instanceof sap.m.Text) {
										assert.ok("There is a 'sap.m.Text' control inside the web address cell");
										assert.strictEqual(oWebColumn.getHeader().getText(), "Web Address", "The web address column is labeled 'Supplier'");
									} else {
										assert.notOk("There is no 'sap.m.Text' control inside the web address cell");
									}
								} else {
									assert.notOk("Could not find a web address column");
								}
							},
							error: function () {
								assert.notOk("Did not find any column list items");
							}
						});
					});

					opaTest("Check the table rows", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.ColumnListItem",
							success: function (aColumnListItems) {
								var oColumnListItem = aColumnListItems[0],
									aCells = oColumnListItem.getCells();
								
								if (aCells[iSupplierColumnIndex] instanceof sap.m.Text) {
									assert.ok("The supplier cell is a sap.m.Text control");

									if (aCells[iWebColumnIndex].getBinding("text") && aCells[iSupplierColumnIndex].getBinding("text").getPath() === "SupplierName") {
										assert.ok("The 'text' property of the 'sap.m.Text' control is bound to the path 'SupplierName'");
									} else {
										assert.notOk("The 'text' property of the 'sap.m.Text' control is not bound to the path 'SupplierName'");
									}
								} else {
									assert.notOk("The supplier cell is not a sap.m.Text control");
								}

								if (aCells[iWebColumnIndex] instanceof sap.m.Link) {
									assert.ok("The web address cell is a sap.m.Link control");

									if (aCells[iWebColumnIndex].getBinding("href") && aCells[iWebColumnIndex].getBinding("href").getPath() === "ToSupplier/WebAddress") {
										assert.ok("The 'href' property of the 'sap.m.Link' control is bound to the path 'ToSupplier/WebAddress'");
									} else {
										assert.notOk("The 'href' property of the 'sap.m.Link' control is not bound to the path 'ToSupplier/WebAddress'");
									}
								} else {
									assert.notOk("The web address cell is not a sap.m.Link control");
								}
							},
							error: function () {
								assert.notOk("Did not find any column list items");
							}
						});
					});

					opensap.reuse.onAnyPage.goToNthProduct(1);

					opaTest("Find the name attribute", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.ObjectAttribute",
							success: function (aAttributes) {
								var oAttribute = aAttributes[0];

								assert.ok("There is an 'sap.m.ObjectAttribute' on the 'Object' page");
								if (oAttribute.getText().length > 0) {
									assert.ok("The attribute contains the name");
								} else {
									assert.notOk("The attribute does not contain the name");
								}
							},
							error: function () {
								assert.notOk("There is no 'sap.m.ObjectAttribute' on the 'Object' page");
							}
						});
					});
				},
				"w3u3" : function () {
					var iOriginalLength = 999;

					opensap.reuse.onAnyPage.setCloseDialogs(false);
					opensap.reuse.onAnyPage.goToWorklist();
					opensap.reuse.onTheWorklistPage.goToTab("all");

					opaTest("Remember the number of items in the table", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.IconTabBar",
							success: function (aIconTabBars) {
								var oIconTabBar = aIconTabBars[0];

								this.waitFor({
									controlType: "sap.m.Table",
									matchers: [
										new AggregationFilled({name: "items"}),
										new Ancestor(oIconTabBar)
									],
									success: function (aTables) {
										var aTable = aTables[0];
										if (iOriginalLength === 999) {
											if (aTable.getBinding("items").getLength() !== 0) {
												iOriginalLength = aTable.getBinding("items").getLength();
											}
										}
										assert.ok("Memorized the amount of products");
									},
									error: function () {
										assert.notOk("The table does not have less than '" + iOriginalLength + "' items so it is not filtered");
									}
								});
							},
							error: function () {
								assert.notOk("Did not find the 'all' filter");
							}
						});
					});

					opensap.reuse.onTheWorklistPage.goToTab("cheap");
					opensap.reuse.onTheWorklistPage.checkTableHasLessItemsThan("cheap", iOriginalLength);

					opaTest("Verify the 'cheap' filter logic", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.IconTabBar",
							success: function (aIconTabBars) {
								var oIconTabBar = aIconTabBars[0];

								this.waitFor({
									controlType: "sap.m.Table",
									check: function (aTables) {
										var oTable = aTables[0],
											aItems = oTable.getItems().filter(function(oItem) {
												return oItem.getBindingContext().getObject().Price >= 100;
											});
										return !aItems.length && oTable.getItems().length < iOriginalLength;
									},
									matchers: [
										new Ancestor(oIconTabBar)
									],
									success: function (aTables) {
										var oTable = aTables[0],
											oFilter;

										assert.ok("Found a sap.m.Table inside the IconTabFilter");
										assert.strictEqual(oTable.getBinding("items").aFilters.length, 1, "The 'items' binding is filtered");
										oFilter = oTable.getBinding("items").aFilters[0];
										assert.strictEqual(oFilter.sPath, "Price", "The path of the filter is 'Price'");
										assert.strictEqual(oFilter.sOperator, "LT", "The operator of the filter is 'LT'");
										assert.strictEqual(oFilter.oValue1, 100, "The value of the filter is '100'");
									},
									error: function () {
										assert.notOk("The table does not have less than '" + iOriginalLength + "' items so it is not filtered");
									}
								});
							},
							error: function () {
								assert.notOk("Did not find the IconTabBar");
							}
						});
					});

					opensap.reuse.onTheWorklistPage.goToTab("moderate");
					opensap.reuse.onTheWorklistPage.checkTableHasLessItemsThan("moderate", iOriginalLength);

					opaTest("Verify the 'moderate' filter logic", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.IconTabBar",
							success: function (aIconTabBars) {
								var oIconTabBar = aIconTabBars[0];

								this.waitFor({
									controlType: "sap.m.Table",
									check: function (aTables) {
										var oTable = aTables[0],
											aItems = oTable.getItems().filter(function(oItem) {
												return oItem.getBindingContext().getObject().Price < 100 || oItem.getBindingContext().getObject().Price > 1000;
											});
										return !aItems.length && oTable.getItems().length < iOriginalLength;
									},
									matchers: [
										new Ancestor(oIconTabBar)
									],
									success: function (aTables) {
										var oTable = aTables[0],
											oFilter;

										assert.ok("Found a sap.m.Table inside the IconTabFilter");
										assert.strictEqual(oTable.getBinding("items").aFilters.length, 1, "The 'items' binding is filtered");
										oFilter = oTable.getBinding("items").aFilters[0];
										assert.strictEqual(oFilter.sPath, "Price", "The path of the filter is 'Price'");
										assert.strictEqual(oFilter.sOperator, "BT", "The operator of the filter is 'BT'");
										assert.strictEqual(oFilter.oValue1, 100, "The value1 of the filter is '100'");
										assert.strictEqual(oFilter.oValue2, 1000, "The value2 of the filter is '1000'");
									},
									error: function () {
										assert.notOk("The table does not have less than '" + iOriginalLength + "' items so it is not filtered");
									}
								});
							},
							error: function () {
								assert.notOk("Did not find the IconTabBar");
							}
						});
					});

					opensap.reuse.onTheWorklistPage.goToTab("expensive");
					opensap.reuse.onTheWorklistPage.checkTableHasLessItemsThan("expensive", iOriginalLength);

					opaTest("Verify the 'expensive' filter logic", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.IconTabBar",
							success: function (aIconTabBars) {
								var oIconTabBar = aIconTabBars[0];

								this.waitFor({
									controlType: "sap.m.Table",
									check: function (aTables) {
										var oTable = aTables[0],
											aItems = oTable.getItems().filter(function(oItem) {
												return oItem.getBindingContext().getObject().Price <= 1000;
											});
										return !aItems.length && oTable.getItems().length < iOriginalLength;
									},
									matchers: [
										new Ancestor(oIconTabBar)
									],
									success: function (aTables) {
										var oTable = aTables[0],
											oFilter;

										assert.ok("Found a sap.m.Table inside the IconTabFilter");
										assert.strictEqual(oTable.getBinding("items").aFilters.length, 1, "The 'items' binding is filtered");
										oFilter = oTable.getBinding("items").aFilters[0];
										assert.strictEqual(oFilter.sPath, "Price", "The path of the filter is 'Price'");
										assert.strictEqual(oFilter.sOperator, "GT", "The operator of the filter is 'GT'");
										assert.strictEqual(oFilter.oValue1, 1000, "The value of the filter is '1000'");
									},
									error: function () {
										assert.notOk("The table is not filtered");
									}
								});
							},
							error: function () {
								assert.notOk("Did not find the IconTabBar");
							}
						});
					});

					opensap.reuse.onTheWorklistPage.checkFilterCountIsLessThan("cheap", iOriginalLength);
					opensap.reuse.onTheWorklistPage.checkFilterCountIsLessThan("moderate", iOriginalLength);
					opensap.reuse.onTheWorklistPage.checkFilterCountIsLessThan("expensive", iOriginalLength);
				},
				"w3u4" : function () {
					var sViewNamespace = "opensap.manageproducts.view.",
						sViewName = "Object";

					opensap.reuse.onAnyPage.setCloseDialogs(false);
					opensap.reuse.onAnyPage.goToNthProduct(3);

					opaTest("Check the ObjectHeader", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType : 'sap.m.ObjectHeader',
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							success : function(aObjectHeaders){
								var oObjectHeader = aObjectHeaders[0];

								if (oObjectHeader.getResponsive()) {
									assert.ok("The 'sap.m.ObjectHeader' property 'responsive' is set to true");
								} else {
									assert.notOk("The 'sap.m.ObjectHeader' property 'responsive' is not set to true");
								}
							},
							error: function () {
								assert.notOk("Could not find the ObjectHeader");
							}
						});
					});

					opaTest("Search for Panels on the Object page", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType : 'sap.m.Panel',
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							success : function(aPanels){
								if (aPanels.length >= 2) {
									assert.ok("There are 3 or more 'sap.m.Panel' controls on the 'Object' view");
								} else {
									assert.notOk("Could not find 3 or more 'sap.m.Panel' controls on the 'Object' view");
								}
							},
							error: function () {
								assert.notOk("Could not find any sap.m.Panel controls on the 'Object' view");
							}
						});
					});

					opaTest("Check the first panel", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType : 'sap.m.Panel',
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							success : function(aPanels){
								var oPanel = aPanels[0];

								if (oPanel.aCustomStyleClasses && oPanel.aCustomStyleClasses[0].search("sapUiResponsiveMargin") >= 0) {
									assert.ok("The first panel has the class 'sapUiResponsiveMargin'");
								} else {
									assert.notOk("The first panel does not have the class 'sapUiResponsiveMargin'");
								}

								if (oPanel.getExpandable()) {
									assert.ok("The first panel is not expandable on desktop devices");
								} else {
									assert.ok("The first panel is expandable on desktop devices");
								}

								Then.waitFor({
									controlType: 'sap.ui.layout.form.SimpleForm',
									matchers: new Ancestor(oPanel),
									success: function () {
										assert.ok("There is a 'sap.m.SimpleForm' inside the first panel");
									},
									error: function () {
										assert.notOk("Could not find a 'sap.m.SimpleForm' inside the first panel");
									}
								});
							},
							error: function () {
								assert.notOk("Could not find any sap.m.Panel controls on the 'Object' view");
							}
						});
					});

					opaTest("Check the second panel", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType : 'sap.m.Panel',
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							success : function(aPanels){
								var oPanel = aPanels[1];

								if (oPanel.aCustomStyleClasses && oPanel.aCustomStyleClasses[0].search("sapUiResponsiveMargin") >= 0) {
									assert.ok("The second panel has the class 'sapUiResponsiveMargin'");
								} else {
									assert.notOk("The second panel does not have the class 'sapUiResponsiveMargin'");
								}

								if (oPanel.getVisible()) {
									assert.ok("The second panel is only visible on desktop devices");
								} else {
									assert.notOk("The second panel is not visible on desktop devices");
								}

								if (!oPanel.getExpandable()) {
									assert.ok("The second panel is not expanded on phone devices");
								} else {
									assert.notOk("The second panel is expanded but should be closed on phone devices");
								}

								Then.waitFor({
									controlType: 'sap.m.List',
									matchers: [
										new AggregationFilled({name: "items"}),
										new Ancestor(oPanel)
									],
									success: function (aLists) {
										var oList = aLists[0],
											aItems;

										assert.ok("There is a non-empty 'sap.m.List' inside the second panel");

										aItems = oList.getItems().filter(function (oItem) {
											return oItem.aCustomStyleClasses && oItem.aCustomStyleClasses[0].search("sapUiVisibleOnlyOnDesktop") >= 0;
										});

										if (aItems.length > 0) {
											assert.ok("There is a list item with the class 'sapUiVisibleOnlyOnDesktop' in the list");
										} else {
											assert.notOk("There is no list item with the class 'sapUiVisibleOnlyOnDesktop' in the list");
										}
									},
									error: function () {
										assert.notOk("Could not find a non-empty 'sap.m.List' inside the second panel");
									}
								});
							},
							error: function () {
								assert.notOk("Could not find any sap.m.Panel controls on the 'Object' view");
							}
						});
					});

					opaTest("Check the third panel", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType : 'sap.m.Panel',
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							success : function(aPanels){
								var oPanel = aPanels[2];

								if (aPanels.length === 2) {
									assert.ok("The third panel is hidden on phone devices");
									return;
								}

								if (oPanel.aCustomStyleClasses && oPanel.aCustomStyleClasses[0].search("sapUiResponsiveMargin") >= 0) {
									assert.ok("The third panel has the class 'sapUiResponsiveMargin'");
								} else {
									assert.notOk("The third panel does not have the class 'sapUiResponsiveMargin'");
								}

								if (oPanel.aCustomStyleClasses && oPanel.aCustomStyleClasses[0].search("sapUiHideOnPhone") >= 0) {
									assert.ok("The third panel has the class 'sapUiHideOnPhone'");
								} else {
									assert.notOk("The third panel does not have the class 'sapUiHideOnPhone'");
								}

								Then.waitFor({
									controlType: 'sap.m.Image',
									matchers: [
										new Ancestor(oPanel)
									],
									success: function (aImages) {
										var oImage = aImages[0];

										assert.ok("There is an 'sap.m.Image' control the third panel");

										if (oImage.getSrc().search("maps.googleapis.com/maps/api/staticmap") >= 0) {
											assert.ok("Image URL contains the 'staticmap' API");
										} else {
											assert.notOk("Image URL does not contain the 'staticmap' API");
										}

										if (oImage.getSrc().search("&markers") >= 0) {
											assert.ok("Image URL contains the 'markers' parameter");
										} else {
											assert.notOk("Image URL does not contain the 'markers' parameter");
										}
									},
									error: function () {
										assert.notOk("Could not find a non-empty 'sap.m.List' inside the third panel");
									}
								});
							},
							error: function () {
								assert.notOk("Could not find any sap.m.Panel controls on the 'Object' view");
							}
						});
					});
				},
				"w3u5" : function () {
					var sViewNamespace = "opensap.manageproducts.view.",
						sViewName = "Object";

					opensap.reuse.onAnyPage.goToNthProduct(3);

					opaTest("Find a nested view on the detail page", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType : 'sap.m.semantic.FullscreenPage',
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							success : function(aPages){
								var oPage = aPages[0];
								this.waitFor({
									controlType: 'sap.ui.core.mvc.View',
									matchers: [
										new Ancestor(oPage)
									],
									success : function(){
										assert.ok("Found a nested view inside the page");
									},
									error : function (){
										assert.notOk("Could not find a nested view inside the page");
									}
								});
							},
							error: function () {
								assert.notOk("Could not find the page");
							}
						});
					});

					opaTest("Find the fragment content in the object view", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType : 'sap.m.semantic.FullscreenPage',
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							success : function(aPages){
								this.waitFor({
									controlType: "sap.m.Panel",
									matchers : [
										new Ancestor(aPages[0])
									],
									success : function(aPanels){
										if(aPanels.length===3){
											assert.ok("3 Panels, 2 (hopefully) from fragment found in the object view");
										} else {
											assert.notOk("There should be three panels in the object view. I have found " + aPanels.length);
										}
									},
									error : function (){
										assert.notOk("Could not find the panels from the fragment in the object view");
									}
								});
							},
							error: function () {
								assert.notOk("Could not find the page");
							}
						});
					});
				},
				"w3u6" : function () {
					opensap.reuse.onAnyPage.goToWorklist();

					opaTest("The Popover opens on click of the title of an ObjectIdentifier in the list", function (Given, When, Then, assert) {
						// click on header here
						When.waitFor({
							controlType: "sap.m.ColumnListItem",
							success: function () {
								//check if header is active:
								this.waitFor({
									controlType: "sap.m.ObjectIdentifier",
									matchers: [
										new PropertyStrictEquals({name : "titleActive", value : true})
									],
									success : function(aObjectIdentifiers){
										var oIdentifier = aObjectIdentifiers[0];

										oIdentifier.fireTitlePress({domRef: jQuery(oIdentifier.$().find('a')[0])});
										assert.ok("Header is active and can be tapped");
										// check if popup is open and contains data
										this.waitFor({
											searchOpenDialogs : true,
											controlType : "sap.m.Text",
											matchers: [
												new sap.ui.test.matchers.Properties({
													text: new RegExp("Weight", "i")
												})
											],
											success: function() {
												assert.ok("Found a text in the popover");
											},
											error : function() {
												assert.notOk("Did not find the popover");
											}
										});
									},
									error: function(){
										assert.notOk("Could not find any object identifiers in the list where I can click on");
									}
								});
							},
							error: function () {
								assert.notOk("Did not find any column list items");
							}
						});
					});

					opensap.reuse.onAnyPage.goToNthProduct(1);

					opaTest("The Popover opens on click of the Product Identifier in the Object View", function (Given, When, Then, assert) {
						// click on header here
						When.waitFor({
							controlType: "sap.m.ObjectHeader",
							matchers: [
								new PropertyStrictEquals({name : "titleActive", value : true})
							],
							success : function(aObjectHeaders){
								var oObjectHeader = aObjectHeaders[0];

								oObjectHeader.fireTitlePress({domRef: jQuery(oObjectHeader.$().find('a')[0])});
								assert.ok("Header is active and can be tapped");
								// check if popup is open and contains data
								this.waitFor({
									searchOpenDialogs : true,
									controlType : "sap.m.Text",
									matchers: [
										new sap.ui.test.matchers.Properties({
											text: new RegExp("Weight", "i")
										})
									],
									success: function() {
										assert.ok("Found a text in the popover");
									},
									error : function() {
										assert.notOk("Did not find the popover");
									}
								});
							},
							error: function(){
								assert.notOk("Could not find any object header in this view with a title I can click on");
							}
						});
					});
				},

				/*** week 4 tests ***/

				"w4u1" : function () {
					opensap.reuse.onAnyPage.setCloseDialogs(false);
					opensap.reuse.onAnyPage.goToWorklist();

					opaTest("Go to the add page", function (Given, When, Then, assert) {
						var sViewNamespace = "opensap.manageproducts.view.",
							sViewName = "Worklist";

						When.waitFor({
							//controlType: "sap.m.Button",
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							id: "addButton",
							actions: new Press(),
							success: function () {
								assert.ok("Pressed the add button");
							},
							error: function () {
								assert.notOk("No button with the id 'addButton' was found.");
							}
						});

						Then.waitFor({
							controlType: "sap.m.Page",
							viewNamespace: sViewNamespace,
							viewName: "Add",
							success: function (aPages) {
								var oPage = aPages[0];

								assert.ok("Navigated to the add page");

								if (oPage.getParent().getTitle() === "New Product" || oPage.getTitle() === "New Product" ) {
									assert.ok("The add page has title 'New Product'");
								} else {
									assert.notOk("The add page does not have the title 'New Product'");
								}
							},
							error: function () {
								assert.notOk("Could not navigate to the add page");
							}
						});
					});
				},
				"w4u2" : function () {
					var oProperties = {
						Name: "Binford Toolmaster 3000",
						Category: "0100000000",
						SupplierID: "08154711",
						Price: "2342"
					};

					opensap.reuse.onAnyPage.setCloseDialogs(false);
					opensap.reuse.onAnyPage.goToWorklist();

					opaTest("Go to the add page", function (Given, When, Then, assert) {
						var sViewNamespace = "opensap.manageproducts.view.",
							sViewName = "Worklist";

						When.waitFor({
							//controlType: "sap.m.Button",
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							id: "addButton",
							actions: new Press(),
							success: function () {
								assert.ok("Pressed the add button");
							},
							error: function () {
								assert.notOk("No button with the id 'addButton' was found.");
							}
						});

						Then.waitFor({
							controlType: "sap.m.Page",
							viewNamespace: sViewNamespace,
							viewName: "Add",
							success: function (aPages) {
								var oPage = aPages[0];

								assert.ok("Navigated to the add page");

								if (oPage.getParent().getTitle() === "New Product" || oPage.getTitle() === "New Product" ) {
									assert.ok("The add page has title 'New Product'");
								} else {
									assert.notOk("The add page does not have the title 'New Product'");
								}
							},
							error: function () {
								assert.notOk("Could not navigate to the add page");
							}
						});
					});

					opaTest("Add a new product", function (Given, When, Then, assert) {
						var sViewNamespace = "opensap.manageproducts.view.",
							sViewName = "Add";

						Then.waitFor({
							//controlType: "sap.ui.comp.smartform.SmartForm",
							id: 'form',
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							success: function (aSmartForms) {
								var oSmartForm = aSmartForms[0];

								assert.ok("Found a 'sap.ui.comp.smartform.SmartForm' on the 'add' page");

								this.waitFor({
									controlType: "sap.m.Input",
									matchers: new Ancestor(oSmartForm),
									success: function (aInputs) {

										this.waitFor({
											id: aInputs[0].getId(),
											//controlType: "sap.m.Input",
											matchers: new Ancestor(oSmartForm),
											actions: new EnterText({
												text: oProperties.Name
											}),
											success: function () {
												assert.ok("Entered '" + oProperties.Name + "' in the first input field");
											},
											error: function () {
												assert.notOk("Could not enter '" + oProperties.Name + "' in the first input field");
											}
										});

										this.waitFor({
											id: aInputs[1].getId(),
											//controlType: "sap.m.Input",
											matchers: new Ancestor(oSmartForm),
											actions: new EnterText({
												text: oProperties.Category
											}),
											success: function () {
												assert.ok("Entered '" + oProperties.Category + "' in the second input field");
											},
											error: function () {
												assert.notOk("Could not enter '" + oProperties.Category + "' in the second input field");
											}
										});

										this.waitFor({
											id: aInputs[2].getId(),
											//controlType: "sap.m.Input",
											matchers: new Ancestor(oSmartForm),
											actions: new EnterText({
												text: oProperties.SupplierID
											}),
											success: function () {
												assert.ok("Entered '" + oProperties.SupplierID + "' in the third input field");
											},
											error: function () {
												assert.notOk("Could not enter '" + oProperties.SupplierID + "' in the third input field");
											}
										});

										this.waitFor({
											id: aInputs[3].getId(),
											//controlType: "sap.m.Input",
											matchers: new Ancestor(oSmartForm),
											actions: new EnterText({
												text: oProperties.Price
											}),
											success: function () {
												assert.ok("Entered '" + oProperties.Price + "' in the fourth input field");
											},
											error: function () {
												assert.notOk("Could not enter '" + oProperties.Price + "' in the fourth input field");
											}
										});

										this.waitFor({
											id: "save-button",
											viewNamespace: sViewNamespace,
											viewName: sViewName,
											controlType: "sap.m.Input",
											actions: new Press(),
											success: function () {
												assert.ok("Pressed the 'save' button'");
											},
											error: function () {
												assert.notOk("Could not press the 'save' button'");
											}
										});
									},
									error: function () {
										assert.notOk("Could not find any 'sap.m.Input' controls inside the SmartForm");
									}
								});
							},
							error: function () {
								assert.notOk("Could not find a 'sap.ui.comp.smartform.SmartForm' on the 'add' page");
							}
						});
					});

					opaTest("Find the new product", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.ObjectAttribute",
							matchers: new PropertyStrictEquals({name : "text", value : oProperties.Name}),
							success: function () {
								assert.ok("Found the new product '" + oProperties.Name + "'");
							},
							error: function () {
								assert.ok("Could not find the new product '" + oProperties.Name + "'");
							}
						});
					});
				},
				"w4u3" : function () {
					var sViewNamespace = "opensap.manageproducts.view.",
						sViewName = "Object";

					opensap.reuse.onAnyPage.setCloseDialogs(false);
					opensap.reuse.onAnyPage.goToNthProduct(1);

					opaTest("Find the delivery status", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.ObjectStatus",
							success: function (aStatuses) {
								var oStatus = aStatuses[0];

								assert.ok("There is an ObjectStatus on the detail page");
								if (oStatus.getText().search("deliver via") >= 0) {
									assert.ok("The status contains the delivery information");
								} else {
									assert.notOk("The status does not contain the delivery information");
								}
							},
							error: function () {
								assert.notOk("There is no ObjectStatus on the detail page");
							}
						});
					});

					opaTest("Check the delivery formatter logic", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.ui.core.mvc.View",
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							success: function (aViews) {
								var oView = aViews[0],
									fnFormatter = oView.getController().formatter.delivery,
									fnIsolatedFormatter = fnFormatter.bind(oView.getController());

								if (fnFormatter) {
									assert.ok("Found a formatter with the name 'delivery'");

									assert.strictEqual(fnIsolatedFormatter("KG", 0.2), "deliver via mail", "A weight of 0.2kg will convert to the mail delivery method");
									assert.strictEqual(fnIsolatedFormatter("G", 200), "deliver via mail", "A weight of 200g will convert to the mail delivery method");
									assert.strictEqual(fnIsolatedFormatter("G", -11), "deliver via mail", "A weight of -11kg will convert to the mail delivery method");
									assert.ok("Mail delivery formatter logic works fine");

									assert.strictEqual(fnIsolatedFormatter("G", 500), "deliver via parcel", "A weight of 500g will convert to the parcel delivery method");
									assert.strictEqual(fnIsolatedFormatter("KG", 3), "deliver via parcel", "A weight of 3kg will convert to the parcel delivery method");
									assert.ok("Parcel delivery formatter logic works fine");

									assert.strictEqual(fnIsolatedFormatter("KG", 23), "deliver via carrier", "A weight of 23kg will convert to the carrier delivery method");
									assert.strictEqual(fnIsolatedFormatter("KG", 5), "deliver via carrier", "A weight of 5kg will convert to the carrier delivery method");
									assert.strictEqual(fnIsolatedFormatter("foo", "bar"), "deliver via carrier", "Invalid values will convert to the carrier delivery method");
									assert.ok("Carrier delivery formatter logic works fine");
								} else {
									assert.notOk("Did not find a formatter with the name 'delivery'");
								}
							},
							error: function () {
								assert.notOk("Could not find the 'Object' view");
							}
						});
					});

					opaTest("Check the delivery formatter unit tests", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.ui.core.mvc.View",
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							success: function () {
								// load dependencies
								jQuery.sap.require("sap.ui.thirdparty.qunit");
								jQuery.sap.require("sap.ui.qunit.qunit-junit");
								jQuery.sap.require("sap.ui.thirdparty.sinon");
								jQuery.sap.require("sap.ui.thirdparty.sinon-qunit");

								// create spies
								var oSandbox = sinon.sandbox.create();
								var fnQUnitModuleSpy = oSandbox.spy(QUnit, "module");
								var fnQUnitTestSpy = oSandbox.spy(QUnit, "test");

								// load and run unit tests
								jQuery.sap.registerModulePath("test.unit", "../test/unit");
								jQuery.sap.require("opensap.manageproducts.test.unit.model.formatter");

								// trigger assertions
								if (fnQUnitModuleSpy.callCount >= 2) {
									assert.ok("There are at least two QUnit modules defined");
								} else {
									assert.notOk("There is only one QUnit module defined");
								}

								var aDeliveryCalls = fnQUnitModuleSpy.getCalls().filter(function (oDeliveryCall) {
									return oDeliveryCall.args[0].toLowerCase().search("delivery") >= 0;
								});
								if (aDeliveryCalls.length > 0) {
									assert.ok("There is a 'delivery' QUnit module");
								} else {
									assert.notOk("There is no 'delivery' QUnit module");
								}

								if (fnQUnitTestSpy.callCount > 5) {
									assert.ok("There are " + (fnQUnitTestSpy.callCount - 4) + " QUnit tests for the 'delivery' formatter");
								} else {
									assert.notOk("There are no QUnit tests for the 'delivery' formatter");
								}

								oSandbox.restore();
								jQuery.sap.unloadResources("opensap/manageproducts/test/unit/model/formatter.js", false, true);
							},
							error: function () {
								assert.notOk("Could not find the 'Object' view");
							}
						});
					});
				},
				"w4u4" : function () {
					var sViewNamespace = "opensap.manageproducts.view.",
						sViewName = "Add";

					opensap.reuse.onAnyPage.setCloseDialogs(false);
					opensap.reuse.onAnyPage.goToWorklist();

					opaTest("Go to the add page", function (Given, When, Then, assert) {


						When.waitFor({
							controlType: "sap.m.Button",
							viewNamespace: sViewNamespace,
							viewName: "Worklist",
							id: "addButton",
							actions: new Press(),
							success: function () {
								assert.ok("Pressed the add button");
							},
							error: function () {
								assert.notOk("No button with the id 'addButton' was found.");
							}
						});

						Then.waitFor({
							controlType: "sap.m.Page",
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							success: function (aPages) {
								var oPage = aPages[0];

								assert.ok("Navigated to the add page");

								if (oPage.getParent().getTitle() === "New Product" || oPage.getTitle() === "New Product" ) {
									assert.ok("The add page has title 'New Product'");
								} else {
									assert.notOk("The add page does not have the title 'New Product'");
								}
							},
							error: function () {
								assert.notOk("Could not navigate to the 'Add' view");
							}
						});
					});

					// fake: due to the dynamic dependency of the opaTest method we cannot spy on it
					opaTest("Check for new OPA tests", function (Given, When, Then, assert) {
						Then.waitFor({
							viewNamespace: sViewNamespace,
							viewName: "Add",
							controlType: "sap.ui.core.mvc.View",
							success: function () {
								assert.ok("There are new OPA tests defined");
							},
							error: function () {
								assert.notOk("Could not find the 'Add' view");
							}
						});
					});
				},
				"w4u5" : function () {
					var sViewNamespace = "opensap.manageproducts.view.",
						sViewName = "Object",
						iNewValue = 3;

					opensap.reuse.onAnyPage.setCloseDialogs(false);
					opensap.reuse.onAnyPage.goToNthProduct(1);

					opaTest("Find the 'ProductRate' control in the app", function (Given, When, Then, assert) {
						Then.waitFor({
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							controlType: "opensap.manageproducts.control.ProductRate",
							success: function () {
								assert.ok("There is a 'ProductRate' control displayed on the object view");
							},
							error: function () {
								assert.notOk("Could not find the 'opensap.manageproducts.control.ProductRate' control on the object view");
							}
						});
					});

					opaTest("Rate a new value", function (Given, When, Then, assert) {
						Then.waitFor({
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							controlType: "opensap.manageproducts.control.ProductRate",
							success: function (aProductRatings) {
								var oProductRating = aProductRatings[0];

								Then.waitFor({
									controlType: "sap.m.RatingIndicator",
									matchers: new Ancestor(oProductRating),
									success: function (aRatings) {
										var oRating = aRatings[0];

										iNewValue = (oRating.getValue() + 1) % oRating.getMaxValue();

										// fake, did not want to adjust press action for ratings
										oRating.setValue(iNewValue);
										oRating.fireLiveChange({ value: iNewValue });
										oRating.fireChange({ value: iNewValue });

										if (oProductRating.getValue() === iNewValue) {
											assert.ok("When changing the value of the rating to '" + iNewValue + "' it is reflected in the 'ProductRate' control");
										} else {
											assert.notOk("When changing the value of the rating to '" + iNewValue + "' it is not reflected in the 'ProductRate' control");
										}
									},
									error: function () {
										assert.notOk("Could not find a 'sap.m.Rating' control inside the 'ProductRate' control");
									}
								});
							},
							error: function () {
								assert.notOk("Could not find the 'opensap.manageproducts.control.ProductRate' control on the object view");
							}
						});
					});

					opaTest("Submit the rating", function (Given, When, Then, assert) {
						Then.waitFor({
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							controlType: "opensap.manageproducts.control.ProductRate",
							success: function (aProductRatings) {
								var oProductRating = aProductRatings[0];

								Then.waitFor({
									controlType: "sap.m.Button",
									matchers: new Ancestor(oProductRating),
									actions: new Press(),
									success: function (aButtons) {
										var oButton = aButtons[0];

										assert.ok("The button has been pressed");

										if (oButton.getEnabled() === false) {
											assert.ok("The button is disabled after the new value has been submitted");
										} else {
											assert.notOk("The button is still enabled after the new value has been submitted");
										}
									},
									error: function () {
										assert.notOk("Could not find or press a 'sap.m.Button' control inside the 'ProductRate' control");
									}
								});
							},
							error: function () {
								assert.notOk("Could not find the 'opensap.manageproducts.control.ProductRate' control on the object view");
							}
						});
					});

					opaTest("Find a MessageToast with the new rating value", function (Given, When, Then, assert) {
						Then.waitFor({
							check: function () {
								return !!$(".sapMMessageToast").length;
							},
							success: function () {
								assert.ok("MessageToast is displayed");

								if ($(".sapMMessageToast").text().search(iNewValue) >= 0) {
									assert.ok("The MessageToast contains the new rating value '" + iNewValue + "'");
								} else {
									assert.notOk("The MessageToast does not contain the new rating value '" + iNewValue + "'");
								}
							},
							error: function () {
								assert.notOk("Could not find a MessageToast");
							}
						});
					});

					opaTest("Check the 'ProductRate' API", function (Given, When, Then, assert) {
						Then.waitFor({
							viewNamespace: sViewNamespace,
							viewName: sViewName,
							controlType: "opensap.manageproducts.control.ProductRate",
							success: function (aProductRatings) {
								var oProductRating = aProductRatings[0];

								if (oProductRating.getValue) {
									assert.ok("The 'ProductRate' control has a 'getValue' method");
								} else {
									assert.notOk("The 'ProductRate' control does not have a 'getValue' method");
								}

								if (oProductRating.getAggregation("_rating") instanceof sap.m.RatingIndicator) {
									assert.ok("The 'ProductRate' control has a hidden '_rating' aggregation");
								} else {
									assert.notOk("The 'ProductRate' control does not have a hidden '_rating' aggregation");
								}

								if (oProductRating.getAggregation("_button") instanceof sap.m.Button) {
									assert.ok("The 'ProductRate' control has a hidden '_button' aggregation");
								} else {
									assert.notOk("The 'ProductRate' control does not have a hidden '_button' aggregation");
								}

								if (oProductRating.fireValueSubmit) {
									assert.ok("The 'ProductRate' control has a 'valueSubmit' event");
								} else {
									assert.notOk("The 'ProductRate' control does not have a 'valueSubmit' event");
								}
							},
							error: function () {
								assert.notOk("Could not find the 'opensap.manageproducts.control.ProductRate' control on the object view");
							}
						});
					});
				},

				/*** week 4 bonus ***/

				"w4u7bonus" : function () {
					var sBindingPath = "",
						sProductName = "";

					opensap.reuse.onAnyPage.goToWorklist();

					opaTest("Delete the first product in the table", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.ColumnListItem",
							success: function (aListItems) {
								var oItem;

								if (aListItems.length >= 1) {
									oItem = aListItems[0];

									assert.ok("Found the first item");
									sBindingPath = oItem.getBindingContextPath();
									sProductName = oItem.getBindingContext().getObject().Name;
									When.waitFor({
										controlType: "sap.m.Button",
										matchers: new Ancestor(oItem),
										success: function (aButtons) {
											var oButton = aButtons[0];

											if (oButton.getId().search("delete") >=0) {
												assert.ok("The button has the id 'delete'");
											} else {
												assert.notOk("The button does not have the id 'delete'");
											}

											if (oButton.getIcon().search("delete") >=0) {
												assert.ok("The button has a 'delete' icon");
											} else {
												assert.notOk("The button does not have a 'delete' icon");
											}

											assert.ok("Pressed the delete button");
										},
										error: function () {
											assert.notOk("No button was found inside the table item");
										}
									});

									When.waitFor({
										controlType: "sap.m.Button",
										matchers: new Ancestor(oItem),
										actions: new Press(),
										success: function () {
											assert.ok("Pressed the delete button");
										},
										error: function () {
											assert.notOk("No button was found inside the table item");
										}
									});
								} else {
									assert.notOk("The table is empty");
								}
							},
							error: function () {
								assert.notOk("Could not find any items in the table");
							}
						});
					});

					opaTest("Check if the product has been deleted", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.ColumnListItem",
							matchers: function (aItems) {
								for (var i = 0; i < aItems.length; i++) {
									if (aItems[i].getBindingContextPath() === sBindingPath) {
										return true;
									}
								}
								return false;
							},
							success: function () {
								assert.ok("The product with the binding path '" + sBindingPath + "' is deleted");
							},
							error: function () {
								assert.notOk("The product with the binding path '" + sBindingPath + "' was not deleted");
							}
						});
					});

					opaTest("Find a MessageToast with the product id", function (Given, When, Then, assert) {
						Then.waitFor({
							check: function () {
								return !!$(".sapMMessageToast").length;
							},
							success: function () {
								assert.ok("MessageToast is displayed");

								if ($(".sapMMessageToast").text().search(sProductName) >= 0) {
									assert.ok("The MessageToast contains the product name '" + sProductName + "'");
								} else {
									assert.notOk("The MessageToast does not contain the product name '" + sProductName + "'");
								}
							},
							error: function () {
								assert.notOk("Could not find a MessageToast");
							}
						});
					});
				}
			};

			/********* test cases end here *********/

			// run the selected tests
			if(oTests[sCookieKey]) {
				oTests[sCookieKey]();
			} else if (sCookieKey) {
				this.showResult("Error!", false);
				jQuery.sap.log.error("Tests for key '" + sCookieKey + "' not found");
			} else {
				this.showResult("Select:");
			}

		}
	});

	// attach the validator to the global init event of UI5
	sap.ui.getCore().attachInit(function () {
		new opensap.Validator().init();
	});
});
