EXTENDING YOUR SAP FIORI LAUNCHPAD WITH PLUGINS
===============================================
This is the SAP Fiori launchpad plugin project for the SAP Web IDE for adding a bookmark plugin to your SAP Fiori launchpad. It already contains the Grunt build, which builds the minified sources.

HOW TO RUN THE PLUGIN FROM SAP WEB IDE
======================================
1. In SAP Web IDE, right-click on the root folder of the plugin project
2. Choose "Run" > "Run Configurations" 
3. In the dialog create a new configuration from "SAP Fiori Launchpad on Sandbox"
4. As a file to run choose "/fioriSandboxConfig.json"
5. In the tab "URL Components" enter #Shell-home as URL Hash Fragment
6. Press "Save and Run"

As a result, the SAP Fiori launchpad opens in a new tab. In the URL, the "sap-ushell-sandbox-config" parameter is set in order to load the file "fioriSandboxConfig.json" as the launchpad configuration file.

The file "fioriSandboxConfig.json" is part of the plugin project and configures the launchpad to load and use the plugin. In production fioriSandboxConfig.json may not be needed. This depends on how the plugin is configured to be used by SAP Fiori launchpad. For more information click [here](http://help.sap.com/saphelp_nw751abap/helpdata/en/98/cb0b6355094b2e91a0e6de030cd4ea/content.htm).
