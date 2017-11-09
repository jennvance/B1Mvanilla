$(document).ready(function(){
	$("#wordct").on("submit", function(event){
		event.preventDefault()
		console.log("submitted count form")
		formData = {
			date: $("#datewds").val(),
			words: $("#numwds").val()
		}
		console.log(formData)
		$.ajax({
			url: "/addcount",
			type: "POST",
			data: formData,
			success: function(data){
				calcTotal(data)
				console.log(calcTotal(data))
			}
		})
		document.getElementById("wordct").reset()
	})	

	function calcTotal(data){
		return data.map(function(a){
			return a.words
		}).reduce(function(a,b){
			return a+b
		})
}











})

