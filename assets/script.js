"use strict";

let XMLFiles = [
    'xml/bookeye1.xml', 
    'xml/bookeye2.xml', 
    'xml/bookeye3.xml'
]; //Add file paths here

getXML(createSummary);

let detailBTN = document.getElementById('Detail'); //button
let summaryBTN = document.getElementById('Summary'); //button
let mainDIV = document.getElementById('Stats'); //div 

//Adds event listeners for buttons
detailBTN.addEventListener('click', function() {
    removeChildren(mainDIV);
    getXML(createDailyDetailTable);
});

summaryBTN.addEventListener('click', function() {
    removeChildren(mainDIV);
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
} //Removes all elements nested within passed element


//Main functions
function createDailyDetailTable(XHR) {
    let newTable = appendTable(mainDIV);
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
    
    let summaryTableHeaders = [
        /*Column 1*/ "Date", 
        /*Column 2*/ "Data Sent (MBs)", 
        /*Column 3*/ "Total Scans",
        /*Column 4*/ "Sessions", 
        /*Column 5*/ "Avg Scans/Session" 
    ]; //Detailed table header row created by createDailyDetailTable()
    
    appendDataToRow(newTable, summaryTableHeaders, 'th');

    let dates = XHR.responseXML.getElementsByTagName('Date');
    let sizes = XHR.responseXML.getElementsByTagName('Size');
    let scans = XHR.responseXML.getElementsByTagName('Scans');
    let sessions = XHR.responseXML.getElementsByTagName('Ss');
    let dateTracker = new Date(dates[0].textContent);
    
    for (let i = 0; i < scans.length; i++) {
        let rowDate = new Date(dates[i].textContent);

        while (rowDate > dateTracker) {
            let tableEmptyData = [
                /*Column 1*/ getFriendlyDate(dateTracker), 
                /*Column 2*/ "*", 
                /*Column 3*/ "*", 
                /*Column 4*/ "*", 
                /*Column 5*/ "*"
            ]; //Daily detail empty data row created by createDailyDetailTable()

            appendDataToRow(newTable, tableEmptyData, 'td');
            dateTracker = new Date(dateTracker.getFullYear(), dateTracker.getMonth(), dateTracker.getDate() + 1);
        } //Add rows with no data
                
        let date = getFriendlyDate(rowDate);
        let size = parseInt(sizes[i].textContent); 
        let sizeMB = Math.round(size / 100);
        let totalScans = parseInt(scans[i].textContent);
        let totalSes = sessions[i].textContent;
        let avgScansPerSes = Math.round(totalScans / totalSes);

        let tableDetailData = [
            /*Column 1*/ date, 
            /*Column 2*/ sizeMB, 
            /*Column 3*/ totalScans, 
            /*Column 4*/ totalSes, 
            /*Column 5*/ avgScansPerSes
        ]; //Daily detail data row created by createDailyDetailTable()

        appendDataToRow(newTable, tableDetailData, 'td');
        dateTracker = new Date(dateTracker.getFullYear(), dateTracker.getMonth(), dateTracker.getDate() + 1);
    } //Each iteration of this loop creates a row in the table
} 


function createSummary(XHR) {
    let newTable = appendTable(mainDIV);
    let compName = XHR.responseXML.getElementsByTagName('ComputerName')[0].textContent;
    let dates = XHR.responseXML.getElementsByTagName('Date');
    let dateTracker = new Date(dates[0].textContent);
    let lastDate = new Date(dates[dates.length - 1].textContent);
    let dateRange = getFriendlyDate(dateTracker) + " - " + getFriendlyDate(lastDate);
    
    let newCaption = document.createElement('caption');
    newCaption.textContent = compName + " (" + dateRange + ")";
    newTable.appendChild(newCaption); 

    let summaryTableHeaders = [
        /*Column 1*/ "Data Sent (MBs)",
        /*Column 2*/ "Avg Data/Day (MBs)",
        /*Column 3*/ "Total Scans",
        /*Column 4*/ "Avg Scans/Day",
        /*Column 5*/ "Highest # of Scans in a Day"
    ]; //Summary table header row created by createSummary()
    
    appendDataToRow(newTable, summaryTableHeaders, 'th');

    let sizes = XHR.responseXML.getElementsByTagName('Size');
    let dataSentMBs = Math.round(getRunningTotal(sizes) / 100);
    let avgDataDayMBs = Math.round(getAvg(sizes) / 100);
    let scans = XHR.responseXML.getElementsByTagName('Scans');
    let totalScans = getRunningTotal(scans);
    let avgScansDay = getAvg(scans);
    let highestScans = getHighestNum(scans);

    let summaryData = [
        /*Column 1*/ dataSentMBs, 
        /*Column 2*/ avgDataDayMBs, 
        /*Column 3*/ totalScans, 
        /*Column 4*/ avgScansDay, 
        /*Column 5*/ highestScans
    ]; //Summary table data row created by createSummary()
    
    appendDataToRow(newTable, summaryData, 'td');
}