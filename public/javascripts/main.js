$(document).ready(function(){
	$("#wordct").on("submit", function(event){
		event.preventDefault()
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
				renderTotal(calcTotal(data))
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

	function renderTotal(total){
		var loc = document.getElementById("allTimeTotal")
		loc.innerHTML = total
	}











})

