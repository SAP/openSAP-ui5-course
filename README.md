# openSAP-ui5-course

[![REUSE status](https://api.reuse.software/badge/github.com/SAP/openSAP-ui5-course)](https://api.reuse.software/info/github.com/SAP/openSAP-ui5-course)


This repository contains the **solutions for both openSAP SAPUI5 courses**.

|   Evolved Web Apps with SAPUI5 (ui52)  |   Developing Web Apps with SAPUI5 (ui51)  |
|:---|:---|
| To find solutions and instructions for the new course, please read on.   |  The solutions for our predecessor course have been moved to branch [ui51](https://github.com/SAP/openSAP-ui5-course/tree/ui51).  |

### Evolved Web Apps with SAPUI5 (ui52)

Welcome to your learning journey to develop evolved Web apps with SAPUI5. This repository contains the code for all units of the openSAP course *Evolved Web Apps with SAPUI5* (ui52).
Please follow the setup instructions below to get started.

## Directions

In the `master` branch, you can find:

* `w[x]u[y]`: Solutions to all the course exercises (each course unit is located in a separate folder, e.g.: w3u4 = week 3 unit 4).
* `demo`: Content that is shown throughout the course units, but not an essential part of the course exercises.
* `import`: Files that you have to import for certain exercises. We will give you instructions in the course exercises.

In the `gh_pages` branch you can find:
* `Rufus.js`: Our friendly assistant to check your exercise coding. Onboarding instructions can be found below.
* `movies`: The [Find Movies](http://sap.github.io/openSAP-ui5-course/movies) app resulting from the exercises in week 2.
* `orders`: The [Browse Orders](http://sap.github.io/openSAP-ui5-course/orders) app resulting from the exercises in weeks 3 and 4.

## Setup

You can import this repository to SAP Web IDE or run it standalone. Choose the scenario that fits your needs:

### SAP Web IDE (recommended)

1. Right-click on your workspace, and choose **Git > Clone Repository**.

2. In the dialog *Clone Git Repository*, enter the URL `https://github.com/SAP/openSAP-ui5-course.git`.

3. In the *Git Ignore System Files* dialog, choose **Do it later**.

4. A folder `openSAP-ui5-course` is added to your workspace.

5. Open the index.html file to get a searchable list of course exercises

6. In the `webapp` folder for the unit your choice (e.g. `w2u3\webapp`), right-click on the `index.html` or `mockServer.html` file, and choose **Run > Run as Web Application** to browse the course exercises.

### Local Installation

1. Clone this repository to your local machine:

``` console
git clone https://github.com/SAP/openSAP-ui5-course.git
```

2. Go to the repository, and install the [UI5 Build and Development Tooling](https://github.com/SAP/ui5-tooling) as well as other dependencies to run the course repository:

``` console
npm install
```

3. Run a local webserver to browse the course exercises. A browser window displaying all available units will open automatically.

> *Note:* The repository is using [OpenUI5 npm packages](https://www.npmjs.com/org/openui5) - with week 3 we add SAPUI5-exclusive controls which will not run in this scenario. You can switch the bootstrap to our SAUPUI5 CDN to make them work: `https://ui5.sap.com/resources/sap-ui-core.js`

## Checking Your Code Exercises

*Rufus*, your personal assistant, will join you on your learning journey. He can help you complete the coding exercises and find errors in your code.
To onboard him, add the following line to your HTML entry point (e.g. index.html, mockServer.html, flpSandbox.html) at the end of the `<head>` tag:

![Rufus](https://github.com/SAP/openSAP-ui5-course/blob/gh-pages/success.png?raw=true)

``` js
<script src="https://SAP.github.io/openSAP-ui5-course/Rufus.js"></script>
```

You will see *Rufus* in the the lower left area of your app. Activate him, and select a course unit you would like to check.
In "Week 1 - Unit 6: Getting Ready for the Course Exercises", we will give you more information on this.

*Nerd facts:* Rufus is implemented in UI5 as an OPA plugin and runs automated integration tests to check your exercises. Have a look at the [source code](https://github.com/SAP/openSAP-ui5-course/blob/gh-pages/Rufus.js) if you'd like to find out more.

## Resetting a Course Exercise

1. Locate the folder `w[x]u[y]` that contains the result of the course unit you are working on in this repository.

    * If you want to reset the whole exercise, first backup your `webapp` folder by right-clicking on the project and choosing **Edit > Rename**.

    * If you want to start from a specific exercise, first create a new project folder by right-clicking on the workspace and selecting **New > Folder**

2. Copy the files or folders of the exercise you wish over to your current project folder as needed. Make sure you don't overwrite files you want to keep.

3. Run the app to verify that the reset worked as expected: Right-click on the `index.html`, and choose **Run > Run as Web Application**.

## Contributions & Support

If you spot any issues with the code or if you find a bug, please create an issue or a pull request, and we will take care of it.

Thank you,

**The course team**

## License

All example code in this repository is licensed under the [Apache Software License, Version 2.0](https://github.com/SAP/openSAP-ui5-course/blob/master/LICENSE).
