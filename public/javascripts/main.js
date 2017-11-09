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
				console.log("Your Data!: ", data)
			}
		})

	})	
})