var total = 0;

document.addEventListener("submit", function(e){
	e.preventDefault()
	var form = e.target
	var formData = new FormData(form)
	formData.append('numwds', 'numwds')
	formData.append('date', 'date')
	var givenCt = parseInt(formData.get('numwds'))
	var givenDate = formData.get("date")
	console.log(givenDate)
	console.log(givenCt)
	totalCt(givenCt)
	//put in callback later
	document.getElementById("wordct").reset()

})

function totalCt(givenCt){
	total += givenCt;
	console.log(total)

}

