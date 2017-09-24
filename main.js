// Storage
function Day(date, numwords){
	this.date = date;
	this.numwords = numwords;
}

var total = 0;
var allCounts = [];


document.querySelector('#wordct').addEventListener("submit", function(e){
	e.preventDefault()
	var form = e.target
	var formData = new FormData(form)
	formData.append('numwds', 'numwds')
	formData.append('date', 'date')
	submitEntry(formData)
	document.getElementById("wordct").reset()
})

function submitEntry(formData){
	var givenCt = parseInt(formData.get('numwds'))
	var givenDate = formData.get("date")
	if(allCounts.length === 0) {
		var newday = new Day(givenDate, givenCt);
		allCounts.push(newday);
	} else {
		for (var i=0; i<allCounts.length; i++){
			if(allCounts[i].date === givenDate){
				allCounts[i].numwords += givenCt;
				return false;
			}
		}
		var newday = new Day(givenDate, givenCt);
		allCounts.push(newday);
	}
	total += givenCt;
	var displayTotal = document.getElementById('allTimeTotal')
	displayTotal.innerHTML = total;
}


document.querySelector('#monthform select').addEventListener('change', function(event){
	// Find days in month to pass to avg calculation 
	var monthVal = parseInt(document.getElementById("selectmonth").value)
	var daysInMonth = new Date(2017, monthVal+1, 0).getDate();
	// Calculate monthly total 
	calcTotalMonth(daysInMonth)
	// most productive date of the month
	findProductiveDate()
	// most productive day of the week for that month

})



function calcTotalMonth(numDays) {
	var monthtotal = 0;
	for(var i=0; i<allCounts.length; i++){
		//alternative: parse month digit from date string
		//actual: convert date string to date object, call method
		var mo = new Date(allCounts[i].date)
		var datamonth = mo.getMonth()
		var selectmonth = parseInt(document.getElementById("selectmonth").value)
		if(datamonth === selectmonth) {
			monthtotal += allCounts[i].numwords;
		}
	}
	var avg = (monthtotal / numDays).toFixed(0);
	renderCalcs(monthtotal, avg);
	calcWritingDaysOnlyAvg();
	calcAllTimeAverage();
}



function findProductiveDate(){
	var highNum = 0;
	var highDate;
	for(var i=0; i<allCounts.length; i++) {
		var mo = new Date(allCounts[i].date)
		var datamonth = mo.getMonth()
		var selectmonth = parseInt(document.getElementById("selectmonth").value)
		if(datamonth === selectmonth) {
			if(allCounts[i].numwords > highNum){
				highNum = allCounts[i].numwords
				//this could go somewhere else
				highDate = allCounts[i].date
			}

		}
	}
	renderProdDate(highDate, highNum)
}

function renderProdDate(dt, nm)
{	
	var date = new Date(dt)
	var formatDate = date.toLocaleDateString("en-us") 
	var prodDate = document.getElementById('prodDate')
	prodDate.innerHTML = formatDate
	var prodDateCt = document.getElementById('prodDateCt')
	prodDateCt.innerHTML = nm
}
function findProductiveDay(){
	//do this much later
}

function renderCalcs(mT, avg){
	var moTotal = document.getElementById('totalmonth')
	moTotal.innerHTML = mT
	var average = document.getElementById('avgmonth')
	average.innerHTML = avg

}

function calcAllTimeAverage(){
	//First need to sort array by date
	allCounts.sort(function(a,b){
		return new Date(a.date) - new Date(b.date)
	})
	//Calculate number of days since your first count
	var msPerDay = 1000*60*60*24
	var today = new Date();
	//dayOne is initializing to 6 hours prior to 00:00 UTC on correct date
	//diff calculation makes more real life sense with bug. refactor later.
	var dayOne = new Date(allCounts[0].date);
	var diff = diffDates(dayOne, today)
	function diffDates(a,b){
		//is this even working as expected?
		var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
		var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
		console.log("utc1: " + utc1 + " utc2: " + utc2)
		return Math.floor((utc2 - utc1) / msPerDay)
	}
	//Divide total words by days since started
	var allTimeAvg = (total / diff).toFixed(0)
	//render calculation
	var dailyAvg = document.getElementById('dailyAvg')
	dailyAvg.innerHTML = allTimeAvg
}

function calcWritingDaysOnlyAvg(){
	var avg = (total / allCounts.length).toFixed(0)
	var onlyAvg = document.getElementById('onlyAvg')
	onlyAvg.innerHTML = avg
}

