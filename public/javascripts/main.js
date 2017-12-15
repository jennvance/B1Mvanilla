$(document).ready(function(){


	function randomizeFeed(array){
		var feedItems = []
		//change these variable names where they appear elsewhere in code to be more semantic
		var text = data.name = " just wrote " + data.counts[data.counts.length-1].words + " words."
		var feedAnnounce = "<p>"+ data.friend1 + " and " + data.friend2 + " are now friends.</p>"
		var feedAnnouncement = "<p>"+ data.name + " just earned the " + data.badges[0].title + " badge.</p>"
		var writeItem = 
		var friendItem = 
		var badgeItem = 



		$("#feed").append(text)
	}

	function getFamous(){
		$.ajax({
			url: "/getfamous",
			type: "GET",
			success: function(data){
				console.log(data)
				console.log(generateRandom(data))
				renderProfileData(generateRandom(data))
			}
		})
	}
	getFamous()

	function generateRandom(array){
		return array[0][Math.floor(Math.random() * array[0].length)]
	}



	//Wrote function but didn't use it. Maybe delete later.
	function getCounts(){
		$.ajax({
			url: "/getcounts",
			type: "GET",
			success: function(data){
				//deleted renderCharts function
				renderCharts(data.counts)
			}
		})
	}

	function showFriendsOnLogin(){
		$("#friend-bucket").css("display", "flex")

	}

	function renderBadge(data){
		console.log(data)
		$(".badge-title").html(data.badges[0].title)
		$(".badge-summary").html(data.badges[0].summary)
		$(".badge-img").attr("src", data.badges[0].img)
		var feedAnnouncement = "<p>"+ data.name + " just earned the " + data.badges[0].title + " badge.</p>"
		$("#feed").append(feedAnnouncement)
	}


	

	$('#signup-form').on('submit', function(event){
		event.preventDefault()
		var signupInfo = {
			name:$('#signup-form .name').val(),
			username: $('#signup-form .username').val(),
			password: $('#signup-form .password').val()
		}
		console.log(signupInfo)
		$.post('/signup', signupInfo, function(data){
			console.log(data)
			// window.location.href = "/dashboard"
			showFriendsOnLogin()
			getAllUsers()
			renderBadge(data)
			$("#profileName").html(data.name)
		})
		$("#overlay").hide()
	})

	$('#login-form').on('submit', function(event){
		event.preventDefault()
		var signupInfo = {
			username: $('#login-form .username').val(),
			password: $('#login-form .password').val()
		}
		$.post('/login', signupInfo, function(data){
			console.log(data)
			renderProfileData(data)
			showFriendsOnLogin()
			// renderCharts(data.counts)
			// window.location.href="/dashboard"
			getAllUsers()
		})
		$("#overlay").hide()
	})

	function getAllUsers(){
		$.ajax({
			url: "/getfriends",
			type: "GET",
			success: function(data){
				console.log(data)
				renderAllUsers(data)
			}
		})
	}

	


	function renderAllUsers(data){
		var newHTML = []
		var limit = 7
		if (data.length <=7){
			limit = data.length
		}
		//do I need this else?
		else {
			limit = 7
		}
		for(var i=0; i<=limit; i++){
			var entry = {
				name: data[i].name,
				genre: data[i].genre,
				photo: data[i].photo
			}
			var entryHTML = "<div class=\"friend-single\"><img src=\"/" + entry.photo + "\" class=\"friend-single-photo\"><h4 class=\"friend-single-name\">" + entry.name + "</h4><h5>" + entry.genre + "</h5><button data-id='" + data[i]._id + "' class=\"button followButton\">Follow</button></div>"

			newHTML.push(entryHTML)
		}
		//rendering All Users in Friend Bucket doesn't work
		//bc getAllUsers gets called while #friend-bucket is display:none
		//fixed temporarily by putting function call in login 
		//(wait, why temporarily?)
		$("#friend-bucket").html(newHTML.join(""))
	}

	$("#friend-bucket").on("click", ".followButton", function(event){
		console.log($(event.target).attr('data-id'))
		$.post("/addfriend", {newFriendId: $(event.target).attr('data-id') }, function(data){
			var feedAnnounce = "<p>"+ data.friend1 + " and " + data.friend2 + " are now friends.</p>"
			$("#feed").append(feedAnnounce)
		})

		
	})


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
		$("#profileName").html(data.name)
		$("#profileGenre").html(data.genre)
		$("#profileBio").html(data.bio)
		$("#profileFavorites").html(data.favorites)
		document.getElementById("profilePhoto").src = "/" + data.photo;
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
				console.log("success DATA", data)
				calcTotal(data)
				console.log(calcTotal(data))
				renderTotal(calcTotal(data))
				sortByDate(data)
				console.log(selectByMonth(data, 10))
				console.log(calcTotal(selectByMonth(data, 10)))
				console.log(findProductiveDate(selectByMonth(data,10)))
				console.log(calcAverageMonth(selectByMonth(data, 10)))
				console.log(calcAverageAllTime(sortByDate(data)))
				//Function might be off by 1 day. Thought it was working before but maybe not.
				console.log(findProductiveDay(data))
				var text = data.name = " just wrote " + data.counts[data.counts.length-1].words + " words."
				$("#feed").append(text)
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
	
	function findProductiveDay(data){
		var days = [0,0,0,0,0,0,0]
		var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		for(var i=0; i<data.length;i++){
			//find day of week for each date in allCounts
			var dayOfWeek = new Date(data[i].date).getDay()
			//sort by day of week and keep running total for each day of week
			days[dayOfWeek] += data[i].words
		}
		//compare totals of each day of week and find highest
		var highestCount = days.reduce(function(a,b){
			return Math.max(a,b)
		})
		var highestIndex = days.indexOf(highestCount)
		var productiveDay = dayNames[highestIndex]
		return productiveDay
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

	$("#setGoal").on("submit", function(event){
		event.preventDefault()
		goalData = {
			date: $("#goalDate").val(),
			words: $("#goalWds").val()
		}
		$.ajax({
			url: "/setgoal",
			type: "POST",
			data: goalData,
			success: function(data){
				console.log(calcWpdToGoal(data))
				renderWpdToGoal(calcWpdToGoal(data))
			}
		})
		$("#setGoal")[0].reset()
	})

	function calcWpdToGoal(data){
		var today = new Date()
		var goalDate = new Date(data.date)
		//date selector selects for local instead of UTC time and it messes up diffDates() calc.
		//fix later
		var daysBetween = diffDates(today, goalDate) + 1
		var goalAmount = data.words
		return ( goalAmount / daysBetween).toFixed(0)
	}

	function renderWpdToGoal(wpdToGoal){
		$("#wpdToGoal").text(wpdToGoal)
	}




})

