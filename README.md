# openSAP-ui5-course

This repository contains related material for the openSAP course "Developing Web Apps with SAPUI5" (https://open.sap.com/courses/ui51).

Running the Validator
---------------------

The validator script in this folder checks the exercises of the openSAP course "Developing Web Apps with SAPUI5".
To use it inside your application project add the following line to your index.html or mockServer.html file:

```<script src="https://SAP.github.io/openSAP-ui5-course/Validator.js"></script>```

This will inject a validation button in the lower left area of your app that you can press to trigger the tests.
To score points for the two bonus exercises of the course you will need to pass the validator tests successfully.

More information can be obtained in the course unit  "Week 0 - Unit 5: A Glance at the Coding Exercises".
The validator tool is implemented purely in UI5 and is internally using OPA to define acceptance tests.

Contributions
-------------

All content is published under the Apache 2.0 license.
For more information check the LICENSE.txt file

If you spot any issues with the code or found a bug, please create an issue or a pull request and we will take care of it

Thank you,

The ui51 course team
