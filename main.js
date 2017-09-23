// Storage
function Day(date, numwords){
	this.date = date;
	this.numwords = numwords;
}

var allCounts = [];

//insert dummy data for testing
// var day1 = new Day()

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
}

document.querySelector('#monthform select').addEventListener('change', function(event){
	// daily average for the month 
	var monthVal = parseInt(document.getElementById("selectmonth").value)
	// return new Date(mo.getFullYear(), mo.getMonth()+1, 0).getDate();
	var daysInMonth = new Date(2017, monthVal+1, 0).getDate();
	// Calculate and display monthly total 
	calcTotalMonth(daysInMonth)
	// most productive date of the month

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
	renderCalcs(monthtotal);
	var avg = monthtotal / numDays;
	console.log(avg)
}



function findProductiveDate(){

}

function findProductiveDay(){

}

function renderCalcs(mT){
	var moTotal = document.getElementById('totalmonth')
	moTotal.innerHTML = mT
}
