"use strict";

let XMLFiles = [
    'xml/bookeye1.xml', 
    'xml/bookeye2.xml', 
    'xml/bookeye3.xml'
]; //Add file paths here

getXML(createSummary);

let detailBTN = document.getElementById('Detail'); //button
let summaryBTN = document.getElementById('Summary'); //button
let DIV = document.getElementById('Stats'); //div 

//Adds event listeners for buttons
detailBTN.addEventListener('click', function() {
    removeChildren(DIV);
    getXML(createTable);
});

summaryBTN.addEventListener('click', function() {
    removeChildren(DIV);
    getXML(createSummary);
});


function appendDataToRow(tableElem, data, tagName) {
    let newTableRow = document.createElement('tr');
    tableElem.appendChild(newTableRow);
    
    data.forEach(function(datum) {
        let newElem = document.createElement(tagName);
        newElem.textContent = datum;
        newTableRow.appendChild(newElem);
    });
} //Appends TR and THs or TDs


function appendTable(elem) {
    let newTable = document.createElement('table');
    newTable.align = 'center';
    elem.appendChild(newTable); 
    return newTable;
} //Appends and returns table element


function getAvg(array) {
    let runningTotal = 0;
    for (let i = 0; i < array.length; i++) {
        let number = parseInt(array[i].textContent);
        runningTotal += number;  
   }
   return Math.round(runningTotal / array.length);
} //Returns avg number of scans for a particular KIC


function getFriendlyDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return month + "/" + day + "/" + year;
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
        XHR.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 404) {
                alert("Something went wrong. See Web Console for more details.");
            } else if (this.readyState === 4 && this.status === 200) {
                funct(XHR);
            }
        }
        XHR.open('GET', XMLFile);
        XHR.send();
    }); //This may cause the script to create tables out of order in some browsers
} //Use AJAX to get XML data from each file in the XMLFiles array and run passed function


function removeChildren(elem) {
   while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
   }   
} //Removes all elements nested within passed element>


//Main functions
function createTable(XHR) {
    let newTable = appendTable(DIV);
    newTable.addEventListener('click', (e) => {
        if (e.target.nodeName == 'TD') {
            if (e.target.parentNode.style.backgroundColor == 'yellow') {
                    e.target.parentNode.style.backgroundColor = '';
            } else {
                    e.target.parentNode.style.backgroundColor = 'yellow';     
            }
        }
    }); //Add event listener to table to highlight clicked table rows
    
    let compName = XHR.responseXML.getElementsByTagName('ComputerName')[0].textContent;
    let newCaption = document.createElement('caption');
    newCaption.textContent = compName;
    newTable.appendChild(newCaption);
    
    let tableHeaderAry = [
        /*Column 1*/ "Date", 
        /*Column 2*/ "Data Sent (MBs)", 
        /*Column 3*/ "Total Scans",
        /*Column 4*/ "Sessions", 
        /*Column 5*/ "Avg Scans/Session" 
    ]; 
    
    appendDataToRow(newTable, tableHeaderAry, 'th');

    let dateAry = XHR.responseXML.getElementsByTagName('Date');
    let sizeAry = XHR.responseXML.getElementsByTagName('Size');
    let scansAry = XHR.responseXML.getElementsByTagName('Scans');
    let totalSesAry = XHR.responseXML.getElementsByTagName('Ss');

    let dateTracker = new Date(dateAry[0].textContent);
    
    for (let i = 0; i < scansAry.length; i++) {
        let rowDate = new Date(dateAry[i].textContent);

        while (rowDate > dateTracker) {
            let emptyData = [getFriendlyDate(dateTracker), "*", "*", "*", "*"]
            appendDataToRow(newTable, emptyData, 'td');
            dateTracker = new Date(dateTracker.getFullYear(), dateTracker.getMonth(), dateTracker.getDate() + 1);
        } //Add rows with no data
                
        let date = getFriendlyDate(rowDate); //Column 1
    
        //XML has strange size format that requires dividing by 100 to return size in megabytes
        let size = parseInt(sizeAry[i].textContent); 
        let sizeMB = Math.round(size / 100);
        let totalScans = parseInt(scansAry[i].textContent);
        let totalSes = totalSesAry[i].textContent;
        let avgScansPerSes = Math.round(totalScans / totalSes);

        let detailData = [date, sizeMB, totalScans, totalSes, avgScansPerSes];
        appendDataToRow(newTable, detailData, 'td');
            
        dateTracker = new Date(dateTracker.getFullYear(), dateTracker.getMonth(), dateTracker.getDate() + 1);
    } //Each iteration of this loop creates a row in the table
} 


function createSummary(XHR) {
    let newTable = appendTable(DIV);
    let compName = XHR.responseXML.getElementsByTagName('ComputerName')[0].textContent;
    let dateAry = XHR.responseXML.getElementsByTagName('Date');
    let dateTracker = new Date(dateAry[0].textContent);
    let lastDate = new Date(dateAry[dateAry.length - 1].textContent);
    let dateRange = getFriendlyDate(dateTracker) + " - " + getFriendlyDate(lastDate);
    
    let newCaption = document.createElement('caption');
    newCaption.textContent = compName + " (" + dateRange + ")";
    newTable.appendChild(newCaption); 

    let tableHeaderAry = [
        /*Column 1*/ "Data Sent (MBs)",
        /*Column 2*/ "Avg Data/Day (MBs)",
        /*Column 3*/ "Total Scans",
        /*Column 4*/ "Avg Scans/Day",
        /*Column 5*/ "Highest # of Scans in a Day"
    ];
    
    appendDataToRow(newTable, tableHeaderAry, 'th'); //Append header row

    //XML has strange size format that requires dividing by 100 to return size in megabytes
    let sizeAry = XHR.responseXML.getElementsByTagName('Size');
    let dataSentMBs = Math.round(getRunningTotal(sizeAry) / 100);
    let avgDataDayMBs = Math.round(getAvg(sizeAry) / 100);
    let scansAry = XHR.responseXML.getElementsByTagName('Scans');
    let totalScans = getRunningTotal(scansAry);
    let avgScansDay = getAvg(scansAry);
    let highestScans = getHighestNum(scansAry);

    let summaryData = [
        /*Column 1*/ dataSentMBs, 
        /*Column 2*/ avgDataDayMBs, 
        /*Column 3*/ totalScans, 
        /*Column 4*/ avgScansDay, 
        /*Column 5*/ highestScans
    ];
    
    appendDataToRow(newTable, summaryData, 'td');
}