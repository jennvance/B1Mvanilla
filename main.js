// Storage
function Day(date, numwords){
	this.date = date;
	this.numwords = numwords;
}

var allCounts = [];

document.addEventListener("submit", function(e){
	e.preventDefault()
	var form = e.target
	var formData = new FormData(form)
	formData.append('numwds', 'numwds')
	formData.append('date', 'date')
	submitEntry(formData)
	//put in callback later
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

