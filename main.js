document.addEventListener("submit", function(e){
	e.preventDefault()
	var form = e.target
	var formData = new FormData(form)
	formData.append('wdct', 'wordct')
	formData.append('date', 'date')
	var givenDate = formData.get("date")
	console.log(givenDate)

})