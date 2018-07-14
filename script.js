//For ATTENTION notices, see README

//Put XML files into the XMLFiles array to iterate through each file
var XMLFiles = [
    'XML/bookeye1.xml', 
    'XML/bookeye2.xml', 
    'XML/bookeye3.xml' 
    /*,'XML/bookeye4.xml'*/
]; /*ATTENTION #1 ATTENTION #1 ATTENTION #1*/ 

//Use AJAX to get XML data for each file in the XMLFiles array
XMLFiles.forEach(function(XMLFile) {
    var XHR = new XMLHttpRequest();
    XHR.onreadystatechange = appendXMLData; 
    XHR.open('GET', XMLFile);
    XHR.send();
}); //This may cause the script to create tables out of order in some browsers
 
function appendXMLData() {
    //Check XHR status
    if (this.readyState === 4 && this.status === 404) {
        alert("Something went wrong. See the Web Console for more details.");
    } else if (this.readyState === 4 && this.status === 200) {
        var newTable = document.createElement('table');
        newTable.align = 'center';
        document.body.appendChild(newTable);  //Append table

            newTable.addEventListener('click', (e) => {
                if (e.target.nodeName == 'TD') {
                    if (e.target.parentNode.style.backgroundColor == 'yellow') {
                        e.target.parentNode.style.backgroundColor = '';
                    } else {
                        e.target.parentNode.style.backgroundColor = 'yellow';     
                    }
                }
            }); //Add event listener to table to highlight clicked table rows
        
        var compName = this.responseXML.getElementsByTagName('ComputerName')[0].textContent;
        var newCaption = document.createElement('caption');
        newCaption.textContent = compName;
        newTable.appendChild(newCaption); //Append KIC computer name as caption

        var newTableRow = document.createElement('tr');
        newTable.appendChild(newTableRow); //Append table header row
        
        var tableHeaderAry = [
            /*COLUMN ONE*/ "Date", 
            /*COLUMN TWO*/ "Data Sent (MBs)", 
            /*COLUMN THREE*/ "Total Scans", 
            /*COLUMN FOUR*/ "Sessions", 
            /*COLUMN FIVE*/ "Avg Scans/Session" 
            /*,"Add Other Headers Here"*/
        ]; /*ATTENTION #2 ATTENTION #2 ATTENTION #2*/
        
        tableHeaderAry.forEach(function(header) {
            var newTableHeader = document.createElement('th');
            newTableHeader.textContent = header;
            newTableRow.appendChild(newTableHeader);
        }); //Appends table header element for each header in tableHeaderAry to create columns

        //Get arrays with necessary data from XML file using XML tag names
        var byteSizeKBAry = this.responseXML.getElementsByTagName('Size');
        var dateAry = this.responseXML.getElementsByTagName('Date');
        var scansAry = this.responseXML.getElementsByTagName('Scans');
        var totalSesAry = this.responseXML.getElementsByTagName('Ss');
        /*ATTENTION #3 ATTENTION #3 ATTENTION #3*/

        //Each iteration of this loop creates a single row complete with data in the table
        for (i = 0; i < scansAry.length; i++) {
            function colorCode(data, newTableData, heavyUseNum, lightUseNum) {
                if (data >= heavyUseNum) {
                   newTableData.className = "heavyUse";
               }
                if (data <= lightUseNum) {
                   newTableData.className = "lightUse";
               } 
           } //Color codes trends in data using CSS classes

            var newTableRow = document.createElement('tr');
            newTable.appendChild(newTableRow); //Append table row

            function appendDataToRow(data, heavyUseNum, lightUseNum) {
                var newTableData = document.createElement('td');
                newTableData.textContent = data;
                colorCode(data, newTableData, heavyUseNum, lightUseNum);
                newTableRow.appendChild(newTableData);
            } //Creates table data element, sets it content to whatever data is passed, color codes it, and appends it

            var date = dateAry[i].textContent.slice(0, 10);
            appendDataToRow(date, null, null); //Column 1
            
            var byteSizeKB = parseInt(byteSizeKBAry[i].textContent);
            var byteSizeMB = Math.round(byteSizeKB / 100);
            appendDataToRow(byteSizeMB, 1000, 50); //Column 2
            /*ATTENTION #4 ATTENTION #4 ATTENTION #4*/

            var totalScans = parseInt(scansAry[i].textContent);
            appendDataToRow(totalScans, 1000, 100); //Column 3

            var totalSes = totalSesAry[i].textContent;
            appendDataToRow(totalSes, 35, 20); //Column 4

            var avgScansPerSession = Math.round(totalScans / totalSes);
            appendDataToRow(avgScansPerSession, 25, 5); //Column 5
           
            /*ATTENTION #5 ATTENTION #5 ATTENTION #5*/

        } //End loop
    } //End else if
} //End appendXMLData()