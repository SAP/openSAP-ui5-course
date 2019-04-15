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
	"sap/ui/core/Icon"
], function (Opa, Opa5, Press, EnterText, AggregationFilled, PropertyStrictEquals, Properties, Ancestor, BindingPath, I18NText, Button, Icon) {
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
							"key": "w3u3",
							"text": "Week 3 Unit 3"
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
				//	fnReopenPopover();

					var promise = Opa.emptyQueue();
					promise.done(function () {
						Opa.assert = undefined;
						Opa5.assert = undefined;
				//		fnReopenPopover();
						fnRemoveTestBusy(assert.testName);
					});

					promise.fail(function () {
						Opa.assert = undefined;
						Opa5.assert = undefined;
					//	fnReopenPopover();
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
								src:"images/MoviesHeader.png"
								}
							),

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
								if (aPage[0].getTitle() == "Watch Movies") {
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
								if(aSelect[0].getItems().length >0){
									assert.ok("The select contains a list of genres");
								}else {
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
							success: function (aButtons) {
									this.waitFor({
										id: aButtons[0].getId(),
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
										}
									});
							},
							error: function () {
								assert.notOk("Could not find a button");
							}
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
							actions: new EnterText({text: "Hamburg"}),
							errorMessage: "The input city was not found"
						});
						When.waitFor({
							controlType: "sap.m.Select",
							actions: function (oSelect) {
								oSelect.setSelectedKey("Action");
							},
							errorMessage: "The select genre was not found"
						});
						When.waitFor({
							controlType: "sap.m.Button",
							matchers: new PropertyStrictEquals({name: "text", value: "Find Movies"}),
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
							viewName: "opensap.movies.view.App",
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
							viewName: "opensap.movies.view.App",
							controlType : "sap.m.Image",
							matchers: new PropertyStrictEquals({name: "src", value: "images/CinemaHamburg.png"}),
							success: function () {
								assert.ok("The page showed the right image");
							},
							errorMessage: "The page does not show an image"
						})
					});

					opaTest("The detail page should display an icon", function (Given, When, Then, assert) {
						Then.waitFor({
							viewName: "opensap.movies.view.App",
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
							viewName: "opensap.movies.view.App",
							controlType : "sap.m.Page",
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
					})
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
					opaTest("Ensure being on the List Report ", function (Given, When, Then, assert) {
						When.waitFor({
							id: "SalesOrders::sap.suite.ui.generic.template.ListReport.view.ListReport::SalesOrderSet",
							success: function (oTable) {
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
							success: function (oTable) {
								assert.ok("Smart table's Export to Spreadsheet feature is switched on");
							},
							error: function () {
								assert.notOk("Could not find the Smart table's Export to Spreadsheet button. Did you create the property change?");
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
