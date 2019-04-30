/*global opensap,sinon, sPath */
sPath = "https://sap.github.io/openSAP-ui5-course/";

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
	"sap/ui/test/matchers/I18NText",
	"sap/m/Button",
	"sap/ui/core/Icon",
	"sap/base/i18n/ResourceBundle"
], function (Opa, Opa5, Press, EnterText, AggregationFilled, PropertyStrictEquals, Properties, Ancestor, BindingPath, I18NText, Button, Icon, ResourceBundle) {
	"use strict";

	// reduce global timeout to 5s
	Opa.config.timeout = 5;

	// testing
	// var sPath = "../../validator/";

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
				success: sPath + "success.png"
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
						},
						{
							"key": "w3u1",
							"text": "Week 3 Unit 1"
						},
						{
							"key": "w3u1c",
							"text": "Week 3 Unit 1 Challenge"
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
							"key": "w3u4c",
							"text": "Week 3 Unit 4 Challenge"
						},
						{
							"key": "w3u5",
							"text": "Week 3 Unit 5"
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
							"key": "w4u2c",
							"text": "Week 4 Unit 2 Challenge"
						},
						{
							"key": "w5u1",
							"text": "Week 5 Unit 1"
						},
						{
							"key": "w5u2",
							"text": "Week 5 Unit 2 - List Report"
						},
						{
							"key": "w5u2a",
							"text": "Week 5 Unit 2 - Object Page"
						},
						{
							"key": "w5u2c",
							"text": "Week 5 Unit 2 Challenge"
						},
						{
							"key": "w5u3",
							"text": "Week 5 Unit 3"
						},
						{
							"key": "w5u6a",
							"text": "Week 5 Unit 6 - Button"
						},
						{
							"key": "w5u6b",
							"text": "Week 5 Unit 6 - Map"
						},
						{
							"key": "w5u6c",
							"text": "Week 5 Unit 6 Challenge"
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
					Path: sPath,
					beforeClose: function(oEvent){
						this._oValidateButton.setSrc(sPath + "neutral.png");
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
					oButton.setSrc(sPath + "success.png");
				} else {
					oTitle.$().css("color", "#cc1919");
					oButton.setSrc(sPath + "failure.png");
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
				this._oValidateButton.setSrc(sPath + "neutral.png");
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
				this.updateProgress(0,1);
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

					var promise = Opa.emptyQueue();
					promise.done(function () {
						Opa.assert = undefined;
						Opa5.assert = undefined;
						fnRemoveTestBusy(assert.testName);
					});

					promise.fail(function () {
						Opa.assert = undefined;
						Opa5.assert = undefined;
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
					opaTest("Looking for an image", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Image",
							success: function () {
								assert.ok("The image was found");
							},
							error: function () {
								assert.notOk("Could not find an image in the app");
							}
						});
					});
					opaTest("Check for the correct image", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Image",
							matchers: new Properties ({
								src: /images\/MoviesHeader.png$/
							}),

							success: function () {
								assert.ok("The image has the correct path.");
							},
							error: function(){
								assert.notOk("Could not find the correct image in the app.");
							}
						});
					});
					opaTest("Check the app header ", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Page",
							success: function (aPage) {
								if (aPage[0].getTitle() === "Watch Movies") {
									assert.ok("The page title was set to 'Watch Movies'.");
								} else {
									assert.notOk("The page title was not set to 'Watch Movies'.");
								}
							},
							error: function () {
								assert.notOk("The page was not found.");
							}
						});
					});
				},
				"w2u1c": function() {
					opaTest("Check for the Toolbar", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Toolbar",
							success: function () {
								assert.ok("The Toolbar was found");
							},
							error: function () {
								assert.notOk("Could not find a Toolbar in the app");
							}
						});
					});
					opaTest("Check for the Database Link", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Link",
							matchers: new Properties ({
								href:"https://www.imdb.com/"
							}),
							success: function () {
								assert.ok("The correct link was found.");
							},
							error: function() {
								assert.notOk("Could not find a link to IMDb in the toolbar.");
							}
						});
					});
				},
				"w2u2": function () {
					opaTest("Looking for a Select", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Select",
							success: function (aSelect) {
								if(aSelect[0].getItems().length > 0){
									assert.ok("The select contains a list of genres");
								} else {
									assert.notOk ("The select was found,pressed but the list has no entries");
								}
							},
							error: function () {
								assert.notOk("Could not find a select in the app");
							}
						});
					});
					
					opaTest("Press the Find Movies Button ", function (Given, When, Then, assert) {
											When.waitFor({
							controlType: "sap.m.Button",
							matchers: new Properties({text: /Find Movie[s]?/}),
							actions: new Press(),
							success: function () {
								return this.waitFor({
									pollingInterval: 100,
									check: function() {
										return !!document.getElementsByClassName("sapMMessageToast").length;
									},
									success: function() {
										assert.ok(" The message toast by pressing the find movies button was displayed");
									},
									errorMessage: "The message toast by pressing the find movies button was not displayed"
								});
							},
							errorMessage: "The button 'Find Movies' was not found or couldn't be pressed"
						});
					});
					opaTest("Looking for a SearchField", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.SearchField",
							success: function () {
								assert.ok("The SearchField for the city was found");
							},
							error: function () {
								assert.notOk("Could not find a SearchField in the app");
							}
						});
					});
					opaTest("Looking for a SimpleForm", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.ui.layout.form.SimpleForm",
							success: function (aSimpleForm) {
								if(aSimpleForm[0].getTitle() == "Find Movies") {
									assert.ok("The SimpleForm with the title 'Find Movies' was found");
								}
							},
							error: function () {
								assert.notOk("Could not find the 'Find Movies' SimpleForm in the app");
							}
						});
					});
					opaTest("Press the image and check MessageToast", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Image",
							success: function (aImage) {
								this.waitFor({
									id: aImage[1].getId(),
									actions:  function(oImage){
										oImage.firePress();
									},
									success: function () {
										return this.waitFor({
											pollingInterval: 100,
											check: function() {
												return !!document.getElementsByClassName("sapMMessageToast").length;
											},
											success: function() {
												assert.ok(" The message toast by pressing the image was displayed");
											},
											errorMessage: "The message toast by pressing the image was not displayed"
										});
									}
								});
							},
							error: function () {
								assert.notOk("Could not find a button");
							}
						});
					});
				},
				"w2u3": function () {
					opaTest("The App shows a planning calendar", function (Given, When, Then, assert)  {
						Then.waitFor({
							controlType: "sap.m.PlanningCalendar",
							success: function () {
								assert.ok("The App shows a calendar");
							},
							errorMessage : "The calendar wasn't found"
						});
					});

					opaTest("Planning calendar contains rows", function (Given, When, Then, assert)  {
						Then.waitFor({
							controlType: "sap.m.PlanningCalendar",
							matchers: new AggregationFilled({name: "rows"}),
							success: function () {
								assert.ok("The calendar contains rows");
							},
							errorMessage : "The calendar is empty"
						});
					});

					opaTest("Planning calendar shows movies", function (Given, When, Then, assert)  {
						Then.waitFor({
							controlType: "sap.m.PlanningCalendar",
							matchers: function (oCalendar) {
								return oCalendar.getRows("rows").every(function (oRow) {
									return oRow.getAppointments().length > 0;
								})
							},
							success: function () {
								assert.ok("The calendar shows showtimes");
							},
							errorMessage : "The calendar is empty or it contains an empty row"
						});
					});
					opaTest("User filters on city and genre", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.SearchField",
							actions: function (oSearchField) {
								oSearchField.setValue("Hamburg");
							},
							errorMessage: "The input city was not found"
						});
						When.waitFor({
							controlType: "sap.m.Select",
							actions: function (oSelect) {
								// exclude validator select
								if (oSelect.getItems()[0].getKey() !== "w0u0") { 
									oSelect.setSelectedKey("Action");
								}
							},
							errorMessage: "The select genre was not found"
						});
						When.waitFor({
							controlType: "sap.m.Button",
							matchers: new Properties({text: /Find Movie[s]?/}),
							actions: new Press(),
							errorMessage: "The button 'Find Movies' was not found or couldn't be pressed"
						});

						Then.waitFor({
							controlType : "sap.m.PlanningCalendar",
							matchers : fnCheckFilter,
							success : function() {
								assert.ok("The calendar has been filtered correctly");
							},
							errorMessage : "The calendar has not been filtered correctly"
						});

						function fnCheckFilter(oCalendar) {
							var fnIsFilteredOnActions = function (oElement) {
								if (!oElement.getBindingContext("movies")) {
									return false;
								} else {
									if (oElement.getProperty("text") === "Action") {
										return oElement.getAppointments().every(fnIsFilteredOnCity);
									} else {
										return false;
									}
								}
							};

							var fnIsFilteredOnCity = function (oElement) {
								if (!oElement.getBindingContext("movies")) {
									return false;
								} else {
									if (oElement.getProperty("title") === "Hamburg") {
										return true;
									} else {
										return false;
									}
								}
							};
							return oCalendar.getRows().every(fnIsFilteredOnActions);
						}
					});
				},
				"w2u4": function () {
					var sPath = "/movies/0/appointments/0";
					opaTest("Should press the first appointment", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.ui.unified.CalendarAppointment",
							matchers: new BindingPath({
								modelName: "movies",
								path: sPath
							}),
							actions: new Press(),
							success: function () {
								assert.ok("The appointment was clicked successfully");
							},
							errorMessage: "The appointment wasn't found or it isn't clickable"
						});
					});

					opaTest("Should navigate to the corresponding detail page", function (Given, When, Then, assert) {
						Then.waitFor({
							viewName: "opensap.movies.view.Detail",
							controlType: "sap.m.Page",
							matchers: function (oPage) {
								return oPage.getBindingContext("movies") && oPage.getBindingContext("movies").getPath() === sPath;
							},
							success: function () {
								assert.ok("The right detail page was displayed");
							},
							errorMessage: "The detail view wasn't found or didn't match the user selection"
						});
					});

					opaTest("The detail page should display a title", function (Given, When, Then, assert) {
						Then.waitFor({
							viewName: "opensap.movies.view.Detail",
							controlType : "sap.m.Page",
							matchers: function (oPage) {
								return oPage.getTitle().indexOf("Cine Castle") >= 0;
							},
							success: function () {
								assert.ok("The page showed the right title");
							},
							errorMessage: "The page does not have a title"
						})
					});

					opaTest("The detail page should display an image", function (Given, When, Then, assert) {
						Then.waitFor({
							viewName: "opensap.movies.view.Detail",
							controlType : "sap.m.Image",
							matchers: new Properties({src: /images\/CinemaHamburg.png$/}),
							success: function () {
								assert.ok("The page showed the right image");
							},
							errorMessage: "The page does not show an image"
						})
					});

					opaTest("The detail page should display an icon", function (Given, When, Then, assert) {
						Then.waitFor({
							viewName: "opensap.movies.view.Detail",
							controlType : "sap.ui.core.Icon",
							matchers: new PropertyStrictEquals({name: "src", value: "sap-icon://activate"}),
							success: function () {
								assert.ok("The page showed the right icon");
							},
							errorMessage: "The page does not show an icon"
						})
					});

					opaTest("The detail page should contain the 'cinemaAddress' label", function (Given, When, Then, assert) {
						Then.waitFor({
							viewName: "opensap.movies.view.Detail",
							controlType : "sap.m.Label",
							matchers: new I18NText({propertyName: "text", key: "cinemaAddress"}),
							success: function () {
								assert.ok("The page contains the 'cinemaAddress' label");
							},
							errorMessage: "The page does not contain the 'cinemaAddress' label"
						})
					});

					opaTest("The detail page should contain the 'seats' label", function (Given, When, Then, assert) {
						Then.waitFor({
							viewName: "opensap.movies.view.Detail",
							controlType : "sap.m.Label",
							matchers: new I18NText({propertyName: "text", key: "seats"}),
							success: function () {
								assert.ok("The page contains the 'seats' label");
							},
							errorMessage: "The page does not contain the 'seats' label"
						})
					});

					opaTest("The detail page should contain the 'cinemaAddress' text", function (Given, When, Then, assert) {
						Then.waitFor({
							viewName: "opensap.movies.view.Detail",
							controlType : "sap.m.Text",
							matchers: new PropertyStrictEquals({name: "text", value: "Spree Strasse 110, Hamburg"}),
							success: function () {
								assert.ok("The page contains the 'cinemaAddress' text");
							},
							errorMessage: "The page does not contain the 'cinemaAddress' text"
						})
					});

					opaTest("The detail page should contain the 'seats' text", function (Given, When, Then, assert) {
						Then.waitFor({
							viewName: "opensap.movies.view.Detail",
							controlType : "sap.m.Text",
							matchers: new PropertyStrictEquals({name: "text", value: "50 seats available"}),
							success: function () {
								assert.ok("The page contains the 'seats' text");
							},
							errorMessage: "The page does not contain the 'seats' text"
						})
					});

					opaTest("Should navigate back to the home page", function (Given, When, Then, assert) {
						When.waitFor({
							viewName: "opensap.movies.view.Detail",
							controlType: "sap.m.Page",
							actions: new Press(),
							success: function () {
								assert.ok("The back button was pressed");
							},
							errorMessage: "The back button could not be pressed"
						})
					});

					opaTest("The home page should appear", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType : "sap.m.Page",
							matchers: new Properties({title: "Watch Movies"}),
							success: function () {
								assert.ok("The home page appears");
							},
							errorMessage: "The home page could not be displayed"
						})
					});
				},
				"w2u4c": function () {
					opaTest("Should be on the home page", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.App",
							success: function () {
								assert.ok("The app showed the home page");
							},
							errorMessage: "Couldn't find the home page"
						});
					});

					opaTest("Should change the hash to something invalid", function (Given, When, Then, assert) {
						When.waitFor({
							actions: function () {
								location.hash = "/movies/0/appointments/99";
							},
							success: function () {
								assert.ok("The hash was updated successfully");
							},
							errorMessage: "Couldn't update the hash"
						});
					});

					opaTest("The not found page should appear when navigating to a non-existing showtime", function (Given, When, Then, assert) {
						Then.waitFor({
							viewName: "opensap.movies.view.NotFound",
							controlType:"sap.m.MessagePage",
							matchers: [
								new I18NText({propertyName: "title", key: "notFoundTitle"}),
								new I18NText({propertyName: "text", key: "notFoundText"})
							],
							success: function () {
								assert.ok("The not found page was displayed");
							},
							errorMessage: "The not found page wasn't displayed or doesn't show any content"
						});
					});

					opaTest("Should press the browser back button", function (Given, When, Then, assert) {
						When.waitFor({
							actions: function () {
								window.history.back();
							},
							success: function () {
								assert.ok("the back button was pressed");
							},
							errorMessage: "The back button could not be pressed"
						});
					});

					opaTest("The home page should appear", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.App",
							success: function () {
								assert.ok("The home page appeared");
							},
							errorMessage: "The home page could not be displayed"
						});
					});
				},
				"w2u5": function () {
					// check page 1
					opaTest("Should be on the home page", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.App",
							success: function () {
								assert.ok("The app showed the home page");
							},
							errorMessage: "Couldn't find the home page"
						});
					});

					opaTest("The home page should have a landmark aggregation", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Page",
							matchers: new AggregationFilled({name: "landmarkInfo"}),
							success: function () {
								assert.ok("Landmark aggregation on page is filled");
							},
							error: function () {
								assert.notOk("Could not find landmark aggregation on this page");
							}
						});
					});

					opaTest("The home page should be assigned to a landmark role", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Page",
							matchers: new AggregationFilled({name: "landmarkInfo"}),
							success: function (aPages) {
								aPages.forEach(function (oPage) {
									var oLandmarkInfo = oPage.getLandmarkInfo();
									if(oLandmarkInfo.getRootRole() === "Main") {
										assert.ok("Root container has role 'Main'");
									} else {
										assert.notOk("Page does not have the role 'Main'");
									}
								});
							},
							error: function () {
								assert.notOk("Could not find landmark aggregation on page");
							}
						});
					});
					opaTest("The content container of the home page should be assigned to a landmark role", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Page",
							matchers: new AggregationFilled({name: "landmarkInfo"}),
							success: function (aPages) {
								aPages.forEach(function (oPage) {
									var oLandmarkInfo = oPage.getLandmarkInfo();
									if(oLandmarkInfo.getContentRole() === "Region") {
										assert.ok("Content container has role 'Region'");
									} else {
										assert.notOk("Content container does not have the role 'Region'");
									}
								});
							},
							error: function () {
								assert.notOk("Could not find landmark aggregation on page");
							}
						});
					});
					opaTest("The footer container of the home page should be assigned to a landmark role", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Page",
							matchers: new AggregationFilled({name: "landmarkInfo"}),
							success: function (aPages) {
								aPages.forEach(function (oPage) {
									var oLandmarkInfo = oPage.getLandmarkInfo();
									if(oLandmarkInfo.getFooterRole() === "ContentInfo") {
										assert.ok("Footer container has role 'ContentInfo'");
									} else {
										assert.notOk("Footer container does not have the role 'ContentInfo'");
									}
								});
							},
							error: function () {
								assert.notOk("Could not find landmark aggregation on page");
							}
						});
					});
					opaTest("The header container of the home page should be assigned to a landmark role", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Page",
							matchers: new AggregationFilled({name: "landmarkInfo"}),
							success: function (aPages) {
								aPages.forEach(function (oPage) {
									var oLandmarkInfo = oPage.getLandmarkInfo();
									if(oLandmarkInfo.getHeaderRole() === "Region") {
										assert.ok("Header container has role 'Region'");
									} else {
										assert.notOk("Header container does not have the role 'Region'");
									}
								});
							},
							error: function () {
								assert.notOk("Could not find landmark aggregation on page");
							}
						});
					});

					// check page 2
					var sPath = "/movies/0/appointments/0";
					opaTest("Should press the first appointment", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.ui.unified.CalendarAppointment",
							matchers: new BindingPath({
								modelName: "movies",
								path: sPath
							}),
							actions: new Press(),
							success: function () {
								assert.ok("The appointment was clicked successfully");
							},
							errorMessage: "The appointment wasn't found or isn't clickable"
						});
					});

					opaTest("Should navigate to the corresponding detail page", function (Given, When, Then, assert) {
						Then.waitFor({
							viewName: "opensap.movies.view.Detail",
							controlType: "sap.m.Page",
							matchers: function (oPage) {
								return oPage.getBindingContext("movies") && oPage.getBindingContext("movies").getPath() === sPath;
							},
							success: function () {
								assert.ok("The correct detail page was displayed");
							},
							errorMessage: "Detail view wasn't found or didn't match the user selection"
						});
					});

					opaTest("The detail page should have a landmark aggregation", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Page",
							matchers: new AggregationFilled({name: "landmarkInfo"}),
							success: function () {
								assert.ok("Landmark aggregation on page is filled");
							},
							error: function () {
								assert.notOk("Could not find landmark aggregation on page");
							}
						});
					});

					opaTest("The detail page should be assigned to a landmark role", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Page",
							matchers: new AggregationFilled({name: "landmarkInfo"}),
							success: function (aPages) {
								aPages.forEach(function (oPage) {
									var oLandmarkInfo = oPage.getLandmarkInfo();
									if(oLandmarkInfo.getRootRole() === "Main") {
										assert.ok("Root container has role 'Main'");
									} else {
										assert.notOk("Page does not have the role 'Main'");
									}
								});
							},
							error: function () {
								assert.notOk("Could not find landmark aggregation on page");
							}
						});
					});
					opaTest("The content container of the detail page should be assigned to a landmark role", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Page",
							matchers: new AggregationFilled({name: "landmarkInfo"}),
							success: function (aPages) {
								aPages.forEach(function (oPage) {
									var oLandmarkInfo = oPage.getLandmarkInfo();
									if(oLandmarkInfo.getContentRole() === "Region") {
										assert.ok("Content container has role 'Region'");
									} else {
										assert.notOk("Content container does not have the role 'Region'");
									}
								});
							},
							error: function () {
								assert.notOk("Could not find landmark aggregation on page");
							}
						});
					});
					opaTest("The header container of the detail page should be assigned to a landmark role", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Page",
							matchers: new AggregationFilled({name: "landmarkInfo"}),
							success: function (aPages) {
								aPages.forEach(function (oPage) {
									var oLandmarkInfo = oPage.getLandmarkInfo();
									if(oLandmarkInfo.getHeaderRole() === "Region") {
										assert.ok("Header container has role 'Region'");
									} else {
										assert.notOk("Header container does not have the role 'Region'");
									}
								});
							},
							error: function () {
								assert.notOk("Could not find landmark aggregation on page");
							}
						});
					});

					opaTest("Should press the browser back button", function (Given, When, Then, assert) {
						When.waitFor({
							actions: function () {
								window.history.back();
							},
							success: function () {
								assert.ok("Back button was pressed");
							},
							errorMessage: "Back button could not be pressed"
						});
					});

					opaTest("The home page should appear", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.App",
							success: function () {
								assert.ok("The home page appeared");
							},
							errorMessage: "The home page could not be displayed"
						});
					});
				},
				"w3u1": function() {
					// test template generation by checking binding paths
					function testDataBinding(sCaption, sControlType, sBindingPath) {
						opaTest(sCaption, function (Given, When, Then, assert) {
							When.waitFor({
								controlType: sControlType,
								check : function (aLists) {
									return aLists.some(function(oList) {
										return oList.getBindingPath("items") == sBindingPath;
									});
								},
								success: function () {
									assert.ok("Correct binding");
								},
								error: function () {
									assert.notOk("Incorrect binding");
								}
							});
						});
					}
					testDataBinding("Master List", "sap.m.List", "/SalesOrderSet");
					testDataBinding("Detail Table", "sap.m.Table", "ToLineItems");
					// test translation by checking some texts in the properties file
					var oBundle;
					var pResourceBundle = ResourceBundle.create({
						url: "i18n/i18n.properties",
						async: true
					}).then(function(_oBundle) {
						oBundle = _oBundle
					});
					function testI18nKey(sCaption, aKeys, sValue) {
						opaTest(sCaption, function (Given, When, Then, assert) {
							When.iWaitForPromise(pResourceBundle);
							Then.waitFor({
								check: function () {
									return aKeys.every(function(sKey) {
										return oBundle.getText(sKey).toLowerCase().indexOf(sValue) > -1;
									});
								},
								success: function () {
									assert.ok("The text is correct.");
								},
								error: function () {
									assert.notOk("The text is not correct.");
								}
							});
						});
					}
					testI18nKey("SalesOrderSet", ["masterTitleCount", "masterSearchTooltip", "noObjectFoundText", "notAvailableViewTitle"], "order");
					testI18nKey("SalesOrderSetPlural", ["masterListNoDataText", "masterListNoDataWithFilterOrSearchText"], "orders");
					testI18nKey("ToLineItemsPlural", ["detailLineItemTableNoDataText"], "product");
					testI18nKey("LastColumnName", ["detailLineItemTableUnitNumberColumn"], "price");
					testI18nKey("CustomerName", ["masterSort1"], "customer");
				},
				"w3u1c": function() {
					opaTest("Add a logo", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.f.Avatar",
							check: function(aAvatars) {
								return aAvatars.some(function(oAvatar) {
									return !!oAvatar.getSrc();
								});
							},
							success: function () {
								assert.ok("sap.f.Avatar found");
							},
							error: function () {
								assert.notOk("sap.f.Avatar not found");
							}
						});
					});
					opaTest("Add title and claim", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.ObjectIdentifier",
							check: function(oIdentifier) {
								return oIdentifier.some(function(oIdentifier) {
									return oIdentifier.getTitle() && oIdentifier.getText();
								});
							},
							success: function () {
								assert.ok("sap.m.ObjectIdentifier found");
							},
							error: function () {
								assert.notOk("sap.m.ObjectIdentifier not found");
							}
						});
					});
				},
				"w3u2": function () {
					opaTest("Check for CreatedAt ObjectAttribute", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.ObjectAttribute",
							matchers: function (oObjectAttribute) {
								return oObjectAttribute.getBindingPath("text") === "CreatedAt";
							},
							success: function () {
								assert.ok("CreatedAt is correctly added to the master list");
							},
							error: function () {
								assert.notOk("CreatedAt is not added to the master list");
							}
						});
					});
					opaTest("Check for BusinessPartnerID ObjectAttribute", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.ObjectAttribute",
							matchers: function (oObjectAttribute) {
								return oObjectAttribute.getBindingPath("text") === "ToBusinessPartner/BusinessPartnerID";
							},
							success: function () {
								assert.ok("BusinessPartnerID is correclty added to the master list");
							},
							error: function () {
								assert.notOk("BusinessPartnerID is not added to the master list");
							}
						});
					});
					opaTest("Check for firstStatus aggregation", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.ObjectListItem",
							matchers: new AggregationFilled({
								name: "firstStatus"
							}),
							success: function () {
								assert.ok("firstStatus aggregation of the ObjectListItem control found");
							},
							error: function () {
								assert.notOk("firstStatus aggregation of the ObjectListItem control not found");
							}
						})
					});
					opaTest("Check for Country & City ObjectStatus", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.ObjectStatus",
							matchers: function (oObjectStatus) {
								return oObjectStatus.getBindingPath("title") === "ToBusinessPartner/Address/Country"
									&& oObjectStatus.getBindingPath("text") === "ToBusinessPartner/Address/City";
							},
							success: function () {
								assert.ok("Country & City information correctly rendered using firstStatus aggregation");
							},
							error: function () {
								assert.notOk("firstStatus aggregation missing OR Country and City binding path is incorrect");
							}
						});
					});
					opaTest("Check for Markers aggregation", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.ObjectListItem",
							matchers: new AggregationFilled({
								name: "markers"
							}),
							success: function () {
								assert.ok("markers aggragation of the ObjectListItem control found");
							},
							error: function () {
								assert.notOk("markers aggregation of the ObjectListItem control not found");
							}
						});
					});
					opaTest("Check for ObjectMarker control", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.ObjectMarker",
							matchers: function (oObjectMarker) {
								var sType = oObjectMarker.getType();
								return sType === "Flagged" || sType === "Favorite";
							},
							success: function () {
								assert.ok("ObjectMarker control is added to the master list");
							},
							error: function () {
								assert.notOk("ObjectMarker control is not added to the master list");
							}
						});
					});
				},
				"w3u3": function () {
					opaTest("Select a Customer", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							matchers : function (oList) {
								return oList.getItems()[0];
							},
							actions : new Press(),
							success: function () {
								assert.ok("Customer was selected");
							},
							error: function () {
								assert.notOk("Customer could not be found");
							}
						});
					});
					opaTest("Check for Order Item Table", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.Table",
							success: function () {
								assert.ok("Order Item Table is displayed");
							},
							error: function () {
								assert.notOk("Could not find a Order Item Table");
							}
						});
					});
					opaTest("Select Order Item", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.Table",
							matchers : function (oTable) {
								return oTable.getItems()[0];
							},
							actions : new Press(),
							success: function () {
								assert.ok("Order Item was selected");
							},
							error: function () {
								assert.notOk("Order Item could not be found");
							}
						});
					});
					opaTest("Check for Third Column", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.f.FlexibleColumnLayout",
							matchers: new PropertyStrictEquals({name: "layout", value: "ThreeColumnsMidExpanded"}),
							success: function () {
								assert.ok("Three Column Layout was found");
							},
							error: function () {
								assert.notOk("Three Column Layout was not found");
							}
						});
					});
					opaTest("Check for Product List", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.Page",
							success: function (aPages) {
								Then.waitFor({
									controlType: "sap.m.List",
									matchers : new sap.ui.test.matchers.Ancestor(aPages[0]),
									success: function () {
										assert.ok("Product List was found");
									},
									error: function () {
										assert.notOk("Product List could not be found");
									}
								});
							},
							error: function () {
								assert.notOk("No List could be found");
							}
						});
					});
				},
				"w3u4": function () {
					opaTest("Sticky property", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								When.waitFor({
									controlType: "sap.m.Table",
									check: function (aStatus) {
										return aStatus.some(function (oStatus) {
											return oStatus.getProperty("sticky")[0] === "ColumnHeaders" && oStatus.getProperty("sticky")[1] === "HeaderToolbar";
										});
									},
									success: function () {
										assert.ok("Sticky property set with value 'ColumnHeaders,HeaderToolbar'");
									},
									error: function () {
										assert.notOk("Sticky property not found or different value to it is set");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("Floating footer", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								When.waitFor({
									controlType: "sap.f.semantic.SemanticPage",
									matchers: [new PropertyStrictEquals({name: "showFooter", value: true}),
										new AggregationFilled({name: "positiveAction"}),
										new AggregationFilled({name: "negativeAction"}),
										new AggregationFilled({name: "footerCustomActions"})
									],
									success: function () {
										assert.ok("Floating footer found with a positive, negative and a custom action");
									},
									error: function () {
										assert.notOk("Floating footer not found or different set of actions is set");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("ObjectPage included", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								return When.waitFor({
									controlType: "sap.m.Table",
									actions: function (oTable) {
										oTable.fireSelectionChange({
											listItem : oTable.getItems()[0],
											listItems : oTable.getItems()
										})
									},
									success: function () {
										return When.waitFor({
											controlType: "sap.uxap.ObjectPageLayout",
											matchers: [
												new AggregationFilled({name: "headerTitle"}),
												new AggregationFilled({name: "headerContent"}),
												new AggregationFilled({name: "sections"})
											],
											success: function () {
												assert.ok("Object page layout found");
											},
											error: function () {
												assert.notOk("Object page layout not found");
											}
										});
									},
									error: function () {
										assert.notOk("Couldn't access the needed environment.");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("InfoLabel - text property", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								When.waitFor({
									controlType: "sap.tnt.InfoLabel",
									check: function (aInfoLabel) {
										return aInfoLabel.some(function (oInfoLabel) {
											return oInfoLabel.getBindingPath("text") === "LifecycleStatusDescription";
										});
									},
									success: function () {
										assert.ok("The InfoLabel was found with correct text property set");
									},
									error: function () {
										assert.notOk("InfoLabel not found or different value for the text property is set");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("InfoLabel - colorScheme property", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								When.waitFor({
									controlType: "sap.tnt.InfoLabel",
									check: function (aInfoLabel) {
										return aInfoLabel.some(function (oInfoLabel) {
											return oInfoLabel.getBindingPath("colorScheme") === "LifecycleStatusDescription";
										});
									},
									success: function () {
										assert.ok("The InfoLabel was found with correct colorScheme property set");
									},
									error: function () {
										assert.notOk("InfoLabel not found or different value for the colorScheme property is set");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("InfoLabel - colorScheme formatter", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								When.waitFor({
									controlType: "sap.tnt.InfoLabel",
									check: function (aInfoLabel) {
										return aInfoLabel.some(function (oInfoLabel) {
											return typeof oInfoLabel.getColorScheme() === "number";
										});
									},
									success: function () {
										assert.ok("The returned value of the formatter function is a number");
									},
									error: function () {
										assert.notOk("The returned value of the formatter function is not a number as expected");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("StatusIndicator - value property", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								When.waitFor({
									controlType: "sap.suite.ui.commons.statusindicator.StatusIndicator",
									check: function (aStatus) {
										return aStatus.some(function (oStatus) {
											return oStatus.getBindingPath("value") === "DeliveryDate";
										});
									},
									success: function () {
										assert.ok("The StatusIndicator was found with correctly bound to model value property");
									},
									error: function () {
										assert.notOk("StatusIndicator not found or the value property is not bound as expected");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("StatusIndicator - groups aggregation", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								When.waitFor({
									controlType: "sap.suite.ui.commons.statusindicator.StatusIndicator",
									check: function (aStatus) {
										return aStatus.some(function (oStatus) {
											return oStatus.getAggregation("groups").length;
										});
									},
									success: function () {
										assert.ok("The StatusIndicator was found with groups aggregation set");
									},
									error: function () {
										assert.notOk("StatusIndicator was not found or there isn't a group aggregation set");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("StatusIndicator - propertyThresholds aggregation", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								When.waitFor({
									controlType: "sap.suite.ui.commons.statusindicator.StatusIndicator",
									check: function (aStatus) {
										return aStatus.some(function (oStatus) {
											return oStatus.getAggregation("propertyThresholds").length;
										});
									},
									success: function () {
										assert.ok("The StatusIndicator was found with propertyThresholds aggregation set");
									},
									error: function () {
										assert.notOk("StatusIndicator was not found or there isn't a propertyThresholds aggregation set");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
				},
				"w3u4c": function () {
					opaTest("Controls used", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								return When.waitFor({
									controlType: "sap.m.Table",
									actions: function (oTable) {
										oTable.fireSelectionChange({
											listItem : oTable.getItems()[0],
											listItems : oTable.getItems()
										})
									},
									success: function () {
										return 	When.waitFor({
											controlType: "sap.uxap.ObjectPageLayout",
											check: function (aOPL) {
												var iNumberLabels = 0,
													iNumberObjectNumbers = 0,
													sControlName;

												return aOPL.some(function (oOPL) {
													return oOPL.getSections().some(function (oSection) {
														return oSection.getSubSections().some(function (oSubSection) {
															return oSubSection.getBlocks().some(function (oBlock) {
																oBlock.getContent().forEach(function(oControl) {
																	sControlName = oControl.getMetadata().getName();
																	if (sControlName === "sap.m.Label") {
																		iNumberLabels += 1;
																		return;
																	}
																	if (sControlName === "sap.m.ObjectNumber") {
																		iNumberObjectNumbers += 1;
																		return;
																	}
																});
																return iNumberLabels === 4 && iNumberObjectNumbers === 4;
															});
														});
													});
												});
											},
											success: function () {
												assert.ok("Correct controls are used");
											},
											error: function () {
												assert.notOk("Different control than expected found");
											}
										});
									},
									error: function () {
										assert.notOk("Couldn't access the needed environment.");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("Visual representaion", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								return When.waitFor({
									controlType: "sap.m.Table",
									actions: function (oTable) {
										oTable.fireSelectionChange({
											listItem : oTable.getItems()[0],
											listItems : oTable.getItems()
										})
									},
									success: function () {
										return 	When.waitFor({
											controlType: "sap.uxap.ObjectPageLayout",
											check: function (aOPL) {
												return aOPL.some(function (oOPL) {
													return oOPL.getSections().some(function (oSection) {
														return oSection.getSubSections().some(function (oSubSection) {
															return oSubSection.getBlocks().some(function (oBlock) {
																return oBlock.getMetadata().getName() === "sap.ui.layout.form.SimpleForm";
															});
														});
													});
												});
											},
											success: function () {
												assert.ok("Correct controls are used");
											},
											error: function () {
												assert.notOk("Different control than expected found");
											}
										});
									},
									error: function () {
										assert.notOk("Couldn't access the needed environment.");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
				},
				"w3u5": function() {
					// check structure
					function checkStructure(sId, sType) {
						opaTest("Check OrderPreparationsControl structure - Control '" + sType + "' with ID '" + sId + "'", function (Given, When, Then, assert) {
							When.waitFor({
								id: "container-orders---detail--orderPreparations",
								check: function(oOrderPreparations) {
									return oOrderPreparations.byId(sId).isA(sType);
								},
								success: function () {
									assert.ok("found");
								},
								error: function () {
									assert.notOk("not found");
								}
							});
						});
					}
					checkStructure("packItemsSwitch", "sap.m.Switch");
					checkStructure("printInvoiceSwitch", "sap.m.Switch");
					checkStructure("addSampleSwitch", "sap.m.Switch");
					checkStructure("confirm", "sap.m.Button");

					// check metadata
					function checkMetadata(fnCheck, sUut) {
						opaTest("Check OrderPreparationsControl metadata - " + sUut, function (Given, When, Then, assert) {
							When.waitFor({
								id: "container-orders---detail--orderPreparations",
								check: fnCheck,
								success: function () {
									assert.ok("found");
								},
								error: function () {
									assert.notOk("not found");
								}
							});
						});
					}
					checkMetadata(function(oOrderPreparations) {
						var aPropertyNames = Object.keys(oOrderPreparations.getMetadata().getAllProperties());
						return aPropertyNames.indexOf("switchStateItems") > -1;
					}, "Property 'switchStateItems'");
					checkMetadata(function(oOrderPreparations) {
						var aPropertyNames = Object.keys(oOrderPreparations.getMetadata().getAllProperties());
						return aPropertyNames.indexOf("switchStateInvoice") > -1;
					}, "Property 'switchStateInvoice'");
					checkMetadata(function(oOrderPreparations) {
						var aPropertyNames = Object.keys(oOrderPreparations.getMetadata().getAllProperties());
						return aPropertyNames.indexOf("switchStateSample") > -1;
					}, "Property 'switchStateSample'");
					checkMetadata(function(oOrderPreparations) {
						var aEventNames = Object.keys(oOrderPreparations.getMetadata().getAllEvents());
						return aEventNames.indexOf("confirm") > -1;
					}, "Event 'confirm'");
					checkMetadata(function(oOrderPreparations) {
						var aMethodNames = oOrderPreparations.getMetadata().getPublicMethods();
						return aMethodNames.indexOf("reset") > -1;
					}, "Method 'reset'");
					checkMetadata(function(oOrderPreparations) {
						return typeof oOrderPreparations._resetSwitches == "function";
					}, "Method '_resetSwitches'");
				},
				"w4u1": function () {
					opaTest("Toolbarspacer and button for opening the create view", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								When.waitFor({
									controlType: "sap.m.Table",
									check: function (aTable) {
										var oTableContent = aTable[0].getHeaderToolbar().getContent(),
											bToolbarSpacer = oTableContent.some(function (oControl) {
												return oControl.getMetadata().getName() === "sap.m.ToolbarSpacer";
											}),
											bButton = oTableContent.some(function (oControl) {
												return oControl.getMetadata().getName() === "sap.m.Button";
											});
										return bToolbarSpacer && bButton;
									},
									success: function () {
										assert.ok("Toolbarspacer and button found");
									},
									error: function () {
										assert.notOk("Toolbarspacer or button notfound");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("Loading create view", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								return When.waitFor({
									controlType: "sap.m.Table",
									actions: function (oTable) {
										oTable.getHeaderToolbar().getContent()[2].firePress();
									},
									success: function () {
										When.waitFor({
											controlType: "sap.uxap.ObjectPageLayout",
											success: function () {
												assert.ok("ObjectPageLayout found in create view");
											},
											error: function () {
												assert.notOk("ObjectPageLayout not found in create view");
											}
										});
									},
									error: function () {
										assert.notOk("Couldn't access the needed environment.");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("First ObjectPage section", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								return When.waitFor({
									controlType: "sap.m.Table",
									actions: function (oTable) {
										oTable.getHeaderToolbar().getContent()[2].firePress();
									},
									success: function () {
										When.waitFor({
											controlType: "sap.uxap.ObjectPageLayout",
											matchers: [
												new AggregationFilled({name: "sections"})
											],
											check: function (aOPL) {
												var iNumberLabels ,
													iNumberInputs,
													iNumberTextArea,
													sControlName;

												return aOPL.some(function (oOPL) {
													return oOPL.getSections().some(function (oSection) {
														iNumberLabels = 0;
														iNumberInputs = 0;
														iNumberTextArea = 0;

														return oSection.getSubSections().some(function (oSubSection) {
															return oSubSection.getBlocks().some(function (oBlock) {
																oBlock.getContent().forEach(function(oControl) {
																	sControlName = oControl.getMetadata().getName();
																	if (sControlName === "sap.m.Label") {
																		iNumberLabels += 1;
																		return;
																	}
																	if (sControlName === "sap.m.Input") {
																		iNumberInputs += 1;
																		return;
																	}
																	if (sControlName === "sap.m.TextArea") {
																		iNumberTextArea += 1;
																		return;
																	}
																});
																return iNumberLabels === 3 && iNumberInputs === 2 && iNumberTextArea === 1;
															});
														});
													});
												});
											},
											success: function () {
												assert.ok("Section and corresponcing controls in it found");
											},
											error: function () {
												assert.notOk("No section found or different controls in it than expected set");
											}
										});
									},
									error: function () {
										assert.notOk("Couldn't access the needed environment.");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("Second ObjectPage section", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								return When.waitFor({
									controlType: "sap.m.Table",
									actions: function (oTable) {
										oTable.getHeaderToolbar().getContent()[2].firePress();
									},
									success: function () {
										When.waitFor({
											controlType: "sap.uxap.ObjectPageLayout",
											matchers: [
												new AggregationFilled({name: "sections"})
											],
											check: function (aOPL) {
												var iNumberLabels,
													iNumberDatePicker,
													sControlName;

												return aOPL.some(function (oOPL) {
													return oOPL.getSections().some(function (oSection) {
														iNumberLabels = 0;
														iNumberDatePicker = 0;

														return oSection.getSubSections().some(function (oSubSection) {
															return oSubSection.getBlocks().some(function (oBlock) {
																oBlock.getContent().forEach(function(oControl) {
																	sControlName = oControl.getMetadata().getName();
																	if (sControlName === "sap.m.Label") {
																		iNumberLabels += 1;
																		return;
																	}
																	if (sControlName === "sap.m.DatePicker") {
																		iNumberDatePicker += 1;
																		return;
																	}
																});
																return iNumberLabels === 1 && iNumberDatePicker === 1;
															});
														});
													});
												});
											},
											success: function () {
												assert.ok("Section and corresponcing controls in it found");
											},
											error: function () {
												assert.notOk("No section found or different controls than expected in it set");
											}
										});
									},
									error: function () {
										assert.notOk("Couldn't access the needed environment.");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("Validation of TextArea (Note)", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								return When.waitFor({
									controlType: "sap.m.Table",
									actions: function (oTable) {
										oTable.getHeaderToolbar().getContent()[2].firePress();
									},
									success: function () {
										When.waitFor({
											controlType: "sap.m.TextArea",
											check: function (aTextArea) {
												var oTextArea = aTextArea[0];
												return oTextArea.getBindingPath("value") === "Note" &&  oTextArea.getBinding("value").getType().getMetadata().getName() === "sap.ui.model.type.String";
											},
											success: function () {
												assert.ok("Validation set correctly");
											},
											error: function () {
												assert.notOk("Validation set differently than expected");
											}
										});
									},
									error: function () {
										assert.notOk("Couldn't access the needed environment.");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("Validation of Input (ProductID))", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								return When.waitFor({
									controlType: "sap.m.Table",
									actions: function (oTable) {
										oTable.getHeaderToolbar().getContent()[2].firePress();
									},
									success: function () {
										When.waitFor({
											controlType: "sap.m.Input",
											check: function (aInput) {
												var oInput = aInput[0];
												return oInput.getBindingPath("value") === "ProductID" && oInput.getBinding("value").getType().getMetadata().getName() === "sap.ui.model.type.String";
											},
											success: function () {
												assert.ok("Validation set correctly");
											},
											error: function () {
												assert.notOk("Validation set differently than expected");
											}
										});
									},
									error: function () {
										assert.notOk("Couldn't access the needed environment.");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("Validation of Input (Quantity))", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								return When.waitFor({
									controlType: "sap.m.Table",
									actions: function (oTable) {
										oTable.getHeaderToolbar().getContent()[2].firePress();
									},
									success: function () {
										When.waitFor({
											controlType: "sap.m.Input",
											check: function (aInput) {
												return aInput[1].getBindingPath("value") === "Quantity";
											},
											success: function () {
												assert.ok("Validation set correctly");
											},
											error: function () {
												assert.notOk("Validation set differently than expected");
											}
										});
									},
									error: function () {
										assert.notOk("Couldn't access the needed environment.");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("Validation of DatePicker (DeliveryDate)", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								return When.waitFor({
									controlType: "sap.m.Table",
									actions: function (oTable) {
										oTable.getHeaderToolbar().getContent()[2].firePress();
									},
									success: function () {
										When.waitFor({
											controlType: "sap.m.DatePicker",
											check: function (aDP) {
												var oDP = aDP[0];
												return oDP.getBindingPath("value") === "DeliveryDate" && oDP.getBinding("value").getType().getMetadata().getName() === "sap.ui.model.type.DateTime";
											},
											success: function () {
												assert.ok("Validation set correctly");
											},
											error: function () {
												assert.notOk("Validation set differently than expected");
											}
										});
									},
									error: function () {
										assert.notOk("Couldn't access the needed environment.");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("ObjectPage footer", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								return When.waitFor({
									controlType: "sap.m.Table",
									actions: function (oTable) {
										oTable.getHeaderToolbar().getContent()[2].firePress();
									},
									success: function () {
										When.waitFor({
											controlType: "sap.uxap.ObjectPageLayout",
											matchers: [
												new AggregationFilled({name: "footer"})
											],
											check: function (aOPL) {
												var iNumberButtons = 0,
													iNumberToolbarSpacer = 0,
													sControlName;

												return aOPL.some(function (oOPL) {
													oOPL.getFooter().getContent().forEach(function(oControl) {
														sControlName = oControl.getMetadata().getName();
														if (sControlName === "sap.m.Button") {
															iNumberButtons += 1;
															return;
														}
														if (sControlName === "sap.m.ToolbarSpacer") {
															iNumberToolbarSpacer += 1;
															return;
														}
													});
													return iNumberButtons >= 2 && iNumberToolbarSpacer >= 1;
												});
											},
											success: function () {
												assert.ok("Footer and corresponding controls in it found");
											},
											error: function () {
												assert.notOk("No footer found or different controls than expected in it set");
											}
										});
									},
									error: function () {
										assert.notOk("Couldn't access the needed environment.");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("Canceling a creation of an entry", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								return When.waitFor({
									controlType: "sap.m.Table",
									actions: function (oTable) {
										oTable.getHeaderToolbar().getContent()[2].firePress();
									},
									success: function () {
										When.waitFor({
											controlType: "sap.uxap.ObjectPageLayout",
											check: function (aOPL) {
												return aOPL.some(function (oOPL) {
													return oOPL.getFooter().getContent()[3].firePress();
												});
											},
											success: function () {
												return this.waitFor({
													controlType: "sap.f.FlexibleColumnLayout",
													matchers: new PropertyStrictEquals({name: "layout", value: "TwoColumnsMidExpanded"}),
													success: function () {
														assert.ok("Two Column FCL Layout triggered");
													},
													error: function () {
														assert.notOk("Different than expected FCL layout found");
													}
												});
											},
											error: function () {
												assert.notOk("No MessagePopover found");
											}
										});
									},
									error: function () {
										assert.notOk("Couldn't access the needed environment.");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("MessagePopover button", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								return When.waitFor({
									controlType: "sap.m.Table",
									actions: function (oTable) {
										oTable.getHeaderToolbar().getContent()[2].firePress();
									},
									success: function () {
										When.waitFor({
											controlType: "sap.uxap.ObjectPageLayout",
											check: function (aOPL) {
												var iNumberButtons = 0;
												return aOPL.some(function (oOPL) {
													oOPL.getFooter().getContent().forEach(function (oControl) {
														if (oControl.getMetadata().getName() === "sap.m.Button") {
															iNumberButtons += 1;
														}
													});
													return iNumberButtons >= 3;
												});
											},
											success: function () {
												assert.ok("MessagePopover button found");
											},
											error: function () {
												assert.notOk("MessagePopover button not found");
											}
										});
									},
									error: function () {
										assert.notOk("Couldn't access the needed environment.");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("MessagePopover in dependents aggregation", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								return When.waitFor({
									controlType: "sap.m.Table",
									actions: function (oTable) {
										oTable.getHeaderToolbar().getContent()[2].firePress();
									},
									success: function () {
										When.waitFor({
											controlType: "sap.uxap.ObjectPageLayout",
											matchers: [
												new AggregationFilled({name: "dependents"})
											],
											check: function (aOPL) {
												return aOPL.some(function (oOPL) {
													return oOPL.getDependents().some(function (oControl) {
														return oControl.getMetadata().getName() === "sap.m.MessagePopover";
													});
												});
											},
											success: function () {
												assert.ok("MessagePopover in the ObjectPageLayout as dependents aggregation found");
											},
											error: function () {
												assert.notOk("No MessagePopover found");
											}
										});
									},
									error: function () {
										assert.notOk("Couldn't access the needed environment.");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
					opaTest("Creation of an entry", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.List",
							actions: function (oList) {
								oList.getItems()[0].firePress();
							},
							success: function () {
								return When.waitFor({
									controlType: "sap.m.Table",
									actions: function (oTable) {
										oTable.getHeaderToolbar().getContent()[2].firePress();
									},
									success: function () {
										When.waitFor({
											controlType: "sap.m.Table",
											success: function (aTables) {
												var iItemsLength = aTables[0].getItems().length;
												return this.waitFor({
													controlType: "sap.uxap.ObjectPageLayout",
													actions: function (oOPL) {
														return oOPL.getSections().some(function (oSection) {
															return oSection.getSubSections().some(function (oSubSection) {
																return oSubSection.getBlocks().some(function (oBlock) {
																	return oBlock.getContent()[1].setValue("HT-1000");
																});
															});
														});
													},
													success: function (aOPL) {
														return this.waitFor({
															id: aOPL[0].getFooter().getContent()[2].getId(),
															actions: new Press(),
															success: function () {
																return this.waitFor({
																	controlType: "sap.m.Table",
																	check: function (aTables) {
																		return aTables[0].getItems().length > iItemsLength;
																	},
																	success: function () {
																		assert.ok("Item was created successfully");
																	},
																	error: function () {
																		assert.ok("Failed to created the item");
																	}
																});
															},
															error: function () {
																assert.notOk("Could not find the save button in the footer");
															}
														});
													},
													error: function () {
														assert.notOk("No ObjectPageLayout found");
													}
												});
											},
											error: function () {
												assert.notOk("No Table found");
											}
										});
									},
									error: function () {
										assert.notOk("Couldn't access the needed environment.");
									}
								});
							},
							error: function () {
								assert.notOk("Couldn't access the needed environment.");
							}
						});
					});
				},
				"w4u2": function () {
					opaTest("Select a Customer", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.ObjectListItem",
							check: function (aObjectListItems) {
								return aObjectListItems.find(function (oItem) {
									return parseInt(oItem.getProperty("number"), 10) > 0;
								});
							},
							actions: new Press(),
							success: function () {
								assert.ok("Customer was selected");
							},
							error: function () {
								assert.notOk("Customer could not be found");
							}
						});
					});
					opaTest("Check if items are draggable", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.Table",
							check: function (aTables) {
								var aTableDragDropConfig = aTables[0].getDragDropConfig();
								return aTableDragDropConfig.length && aTableDragDropConfig[0].getSourceAggregation() === "items";
							},
							success: function () {
								assert.ok("Items in the table are draggable");
							},
							error: function () {
								assert.notOk("Items in the table are not draggable");
							}
						});
					});
					opaTest("Check if DeleteButton is droppable", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.Button",
							check: function (aButtons) {
								return aButtons.find(function (oButton) {
									return oButton.getMetadata().getDragDropInfo().droppable === true;
								});
							},
							success: function () {
								assert.ok("DeleteButton control is droppable");
							},
							error: function () {
								assert.notOk("DeleteButton control is not droppable");
							}
						});
					});
					opaTest("Check if DeleteButton has drop event listener", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.Button",
							check: function (aButtons) {
								var oDeleteButton = aButtons.find(function (oButton) {
									return oButton.getMetadata().getDragDropInfo().droppable === true;
								});
								var aDeleteButtonDragDropConfig = oDeleteButton.getDragDropConfig();
								return aDeleteButtonDragDropConfig.length && aDeleteButtonDragDropConfig[0].hasListeners("drop")
							},
							success: function () {
								assert.ok("DeleteButton control has a drop event listener");
							},
							error: function () {
								assert.notOk("DeleteButton control does not have a drop event listener");
							}
						});
					});
					opaTest("Drag table item and drop on the DeleteButton", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.ColumnListItem",
							success: function (aItems) {
								var oItem = aItems[0],
									oTable = aItems[0].getParent(),
									oDeleteButton = oTable.getHeaderToolbar().getContent().filter(function (oControl) {
										return oControl.getMetadata().getDragDropInfo().droppable === true;
									})[0];
								// simulate drag and drop event
								var oDragStartEvent = new DragEvent("dragstart", {bubbles: true, cancelable: true});
								oItem.getDomRef().dispatchEvent(oDragStartEvent);
								var oDragEnterEvent = new DragEvent("dragenter", {bubbles: true, cancelable: true});
								oDeleteButton.getDomRef().dispatchEvent(oDragEnterEvent);
								var oDropEvent = new DragEvent("drop", {bubbles: true, cancelable: true});
								oDeleteButton.getDomRef().dispatchEvent(oDropEvent);
								return this.waitFor({
									controlType: "sap.m.Dialog",
									check: function (aDialog) {
										return aDialog[0].getType() === "Message";
									},
									success: function (aDialog) {
										assert.ok("Delete confirmation MessageBox opened");
										// to close the MessageBox, deletion on item is tested later
										aDialog[0].getButtons()[1].firePress();
									},
									error: function () {
										assert.notOk("Delete confirmation MessageBox not open");
									}
								});
							},
							error: function () {
								assert.notOk("sap.m.ColumnListItem control not found");
							}
						});
					});
					opaTest("Check if DeleteButton has press event listener", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.Button",
							check: function (aButtons) {
								var oDeleteButton = aButtons.find(function (oButton) {
									return oButton.getMetadata().getDragDropInfo().droppable === true;
								});
								return oDeleteButton.hasListeners("press");
							},
							success: function () {
								assert.ok("DeleteButton control has a press event listener");
							},
							error: function () {
								assert.notOk("DeleteButton control does not have a press event listener");
							}
						});
					});
					opaTest("Check if MessageBox opens after delete action", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.Button",
							success: function (aButtons) {
								var oDeleteButton = aButtons.find(function (oButton) {
									return oButton.getMetadata().getDragDropInfo().droppable === true;
								});
								return this.waitFor({
									id: oDeleteButton.getId(),
									actions: new Press(),
									success: function () {
										return this.waitFor({
											controlType: "sap.m.Dialog",
											check: function (aDialog) {
												return aDialog[0].getType() === "Message";
											},
											success: function () {
												assert.ok("Delete confirmation MessageBox opened");
											},
											error: function () {
												assert.notOk("Delete confirmation MessageBox not open");
											}
										});
									},
									error: function () {
										assert.notOk("Delete confirmation MessageBox not opened");
									}
								});
							},
							error: function () {
								assert.notOk("DeleteButton control not found");
							}
						});
					});
					opaTest("Check if the item in the table is deleted", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.Table",
							success: function (aTables) {
								var iItemsLength = aTables[0].getItems().length;
								return this.waitFor({
									controlType: "sap.m.Dialog",
									success: function (aDialog) {
										return this.waitFor({
											id: aDialog[0].getButtons()[0].getId(),
											actions: new Press(),
											success: function () {
												return this.waitFor({
													controlType: "sap.m.Table",
													check: function (aTables) {
														return aTables[0].getItems().length < iItemsLength;
													},
													success: function () {
														assert.ok("Item was deleted successfully");
													},
													error: function () {
														assert.ok("Failed to delete the item");
													}
												});
											},
											error: function () {
												assert.notOk("OK button of MessageBox not found");
											}
										});
									},
									error: function () {
										assert.notOk("MessageBox not found");
									}
								});
							},
							error: function () {
								assert.notOk("Table not found");
							}
						});
					});
				},
				"w4u2c": function () {
					opaTest("Select a Customer", function (Given, When, Then, assert) {
						When.waitFor({
							controlType: "sap.m.ObjectListItem",
							check: function (aObjectListItems) {
								return aObjectListItems.find(function (oItem) {
									return parseInt(oItem.getProperty("number"), 10) > 0;
								});
							},
							actions: new Press(),
							success: function () {
								assert.ok("Customer was selected");
							},
							error: function () {
								assert.notOk("Customer could not be found");
							}
						});
					});
					opaTest("Check if items within the Table are draggable and droppable", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.Table",
							check: function (aTables) {
								var aTableDragDropConfig = aTables[0].getDragDropConfig();
								return aTableDragDropConfig.length
									&& aTableDragDropConfig[0].getSourceAggregation() === "items"
									&& aTableDragDropConfig[0].getTargetAggregation() === "items";
							},
							success: function () {
								assert.ok("Items within the table are draggable and droppable");
							},
							error: function () {
								assert.notOk("Items within the table are not draggable and droppable");
							}
						});
					});
					opaTest("Check if Table has a drop event listener", function (Given, When, Then, assert) {
						Then.waitFor({
							controlType: "sap.m.Table",
							check: function (aTables) {
								var aTableDragDropConfig = aTables[0].getDragDropConfig();
								return aTableDragDropConfig.length && aTableDragDropConfig[0].hasListeners("drop");
							},
							success: function () {
								assert.ok("Table control has a drop event listener");
							},
							error: function () {
								assert.notOk("Table control does not have a drop event listener");
							}
						});
					});
				},
				"w5u1": function () {
					opaTest("Check variants", function (Given, When, Then, assert) {
						When.waitFor({
							//controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
							//id: "SalesOrders::sap.suite.ui.generic.template.ListReport.view.ListReport::SalesOrderSet--listReport-variant",
							id: "SalesOrders::sap.suite.ui.generic.template.ListReport.view.ListReport::SalesOrderSet--template::ListReport::TableToolbar",
							matchers: function (oTableToolbar) {
								var bVariantFound = false;
								var aContent = oTableToolbar && oTableToolbar.getContent && oTableToolbar.getContent();
								if (aContent){
									for (var obj in aContent){
										var oContent = aContent[obj];
										var oMeta = oContent && oContent.getMetadata && oContent.getMetadata();
										var sName = oMeta && oMeta.getName && oMeta.getName();
										if (sName === "sap.ui.comp.smartvariants.SmartVariantManagement"){
											//if the table toolbar conaints the SmartVariantManagement it was not removed
											bVariantFound = true;
											break;
										}
									}
								}
								if (bVariantFound){
									return false; //wrong one need to remove it
								} else {
									return true;
								}
							},
							success: function () {
								assert.ok("Setting 'smartVariantManagement' was successfully applied, which lead to a removal of the table variant.");
							},
							error: function () {
								assert.notOk("Table variant is still enabled. Check the manifest setting 'smartVariantManagement' to remove it.");
							}
						});
					});
				},
				"w5u2": function () {
					opaTest("Ensure being on the List Report", function (Given, When, Then, assert) {
						When.waitFor({
							id: "SalesOrders::sap.suite.ui.generic.template.ListReport.view.ListReport::SalesOrderSet",
							success: function () {
								assert.ok("You are on the List Report");
							},
							error: function () {
								assert.notOk("Have you navigated to the List Report of the SalesOrders application from Week 5? Did you use the project name SalesOrders?");
							}
						});
					});
					opaTest("Analyzing filter bar", function (Given, When, Then, assert) {
						When.waitFor({
							id: "SalesOrders::sap.suite.ui.generic.template.ListReport.view.ListReport::SalesOrderSet--listReportFilter-filterItem-___INTERNAL_-SalesOrderID",
							success: function () {
								assert.ok("Filter bar with Sales Order ID filed is found.");
							},
							error: function () {
								assert.notOk(
									"Filter bar with Sales Order ID filed not found. Annotation 'UI.SelectionFields' might be missing or configured incorrectly. Compare your annotation file with annotation increment for Exercise 3"
								);
							}
						});
					});
					opaTest("Analyzing table - Sales Order ID column", function (Given, When, Then, assert) {
						When.waitFor({
							id: "SalesOrders::sap.suite.ui.generic.template.ListReport.view.ListReport::SalesOrderSet--listReport-SalesOrderID",
							success: function () {
								assert.ok("Sales Order ID column is found.");
							},
							error: function () {
								assert.notOk(
									"Sales Order ID column not found. UI.DataField with value 'SalesOrderID' might be missing. Compare your annotation file with annotation increment for Exercise 2."
								);
							}
						});
					});
					opaTest("Analyzing table - Company column", function (Given, When, Then, assert) {
						When.waitFor({
							id: "SalesOrders::sap.suite.ui.generic.template.ListReport.view.ListReport::SalesOrderSet--listReport-CustomerName",
							success: function () {
								assert.ok("Company column is found.");
							},
							error: function () {
								assert.notOk(
									"Company column not found. UI.DataField with value 'CustomerName'  might be missing. Compare your annotation file with annotation increment for Exercise 2."
								);
							}
						});
					});
					opaTest("Analyzing table - Lifecycle Status column", function (Given, When, Then, assert) {
						When.waitFor({
							id: "SalesOrders::sap.suite.ui.generic.template.ListReport.view.ListReport::SalesOrderSet--listReport-LifecycleStatusDescription",
							success: function () {
								assert.ok("Lifecycle Status column is found.");
							},
							error: function () {
								assert.notOk(
									"Column based on value 'LifecycleStatusDescription' not found. UI.DataField with value 'LifecycleStatusDescription' might be missing or configured incorrectly. Compare your annotation file with annotation increment for Exercise 3a."
								);
							}
						});
					});
					opaTest("Analyzing table - Net Amount column", function (Given, When, Then, assert) {
						When.waitFor({
							id: "SalesOrders::sap.suite.ui.generic.template.ListReport.view.ListReport::SalesOrderSet--listReport-NetAmount",
							success: function () {
								assert.ok("Net Amount column is found.");
							},
							error: function () {
								assert.notOk(
									"Net Amount column not found. UI.DataField with value 'NetAmount' might be missing. Compare your annotation file with annotation increment for Exercise 2."
								);
							}
						});
					});
				},
				"w5u2a": function () {
					opaTest("Ensure being on the Object Page ", function (Given, When, Then, assert) {
						When.waitFor({
							id: "SalesOrders::sap.suite.ui.generic.template.ObjectPage.view.Details::SalesOrderSet",
							success: function () {
								assert.ok("You are on the Object Page");
							},
							error: function () {
								assert.notOk("Have you navigated to the Object Page of the of the SalesOrders application from Week 5? Did you use the project name SalesOrders?");
							}
						});
					});
					opaTest("Ensure being on the Object Page ", function (Given, When, Then, assert) {
						When.waitFor({
							id: "SalesOrders::sap.suite.ui.generic.template.ObjectPage.view.Details::SalesOrderSet",
							success: function () {
								assert.ok("You are on the Object Page");
							},
							error: function () {
								assert.notOk("Have you navigated to the Object Page of the of the SalesOrders application from Week 5? Did you use the project name SalesOrders?");
							}
						});
					});
					opaTest("Analyzing Object Page sections - Customer Information", function (Given, When, Then, assert) {
						When.waitFor({
							id: "SalesOrders::sap.suite.ui.generic.template.ObjectPage.view.Details::SalesOrderSet--com.sap.vocabularies.UI.v1.FieldGroup::SalesOrderCustomer::CustomerName::Field-text",
							success: function () {
								assert.ok("Customer Information section with a data field based on value 'CustomerName' is found.");
							},
							error: function () {
								assert.notOk(
									"Customer Information section with a field based on value 'CustomerName' not found. Annotation 'UI.Facets' or 'UI.FieldGroup' might be missing or configured incorrectly. Compare your annotation file with annotation increment for Exercises 5 and 6."
								);
							}
						});
					});
					opaTest("Analyzing Object Page sections - Sales Order Items", function (Given, When, Then, assert) {
						When.waitFor({
							id: "SalesOrders::sap.suite.ui.generic.template.ObjectPage.view.Details::SalesOrderSet--ToLineItems::com.sap.vocabularies.UI.v1.LineItem::Table-ProductID",
							success: function () {
								assert.ok("Sales Order Items section containing table with Product ID column is found.");
							},
							error: function () {
								assert.notOk(
									"Sales Order Items section with table containing Product ID column not found. Annotation 'UI.Facets' or 'UI.LineItem' might be missing or configured incorrectly. Compare your annotation file with annotation increment for Exercises 7 and 8."
								);
							}
						});
					});
				},
				"w5u2c": function () {
					opaTest("Ensure being on the Object Page", function (Given, When, Then, assert) {
						When.waitFor({
							id: "SalesOrders::sap.suite.ui.generic.template.ObjectPage.view.Details::SalesOrderSet",
							success: function () {
								assert.ok("You are on the Object Page");
							},
							error: function () {
								assert.notOk("Have you navigated to the Object Page of the of the SalesOrders application from Week 5? Did you use the project name SalesOrders?");
							}
						});
					});
					opaTest("Analyzing Object Page header", function (Given, When, Then, assert) {
						When.waitFor({
							id: "SalesOrders::sap.suite.ui.generic.template.ObjectPage.view.Details::SalesOrderSet--header::headerEditable::com.sap.vocabularies.UI.v1.DataPoint::ProgressIndicatorVBox",
							success: function () {
								assert.ok("Progress indicator for value 'NetAmount' is found.");
							},
							error: function () {
								assert.notOk(
									"Progress indicator for value 'NetAmount' not found. Annotation 'UI.DataPoint' or 'UI.HeaderFacets' might be missing, configured incomplete or incorrectly.");
							}
						});
					});
				},
				"w5u3": function () {
					opaTest("Ensure being on the List Report", function (Given, When, Then, assert) {
						When.waitFor({
							id: "SalesOrders::sap.suite.ui.generic.template.ListReport.view.ListReport::SalesOrderSet",
							success: function () {
								assert.ok("You are on the List Report");
							},
							error: function () {
								assert.notOk("Have you navigated to the List Report of the SalesOrders application from Week 5? Did you use the project name SalesOrders?");
							}
						});
					});
					opaTest("Find the Export to Spreadsheet button in the SmartTable control ", function (Given, When, Then, assert) {
						When.waitFor({
							id: "SalesOrders::sap.suite.ui.generic.template.ListReport.view.ListReport::SalesOrderSet--listReport",
							matchers: new Properties({
								useExportToExcel: true
							}),
							success: function () {
								assert.ok("Smart table's Export to Spreadsheet feature is switched on");
							},
							error: function () {
								assert.notOk("Could not find the Smart table's Export to Spreadsheet button. Did you create the property change?");
							}
						});
					});
				},
				"w5u6a": function () {
					opaTest("Ensure being on the List Report ", function (Given, When, Then, assert) {
						When.waitFor({
							id: "nw.epm.refapps.st.prod.manage::sap.suite.ui.generic.template.ListReport.view.ListReport::SEPMRA_C_PD_Product",
							success: function () {
								assert.ok("You are on the List Report");
							},
							error: function () {
								assert.notOk("Have you navigated to the List Report of the opensap.manage.products adaptation project? Did you use the project name opensap.manage.products?");
							}
						});
					});
					opaTest("Share by Email button ", function (Given, When, Then, assert) {
						When.waitFor({
							id: "nw.epm.refapps.st.prod.manage::sap.suite.ui.generic.template.ListReport.view.ListReport::SEPMRA_C_PD_Product--customer.opensap.manage.products.shareByEmail",
							matchers: function(oButton){
								//button should have translated text, so the text property should be replaced by something different than its i18n key.
								var sText = oButton.getText();
								return sText !== "SHARE_BY_EMAIL";
							},
							success: function () {
								assert.ok("Share by Email button got added");
							},
							error: function () {
								assert.notOk("Could not find the Share by Email button. Did you create the add fragment change? Does the button has the ID 'shareByEmail'? Did you provide the translated text?");
							}
						});
					});
					opaTest("Having a controller extension ", function (Given, When, Then, assert) {
						When.waitFor({
							id: "nw.epm.refapps.st.prod.manage::sap.suite.ui.generic.template.ListReport.view.ListReport::SEPMRA_C_PD_Product",
							success: function (oView) {
								var oController = oView.getController();
								assert.strictEqual(!!oController.extension.customer.opensap.manage.products.ListReport, true, "You have a controller extension");
							},
							error: function () {
								assert.notOk("No controller extension found with the assumed namespace. Did you create a controller extension? Is it called customer.opensap.manage.products.ListReport?");
							}
						});
					});
				},
				"w5u6b": function () {
					opaTest("Ensure being on the Object Page ", function (Given, When, Then, assert) {
						When.waitFor({
							id: "nw.epm.refapps.st.prod.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product",
							success: function () {
								assert.ok("You are on the Object Page");
							},
							error: function () {
								assert.notOk("Have you navigated to the Object Page of the opensap.manage.products adaptation project? Did you use the project name opensap.manage.products?");
							}
						});
					});
					opaTest("Find the Supplier Section ", function (Given, When, Then, assert) {
						When.waitFor({
							id: "nw.epm.refapps.st.prod.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--customer.opensap.manage.products.supplierSection",
							success: function () {
								assert.ok("Supplier Section got added");
							},
							error: function () {
								assert.notOk("Could not find the Supplier Section. Did you create the add fragment change? Does the section has the ID 'supplierSection'?");
							}
						});
					});
					opaTest("Find the Map ", function (Given, When, Then, assert) {
						When.waitFor({
							id: "nw.epm.refapps.st.prod.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--customer.opensap.manage.products.supplierMap",
							success: function () {
								assert.ok("Supplier Map got added");
							},
							error: function () {
								assert.notOk("Could not find the Supplier Map . Did you create the add fragment change? Does the map has the ID 'supplierMap'?");
							}
						});
					});
					opaTest("Having a controller extension ", function (Given, When, Then, assert) {
						When.waitFor({
							id: "nw.epm.refapps.st.prod.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product",
							success: function (oView) {
								var oController = oView.getController();
								assert.strictEqual(!!oController.extension.customer.opensap.manage.products.ObjectPage, true, "You have a controller extension");
							},
							error: function () {
								assert.notOk("No controller extension found with the assumed namespace. Did you create a controller extension? Is it called customer.opensap.manage.products.ObjectPage?");
							}
						});
					});
					opaTest("Map Configuration", function (Given, When, Then, assert) {
						When.waitFor({
							id: "nw.epm.refapps.st.prod.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--customer.opensap.manage.products.supplierMap",
							matchers: function(oMap){
								return oMap.getMapConfiguration() && oMap.getMapConfiguration().MapProvider[0].name === "OSM";
							},
							success: function () {
								assert.ok("Map got configured to use OpenStreetMap as map provider");
							},
							error: function () {
								assert.notOk("Could not find the correct map configuration. Please check the sample solution's controller extension code");
							}
						});
					});
					opaTest("Map Binding", function (Given, When, Then, assert) {
						When.waitFor({
							id: "nw.epm.refapps.st.prod.manage::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--customer.opensap.manage.products.supplierMap",
							matchers: function(oMap){
								return oMap.isBound("initialPosition");
							},
							success: function () {
								assert.ok("'initialPosition' property is bound");
							},
							error: function () {
								assert.notOk("Could not find a binding for 'initialPosition' property. Please check the sample solution's controller extension code");
							}
						});
					});
				},
				"w5u6c": function () {
					opaTest("Ensure being on the List Report ", function (Given, When, Then, assert) {
						When.waitFor({
							id: "nw.epm.refapps.st.prod.manage::sap.suite.ui.generic.template.ListReport.view.ListReport::SEPMRA_C_PD_Product",
							success: function () {
								assert.ok("You are on the List Report");
							},
							error: function () {
								assert.notOk("Have you navigated to the List Report of the opensap.manage.products adaptation project? Did you use the project name opensap.manage.products?");
							}
						});
					});
					opaTest("Find Dimension Filter ", function (Given, When, Then, assert) {
						When.waitFor({
							id: "nw.epm.refapps.st.prod.manage::sap.suite.ui.generic.template.ListReport.view.ListReport::SEPMRA_C_PD_Product--listReportFilter",
							matchers: function(oFilterBar){
								var aControlConfigurations = oFilterBar.getControlConfiguration();
								//there shouuld be a new control configuration that has the ID prefix for add fragment changes
								return aControlConfigurations.some(function(oControlConfiguration){
									return oControlConfiguration.getId().indexOf("customer.opensap.manage.products") !== -1;
								});
							},
							success: function () {
								assert.ok("Dimension Filter found");
							},
							error: function () {
								assert.notOk("Could not find the Dimension Filter in the Smart Filterbar. Did you create the add a fragment to the control configuration aggregation?");
							}
						});
					});
					opaTest("Checking the controller extension ", function (Given, When, Then, assert) {
						When.waitFor({
							id: "nw.epm.refapps.st.prod.manage::sap.suite.ui.generic.template.ListReport.view.ListReport::SEPMRA_C_PD_Product",
							matchers: function (oView) {
								var oController = oView.getController();
								//internal (illegal) access to the controller extension instance
								var mOverrides = oController._sapui_Extensions
									&& oController._sapui_Extensions["customer.opensap.manage.products.ListReport"]
									&& oController._sapui_Extensions["customer.opensap.manage.products.ListReport"].extension.getMetadata().getOverrides();
								var bHasOverridenMethod = !!(
									mOverrides
									&& mOverrides.templateBaseExtension
									&& mOverrides.templateBaseExtension.addFilters
								);
								return bHasOverridenMethod;
							},
							success: function () {
								assert.ok("You have overridden the 'addFilters' method");
							},
							error: function () {
								assert.notOk("Couldn't find an override for the 'addFilters' method in the controller extension. Did you create a controller extension? Is it called customer.opensap.manage.products.ListReport? Did you override the 'addFilters' method  from the 'templateBaseExtension'? ");
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
