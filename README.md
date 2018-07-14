# kic-data
The code in this repo takes the daily usage statistics XML data output by Knowledge Imaging Center (KIC) scanner software (version 4.2.0.0) and displays it in a web browser for general analysis that may help inform business/budgetary decisions and KIC configuration settings. 

It should be known that the KIC Fleet Manager software available for purchase from Image Access provides much more functionality and that the code in this repo is meant to be an open-source alternative for institutions that wish to have a way to analyze the  data without the cost (and all the extra features) that the Fleet Manager software provides.

See the following sites for more information about KIC scanners:

* [Image Access](https://www.imageaccess.com)
* [KIC](https://www.kic.com)
* [Digital Library Systems Group](https://www.dlsg.com)

## Using the Code
This front-end project was built with basic HTML, CSS, and vanilla JS. Loading the XML data from your computer will require that you run a local web server as browsers restrict cross-origin HTTP requests initiated from within local scripts as a security precaution.

Configure the KIC scanner to send the daily statistics email in KIC Setup. Download the zip file with the XML data that is attached to the email, unzip the file, rename the file to whatever you wish, and add the .xml file extension. The script will create a data table for as many XML files as you want, with columns that indicate basic data such as: 

* Date
* Amount of Data Sent in MegaBytes
* Total Number of Scans
* Total Number of Sessions
* Average Number of Scans per Session

Comments in the JS file will assist with setup. Look for ATTENTION warnings in the code:

### ATTENTION #1
___If you only wish to see the basic data described above, this may be the only area that requires your attention___. In the code already in place, the script file will look for a folder named "XML" located in the same folder as the script file and grab the files named bookeye1.xml, bookeye2.xml, and bookeye3.xml within the XML folder. Add or remove as many XML files as you like from the XMLFiles array and the script will take care of the rest (if the files are named correctly, match the file names in the script, and are in the correct location).

### ATTENTION #2 
If you wish to add more columns with different data sets, you must add the new headers into the tableHeaderAry array as strings.

### ATTENTION #3 
More data from the XML files can be added here if needed.

### ATTENTION #4 
The heavyUseNum and lightUseNum arguments in calls to appendDataToTable() should be edited based on user needs.

### ATTENTION #5 
If more headers were added to tableHeaderAry (ATTENTION #2), the code for adding the new columns should be added here in the correct order.

## Authors
**Jordan Bradford** - GitHub: [jrdnbradford](https://github.com/jrdnbradford)

## License
This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.