"use strict";

var XMLFiles = [
    'XML/bookeye1.xml', 
    'XML/bookeye2.xml', 
    'XML/bookeye3.xml'
]; //Add file paths here

getXML(createExhaustiveTable);

let exhaustiveDetailBTN = document.getElementById('ExhaustiveDetail'); //button
let glanceBTN = document.getElementById('Total'); //button
let DIV = document.getElementById('Stats'); //div 

//Adds event listeners for buttons
exhaustiveDetailBTN.addEventListener('click', function() {
    removeChildren();
    getXML(createExhaustiveTable);
});

glanceBTN.addEventListener('click', function() {
    removeChildren();
    getXML(createGlanceRundown);
});


function appendDataToRow(data, newTableRow) {
    let newTableData = document.createElement('td');
    newTableData.textContent = data;
    newTableRow.appendChild(newTableData);
} //Creates table data element, sets its content to whatever data is passed, and appends it


function appendHeader(headerAry, newTableRow) {
    headerAry.forEach(function(header) {
        let newTableHeader = document.createElement('th');
        newTableHeader.textContent = header;
        newTableRow.appendChild(newTableHeader);
    }); 
} //Appends table header element for each header in passed array to create columns


function getAvg(array) {
    let runningTotal = 0;
    for (let i = 0; i < array.length; i++) {
        let number = parseInt(array[i].textContent);
        runningTotal += number;  
   }
    let avg = Math.round(runningTotal / array.length);
    return avg;
} //Returns avg number of scans for a particular KIC


function getFriendlyDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    date = month + "/" + day + "/" + year;
    return date;
} //Returns reader friendly date


function getHighestNum(array) {
    let parsedData = [];
    for (let i = 0; i < array.length; i++) {
        parsedData.push(parseInt(array[i].textContent));
    }
    return Math.max(...parsedData); 
} //Returns highest number in passed array


function getRunningTotal(array) {
    let runningTotal = 0;
    for (let i = 0; i < array.length; i++) {
        let number = parseInt(array[i].textContent);
        runningTotal += number;
   }
   return runningTotal;
} //Returns total scans for a particular KIC


function getXML(funct) {
    XMLFiles.forEach(function(XMLFile) {
        let XHR = new XMLHttpRequest();
        XHR.onreadystatechange = funct; 
        XHR.open('GET', XMLFile);
        XHR.send();
    }); //This may cause the script to create tables out of order in some browsers
} //Use AJAX to get XML data from each file in the XMLFiles array and run passed function


function removeChildren() {
   while (DIV.firstChild) {
       DIV.removeChild(DIV.firstChild);
   }   
} //Removes all elements nested within <div id="Stats">


