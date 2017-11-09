// Storage
function Day(date, numwords){
	this.date = date;
	this.numwords = numwords;
}

var total = 0;
var allCounts = [];



document.querySelector('#wordct').addEventListener("submit", function(e){
	e.preventDefault()
	//delete FormData and use document...value instead?
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

//UNCOMMENT when add month selector to DOM
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

//This is the only event listener for viewStatsLink
// document.querySelector("#viewStatsLink").addEventListener('click',function(event){
// 	event.preventDefault()
// 	var dateObj = new Date();
// 	console.log(dateObj)
// 	var monthVal = dateObj.getUTCMonth()
// 	var monthVal = parseInt(document.getElementById("selectmonth").value)
// 	var daysInMonth = new Date(2017, monthVal+1, 0).getDate();
// 	// Calculate monthly total 
// 	calcTotalMonth(daysInMonth)
// 	// most productive date of the month
// 	findProductiveDate()
// })



function calcTotalMonth(numDays) {
	var monthtotal = 0;
	for(var i=0; i<allCounts.length; i++){
		//alternative: parse month digit from date string
		//actual: convert date string to date object, call method
		var mo = new Date(allCounts[i].date)
		var datamonth = mo.getMonth()
		//need an alternative to using "selectmonth" when get here via "View Stats" link instead of select
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
	//find day of week for each date in allCounts
	//sort by day of week and keep running total for each day of week
	//compare totals of each day of week and find highest

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
	var today = new Date();
	//dayOne is initializing to 6 hours prior to 00:00 UTC on correct date
	//diff calculation makes more real life sense with bug. refactor later.
	var dayOne = new Date(allCounts[0].date);
	var diff = diffDates(dayOne, today)
	var allTimeAvg = (total / diff).toFixed(0)
	var dailyAvg = document.getElementById('dailyAvg')
	dailyAvg.innerHTML = allTimeAvg
}

function calcWritingDaysOnlyAvg(){
	var avg = (total / allCounts.length).toFixed(0)
	var onlyAvg = document.getElementById('onlyAvg')
	onlyAvg.innerHTML = avg
}

//helper function lifted from SO
function diffDates(a,b){
	var msPerDay = 1000*60*60*24
	var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
	var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
	return Math.floor((utc2 - utc1) / msPerDay)
}


// document.querySelector("#setGoal").addEventListener("submit", function(e){
// 	console.log("November")
// 	e.preventDefault()
// 	//didn't use FormData here with no repercussions
// 	var glWds = document.getElementById('goalWds').value;
// 	var glDt = document.getElementById('goalDate').value;
// 	calcWpdToGoal(glWds, glDt)
// 	document.getElementById("setGoal").reset()
// 	//prompt login/signup...

// 	//on login/signup, reveal full dashboard UI (hidden before login)
// 	//(still need to make full dashboard UI)

// })

function calcWpdToGoal(words, goalDate){
	var today = new Date()
	var goalBy = new Date(goalDate)
	//date selector selects for local instead of UTC time and it messes up diffDates() calc.
	//fix later
	var numDays = diffDates(today, goalBy) + 1
	var wpdUntilGoal = (words / numDays).toFixed(0)
	var wpd = document.getElementById("wpdToGoal")
	wpd.innerHTML = wpdUntilGoal
}
