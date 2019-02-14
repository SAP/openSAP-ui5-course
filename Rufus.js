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
	"sap/ui/test/matchers/BindingPath",
	"sap/m/Button",
	"sap/ui/core/Icon"
], function (Opa, Opa5, Press, EnterText, AggregationFilled, PropertyStrictEquals, Properties, Ancestor, BindingPath, Button, Icon) {
	"use strict";

	// reduce global timeout to 5s
	Opa.config.timeout = 5;

	// testing
	// var sPath = "../../validator/";

	// live
	var sPath = "https://Michadelic.github.io/openSAP-ui5-course/";

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
			var statusPilot = {
				neutral: sPath + "neutral.png",
				failure: sPath + "failure.png",
		};

			$("body").append('<div id="rufus"/>');
			this._oValidateButton = new sap.m.Image("validate", {
				src: statusPilot.neutral,
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
			}).placeAt("rufus", -1);

			// CSS manupulation for the validator button
			this._oValidateButton.addEventDelegate({
				onAfterRendering: function (oEvent) {
					var oButton = oEvent.srcControl;
					oButton.$().css("position", "absolute");
					oButton.$().css("z-index", "100000");
					oButton.$().css("width", "250px");
					oButton.$().css("height", "200px");
					oButton.$().css("bottom", "0");
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
							"key": "w0u0",
							"text": "Select a unit"
						},
						{
							"key": "w2u1",
							"text": "Week 2 Unit 1"
						},
						{
							"key": "w2u1c",
							"text": "Week 2 Unit 1 Challenge"
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
							"key": "w2u4c",
							"text": "Week 2 Unit 4 Challenge"
						},
						{
							"key": "w2u5",
							"text": "Week 2 Unit 5"
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
				}).addEventDelegate({}).addStyleClass("sapUiSmallMarginBeginEnd");
				oSelect.setModel(oModel);

				// creates the popover for the validator button
				this._oPopover = new sap.m.Popover("validatePopover", {
					beforeClose: function(oEvent){
						this._oValidateButton.setSrc("../../validator/neutral.png");
					}.bind(this),
					customHeader:
							new sap.m.Text({text: "Validating..."}).addEventDelegate({
								onAfterRendering: function (oEvent) {
									var $Control = oEvent.srcControl.$();
									$Control.css("max-width", "25rem");
									$Control.css("min-width", "25rem");
									$Control.css("font-size", "1.1rem");
								}
							}).addStyleClass("sapUiSmallMarginBeginEnd sapUiSmallMarginTopBottom"),
					content: [
						oSelect,
						new sap.m.Slider({
							height: "15px",
							enableTickmarks:true,
							enabled:false,
							max:1
						}).addEventDelegate({
							onAfterRendering: function (oEvent) {
								var $Control = oEvent.srcControl.$();
								var oSlider = oEvent.srcControl;
								$Control.css("margin", "0");
								$Control.css("border", "0px");
								$Control.css("width", "90%");
								oEvent.srcControl.$("textLeft").css("line-height", "15px");
								oEvent.srcControl.$("textRight").css("line-height", "15px");
								var $handle = oSlider.$("handle");
								$handle.css("border-color", "transparent");
								$handle.css("transform", "rotate(45deg)");
								$handle.css("margin-top", "0.8%");
								if (!this.__planeIcon) {
									this.__planeIcon = new Icon(oSlider.getId() + "-__planeIcon", {
										src : "sap-icon://flight", size:"1.5rem", color:"black"})
									//add Icon to control tree

									oSlider.addDependent(this.__planeIcon);
								}
								// render icon into created div
								var oRenderManager = sap.ui.getCore().createRenderManager();
								oRenderManager.renderControl(this.__planeIcon);
								oRenderManager.flush($handle[0]);
								oRenderManager.destroy();
							}.bind(this)
						}),
						new sap.m.List({
						})
					],
					initialFocus: oSelect,
					placement: sap.m.PlacementType.HorizontalPreferredRight
				}).addEventDelegate({
					onAfterRendering: function (oEvent) {
						var $Control = oEvent.srcControl.$();
						$Control.css("border-radius", "1.5rem");
						$Control.css("min-height", "13rem");
						$Control.css("border", "1px solid lightgrey");
						oEvent.srcControl.$("cont").css("border-radius", "1.5rem");
					}
				}).addStyleClass("")
			};
			this._oPopover.openBy(this._oValidateButton);
			this._oPopover.oPopup.setAutoClose(true);
			this._oPopover.getContent()[2].setShowNoData(false);
			return this._oPopover;
		},

		// update the progress bar based on the number of ran tests
		updateProgress: function (iValue, iLength) {
			var oProgress = this.getPopover().getContent()[1];
			oProgress.setMax(iLength);
			oProgress.setValue(Math.round(iValue*(oProgress.getMax())/100));
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
			}).addStyleClass("sapUiSmallMarginBottom sapUiSmallMarginBeginEnd");

			this.getPopover().getContent()[2].addItem(oDisplayListItem);
		},

		// update the current test result
		updateTestResult: function (sTestName, sMessage, bStatus, bFinal) {
			var oDisplayListItem;

			if (sTestName) {
				oDisplayListItem = this.getPopover().getContent()[2].getItems().filter(function (oItem) {
					return (oItem.getContent()[0].getText().split(":")[0] === sTestName);
				})[0];
			} else {
				oDisplayListItem = this.getPopover().getContent()[2].getItems().pop();
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
			var oDisplayListItem = this.getPopover().getContent()[2].getItems().filter(function (oItem) {
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
				oProgress = this.getPopover().getContent()[1],
				oTitle = oPopover.getCustomHeader(),
				oButton = sap.ui.getCore().byId("validate");
			// clear busy indication on the list
			this.getPopover().getContent()[2].getItems().forEach(function (oItem) {
				if(oItem.getContent().length === 3) {
					oItem.removeContent(2);
				}
			});

			// show semantics in result popover
			oTitle.setText(sMessage);
			if (bStatus !== undefined) {
				if (bStatus) {
					oTitle.$().css("color", "#007833");
					oButton.setSrc("../../validator/success.png");
				} else {
					oTitle.$().css("color", "#cc1919");
					oButton.setSrc("../../validator/failure.png");
				}
			} else {
				oTitle.$().css("color", "");
			}
		},

		/**** Test runner functions ***/

		// clears the test results for the next run
		reset: function () {
			// clear list
			var oPopover = this.getPopover();
			if (this.getPopover().getContent()[0].getSelectedKey() ==="w0u0"){
				var helloText = "Hello this is Rufus, your personal assistant. If you want to know if you are on course, just click on me.";
				this.showResult(helloText);
			}
			else{
				this.showResult("Validating...");
			}
			if (oPopover && oPopover.getContent()[2]) {
				oPopover.getContent()[2].removeAllItems();
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
					this._oPopover.oPopup.setAutoClose(false);
					this._oPopover.focus();
				}.bind(this),
				bSomeTestFailed = false,
				bDebugMode = window["sap-ui-debug"],
				sCookieKey = sKey || this.getUnitCookie() || "";

			if (sCookieKey ==="w0u0"){
				this.getPopover().getCustomHeader().setText("Hello this is Rufus, your personal assistant speaking. I hope you have a pleasant flight. If you want to know if you are on course, just click on me.")
			}
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
					this.updateProgress((this._iTotalCount - this._aAllTests.length) * 100 / this._iTotalCount, this._iTotalCount);
					fnTest(assert).done(fnProcessAllTests).fail(function () {
						this._aAllTests = null;
						window["sap-ui-debug"] = bDebugMode;
						fnUpdateTestResult("", "A validation error occured, check the console", false, true);
					}.bind(this));
				} else {
					if (!bSomeTestFailed && this._iTotalCount > 0) {
						fnShowResult("Great you are still on course!", true);
						if(sCookieKey.search("bonus") > 0 ) {
							fnShowCode();
						}
					} else if (this._iTotalCount > 0) {
						fnShowResult("Sorry, you are not on course anymore!", false);
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
						fnShowResult("Sorry, you are not on course anymore!", false);
						if(sCookieKey.search("opt") > 0 ) {
							fnShowCode();
						}
					});
					promise.always(function(){
						this._oPopover.oPopup.setAutoClose(true);
					}.bind(this));
					return promise;
				}.bind(this);
				this._aAllTests.push([testName, testBody]);
			}.bind(this);

			/********* test cases start here *********/
			var oTests = {
				/*** week 2 tests ***/
				"w0u0": function () {
				},
				"w2u1": function () {
				},
				"w2u2": function () {
				},
				"w2u3": function () {
					opaTest("SAPUI5 is loaded", function (Given, When, Then, assert) {
						assert.ok("ok");
					});
					opaTest("Analyzing the movie header image", function (Given, When, Then, assert) {
						assert.ok("Header image is ok");
					});
					opaTest("Checking the search form", function (Given, When, Then, assert) {
						assert.ok("Search form is ready for action");
					});
					opaTest("Looking for a planning calendar", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.PlanningCalendar",
							success: function () {
								assert.ok("The planning calendar was found");
							},
							error: function () {
								assert.notOk("Could not find a planning calendar in the app");
							}
						});
					});
					opaTest("Checking the calendar's id", function (Given, When, Then, assert) {
						When.waitFor({
							id: "container-movies---app--calendar", // TODO check view id here only
							success: function () {
								assert.ok("The planning calendar has the id 'calendar'");
							},
							error: function () {
								assert.notOk("Could not find a control with the id 'calendar'");
							}
						});
					});
				},
				"w2u4": function () {
					opaTest("Press the Find Movies Button ", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Button",
							success: function (aButtons) {
								if (aButtons[1].getId() === "__component0---app--calendar-Today") {
									this.waitFor({
										id: aButtons[1].getId(),
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
					});
					opaTest("Check for the MessageToast ", function (Given, When, Then, assert) {
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
					opaTest("Check for Fail ", function (Given, When, Then, assert) {
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
				"w2u5": function () {
					opaTest("Press the Find Movies Button ", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Button",
							success: function (aButtons) {
								if (aButtons[0].getId() === "__button0") {
									this.waitFor({

										id: aButtons[0].getId(),
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
					}),
					opaTest("Check for the MessageToast ", function (Given, When, Then, assert) {
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
					})
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

