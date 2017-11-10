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
				//didnt need to console log this anymore
				sortByDate(data)
				console.log(selectByMonth(data, 8))
				console.log(calcTotal(selectByMonth(data, 8)))
			}
		})
		document.getElementById("wordct").reset()
	})	
	//data is always an array here but we call it data. 
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
	//data is always an array here and we call it array
	function sortByDate(array){
		return array.sort(function(a,b){
			return new Date(a.date).getTime() - new Date(b.date).getTime()
		})
	}

	function selectByMonth(data, month){
		return data.filter(function(item){
			return new Date(item.date).getMonth() === month
		})
	}
	//uuhhhhh this is the exact same function as calcTotal and can be refactored out/deleted
	function calcTotalMonth(filteredData){
		return filteredData.map(function(a){
			return a.words
		}).reduce(function(a,b){
			return a+b
		})
	}

	function findProductiveDate(){

	}










})

