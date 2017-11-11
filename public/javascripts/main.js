$(document).ready(function(){

	$("#profileForm").on("submit", function(event){
		event.preventDefault()
		$.ajax({
			url: "/createprofile",
			type: "POST",
			data: new FormData($("#profileForm")[0]),
			enctype: 'multipart/form-data',
			cache: false,
			contentType: false,
			processData: false,
			success: function(data){
				renderProfileData(data)
				$(".option-1").hide()
				$(".option-2").show()
			}
		})

	})

	function renderProfileData(data){
		console.log(data)
		var name = data.name;
		var genre = data.genre;
		var bio = data.bio;
		var favorites = data.favorites;
		// var photo = data.photo;
		var nameId = document.getElementById("profileName")
		var genreId = document.getElementById("profileGenre")
		var bioId = document.getElementById("profileBio")
		var favoritesId = document.getElementById("profileFavorites")
		// var photoId = document.getElementById("profilePhoto")
		nameId.innerHTML = name;
		genreId.innerHTML = genre;
		bioId.innerHTML = bio;
		favoritesId.innerHTML = favorites;
		//does not work 
		// photoId.src = photo;
	}

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
				sortByDate(data)
				console.log(selectByMonth(data, 10))
				console.log(calcTotal(selectByMonth(data, 10)))
				console.log(findProductiveDate(selectByMonth(data,10)))
				console.log(calcAverageMonth(selectByMonth(data, 10)))
				console.log(calcAverageAllTime(sortByDate(data)))
			}
		})
		document.getElementById("wordct").reset()
	})	
	//data is always an array here but I call it data. 
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
	//data is always an array here and I call it array
	function sortByDate(array){
		return array.sort(function(a,b){
			return new Date(a.date).getTime() - new Date(b.date).getTime()
		})
	}
	//filter arrays by given month
	function selectByMonth(data, month){
		return data.filter(function(item){
			return new Date(item.date).getMonth() === month
		})
	}
	//returns object containing date and numwords
	function findProductiveDate(filteredArray){
		return filteredArray.reduce(function(a,b){
			return (b.words > a.words) ? b : a;
		})
	}

	function renderProductiveDate(){

	}
	
	function findProductiveDay(){
		//find day of week for each date in allCounts
		//sort by day of week and keep running total for each day of week
		//compare totals of each day of week and find highest
	}

	function renderProductiveDay(){

	}

	function daysInMonth(month, year){
		return new Date(year, month, 0).getDate()
	}
	//Average for given month
	//could pass month in as argument to identify month immediately if needed
	function calcAverageMonth(filteredOrUnfilteredArray){
		var tempdate = filteredOrUnfilteredArray[0].date
		var date = new Date(tempdate)
		var year = date.getFullYear()
		var month = date.getMonth() + 1
		//kosher to call function inside function or...?
		var total = calcTotal(filteredOrUnfilteredArray)
		var days = daysInMonth(month, year)
		// var averageAsNumber = parseFloat((total/days).toFixed(0)) //returns Number
		return (total / days).toFixed(0) //returns String
	}

	//helper function lifted from SO
	function diffDates(a,b){
		var msPerDay = 1000*60*60*24
		var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
		var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
		return Math.floor((utc2 - utc1) / msPerDay)
	}

	//Average since your first entry, up to today
	function calcAverageAllTime(data){
		var firstday = new Date(data[0].date)
		var today = new Date()
		var daysBetween = diffDates(firstday, today)
		var total = calcTotal(data)
		return (total / daysBetween).toFixed(0)
	}

	//copy/pasted calcWpdToGoal and #setGoal event handler from shitty code file
	//rewrite after figure out where it belongs in app
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
	$("#setGoal").on("submit",function(e){
		e.preventDefault()
		//didn't use FormData here with no repercussions
		var glWds = document.getElementById('goalWds').value;
		var glDt = document.getElementById('goalDate').value;
		console.log(glWds, glDt)
		calcWpdToGoal(glWds, glDt)
		console.log(calcWpdToGoal(glWds, glDt))
		document.getElementById("setGoal").reset()
	})
	//End Shitty Code






})