//Main functions
function createExhaustiveTable() {
    if (this.readyState === 4 && this.status === 404) {
        alert("Something went wrong. See the Web Console for more details.");
    } else if (this.readyState === 4 && this.status === 200) {
        let newTable = document.createElement('table');
        newTable.align = 'center';
        DIV.appendChild(newTable); //Append table

        newTable.addEventListener('click', (e) => {
            if (e.target.nodeName == 'TD') {
                if (e.target.parentNode.style.backgroundColor == 'yellow') {
                        e.target.parentNode.style.backgroundColor = '';
                } else {
                        e.target.parentNode.style.backgroundColor = 'yellow';     
                }
            }
        }); //Add event listener to table to highlight clicked table rows
        
        let compName = this.responseXML.getElementsByTagName('ComputerName')[0].textContent;
        let newCaption = document.createElement('caption');
        newCaption.textContent = compName;
        newTable.appendChild(newCaption); //Append KIC computer name as caption

        let newTableRow = document.createElement('tr');
        newTable.appendChild(newTableRow); //Append table header row
        
        let tableHeaderAry = [
            /*Column 1*/ "Date", 
            /*Column 2*/ "Data Sent (MBs)", 
            /*Column 3*/ "Total Scans",
            /*Column 4*/ "Sessions", 
            /*Column 5*/ "Avg Scans/Session" 
        ]; 
        
        appendHeader(tableHeaderAry, newTableRow);

        let dateAry = this.responseXML.getElementsByTagName('Date');
        let sizeAry = this.responseXML.getElementsByTagName('Size');
        let scansAry = this.responseXML.getElementsByTagName('Scans');
        let totalSesAry = this.responseXML.getElementsByTagName('Ss');

        let dateTracker = new Date(dateAry[0].textContent);
        
        for (let i = 0; i < scansAry.length; i++) {
            let rowDate = new Date(dateAry[i].textContent);

            while (rowDate > dateTracker) {
                newTableRow = document.createElement('tr');
                newTable.appendChild(newTableRow); //Append table row
                appendDataToRow(getFriendlyDate(dateTracker), newTableRow);
                for (let i = 0; i < 4; i++) {
                    appendDataToRow("", newTableRow);
                } //Append empty TDs
                dateTracker = new Date(dateTracker.getFullYear(), dateTracker.getMonth(), dateTracker.getDate() + 1);
            } //Add rows with no data
                 
            newTableRow = document.createElement('tr');
            newTable.appendChild(newTableRow); //Append table row
            appendDataToRow(getFriendlyDate(rowDate), newTableRow); //Column 1
        
            //XML has strange size format that requires dividing by 100 to return size in megabytes
            let size = parseInt(sizeAry[i].textContent); 
            let sizeMB = Math.round(size / 100);
            appendDataToRow(sizeMB, newTableRow); //Column 2

            let totalScans = parseInt(scansAry[i].textContent);
            appendDataToRow(totalScans, newTableRow); //Column 3

            let totalSes = totalSesAry[i].textContent;
            appendDataToRow(totalSes, newTableRow); //Column 4

            let avgScansPerSes = Math.round(totalScans / totalSes);
            appendDataToRow(avgScansPerSes, newTableRow); //Column 5
             
            dateTracker = new Date(dateTracker.getFullYear(), dateTracker.getMonth(), dateTracker.getDate() + 1);
        } //Each iteration of this loop creates a single row complete with data in the table
    } 
} 


function createGlanceRundown() {
    if (this.readyState === 4 && this.status === 404) {
        alert("Something went wrong. See the Web Console for more details.");
    } else if (this.readyState === 4 && this.status === 200) {
        let newTable = document.createElement('table');
        newTable.align = 'center';
        DIV.appendChild(newTable); //Append table
        
        let compName = this.responseXML.getElementsByTagName('ComputerName')[0].textContent;
        
        let dateAry = this.responseXML.getElementsByTagName('Date');
        let dateTracker = new Date(dateAry[0].textContent);
        let lastDate = new Date(dateAry[dateAry.length - 1].textContent);
        let dateRange = getFriendlyDate(dateTracker) + " - " + getFriendlyDate(lastDate);
        
        let newCaption = document.createElement('caption');
        newCaption.textContent = compName + " (" + dateRange + ")";
        newTable.appendChild(newCaption); //Append KIC computer name and date range as caption 

        let newTableRow = document.createElement('tr');
        newTable.appendChild(newTableRow); //Append table header row

        let tableHeaderAry = [
            /*Column 1*/ "Data Sent (MBs)",
            /*Column 2*/ "Avg Data/Day (MBs)",
            /*Column 3*/ "Total Scans",
            /*Column 4*/ "Avg Scans/Day",
            /*Column 5*/ "Highest # of Scans in a Day"
        ];
        
        appendHeader(tableHeaderAry, newTableRow); //Append header row

        newTableRow = document.createElement('tr');
        newTable.appendChild(newTableRow); //Append table row

        //XML has strange size format that requires dividing by 100 to return size in megabytes
        let sizeAry = this.responseXML.getElementsByTagName('Size');
        appendDataToRow(Math.round((getRunningTotal(sizeAry) / 100)), newTableRow); //Column 1
        appendDataToRow(Math.round((getAvg(sizeAry) / 100)), newTableRow); //Column 2

        let scansAry = this.responseXML.getElementsByTagName('Scans');
        appendDataToRow(getRunningTotal(scansAry), newTableRow); //Column 3
        appendDataToRow(getAvg(scansAry), newTableRow); //Column 4
        appendDataToRow(getHighestNum(scansAry), newTableRow); //Column 5
    }
}