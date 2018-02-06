
var vm = new Vue({
	el: "#burn",
	data: {
		overlay: false,
		message: "Sign Up",
		signup: false,
		count: {
			words: "",
			date: ""
		},
		goal: {
			words: "",
			date: ""
		},
		profile: {
			name: "",
			genre: "",
			bio: "",
			photo: "",
			submitted: false
		},
		stats: {
			allTimeTotal: 1,
			goalWordsPerDay: 0,
			mostProductiveDate: {},
			mostProductiveDay: ""
		}

	},
	methods: {
		//BEGIN Count Functions
		submitCount: function(data, event){
			event.preventDefault()
			console.log(data)
			var formData = {
				words: parseInt(data.words),
				date: new Date(data.date)
			}
			console.log(formData)
			$.ajax({
				url: "/addcount",
				type: "POST",
				data: formData,
				success: (data)=>{
					console.log("success DATA", data)
					//run logic functions
					console.log(this.calcTotal(data))
					this.sortByDate(data)

					//render new calculation
					this.stats.allTimeTotal = this.calcTotal(data)

					//run other logic functions
					console.log(this.selectByMonth(data, 1))
					console.log(this.calcTotal(this.selectByMonth(data, 1)))
					//returns date string with timestamp included but set to 00:00:00:000z
					//figure out why format is weird and where to correct
					console.log(this.findProductiveDate(this.selectByMonth(data,1)))
					
					//calcAverageMonth calculates entire month, but more pressingly need
					//month up until today for current month only
					console.log(this.calcAverageMonth(this.selectByMonth(data, 1)))
					console.log(this.calcAverageAllTime(this.sortByDate(data)))
					//Function might be off by 1 day. Thought it was working before but maybe not.
					console.log(this.findProductiveDay(data))

					this.stats.mostProductiveDate = this.findProductiveDate(this.selectByMonth(data,1))
					this.stats.mostProductiveDay = this.findProductiveDay(data)



					//announce new entry in feed
					// 		var text = data.name = " just wrote " + data.counts[data.counts.length-1].words + " words."
					// 		$("#feed").append(text)

					this.count.words = ""
					this.count.date = ""
				}
			})
		},
		//if submit count before login, error message:
		//"reduce of empty array with no initial value"
		calcTotal: function(data){
			console.log(data)
			//won't need this check if don't show count form before login
			//...but might want to show count form before login
			//in which case needs to account for array AND error string
			if (data.length) {
				return data.map(function(a){
					return a.words
				}).reduce(function(a,b){
					return a+b
				})
			} else {
				console.log("oops!")
				return null
			}

		},
		sortByDate: function(data){
			return data.sort(function(a,b){
				return new Date(a.date).getTime() - new Date(b.date).getTime()
			})
		},
		selectByMonth: function(data, month){
			return data.filter(function(item){
				return new Date(item.date).getMonth() === month
			})
		},
		//returns object containing date and numwords
		findProductiveDate: function(filteredArray){
				return filteredArray.reduce(function(a,b){
					return (b.words > a.words) ? b : a;
				})
		},
		findProductiveDay: function(data){
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
		},
		daysInMonth: function(month, year){
			return new Date(year, month, 0).getDate()
		},
	//Average for given month
	//could pass month in as argument to identify month immediately if needed
		calcAverageMonth: function(filteredOrUnfilteredArray){
			// var this = this
			var tempdate = filteredOrUnfilteredArray[0].date
			var date = new Date(tempdate)
			var year = date.getFullYear()
			var month = date.getMonth() + 1
			var total = this.calcTotal(filteredOrUnfilteredArray)
			var days = this.daysInMonth(month, year)
			// var averageAsNumber = parseFloat((total/days).toFixed(0)) //returns Number
			return (total / days).toFixed(0) //returns String
		},
		diffDates: function(a,b){
			var msPerDay = 1000*60*60*24
			var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
			var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
			return Math.floor((utc2 - utc1) / msPerDay)
		},
//Average since your first entry, up to today
		calcAverageAllTime: function(data){
			// var this = this
			var firstday = new Date(data[0].date)
			var today = new Date()
			var daysBetween = this.diffDates(firstday, today)
			var total = this.calcTotal(data)
			return (total / daysBetween).toFixed(0)
		},
		//END Count Functions
		//BEGIN Goal Functions
		submitGoal: function(data, event){
			event.preventDefault()
			var formData = {
				words: parseInt(data.words),
				date: new Date(data.date)
			}
			console.log("hi=", formData)
			$.ajax({
				url: "/setgoal",
				type: "POST",
				data: formData,
				success: (data)=>{
					console.log(data)
					console.log(this.calcWpdToGoal(data))
					//render
					this.stats.goalWordsPerDay = this.calcWpdToGoal(data)
					//end render
					this.goal.words = ""
					this.goal.date = ""
				}
			})
		},
		calcWpdToGoal: function(data){
			// var this = this
			var today = new Date()
			var goalDate = new Date(data.date)
			//date selector selects for local instead of UTC time and it messes up diffDates() calc.
			//fix later
			var daysBetween = this.diffDates(today, goalDate) + 1
			var goalAmount = data.words
			return ( goalAmount / daysBetween).toFixed(0)
		},
		//END Goal Functions
		//BEGIN Profile Functions
		submitProfile: function(profile, event){
			event.preventDefault()
			console.log(profile)
			$.ajax({
				url: "/createprofile",
				type: "POST",
				data: new FormData($("#profileForm")[0]),
				enctype: 'multipart/form-data',
				cache: false,
				contentType: false,
				processData: false,
				success: (data)=>{
					console.log(data)
					this.renderPhoto(data)
				}
			})
			profile.submitted = true
		},
		renderPhoto: function(data){
			document.getElementById("profilePhoto").src = "/" + data.photo;
		},
		editProfile: function(event){
			event.preventDefault()
			this.profile.submitted = false
		},
		//END Profile Functions
		//BEGIN Login/Signup Functions
		signUp: function(data, event){
			event.preventDefault()
			console.log(data)
			// var this = this
			//working as expected
			$.post('/signup', data, function(data){
				console.log(data)
			})
		},
		logIn: function(){
			console.log("let's log in")
		},
		showOverlay: function(event){
			// event.preventDefault()
			this.overlay = true
		},
		toggleForm: function(){
			console.log('toggle')
			if(this.signup === false){
				this.message = "Log In"
				this.signup = true
			} else if (this.signup === true ){
				this.message = "Sign Up"
				this.signup = false
			}
		}






	},
	created: function(){
		console.log("Hi Jenn <3 !")
	}
})


	// $('#signup-form').on('submit', function(event){

	// 	$.post('/signup', signupInfo, function(data){
	// 		console.log(data)
	// 		// window.location.href = "/dashboard"
	// 		showFriendsOnLogin()
	// 		getAllUsers()
	// 		renderBadge(data)
			
	// 	})
	// 	$("#overlay").hide()
	// })

	// $('#login-form').on('submit', function(event){
	// 	event.preventDefault()
	// 	var signupInfo = {
	// 		username: $('#login-form .username').val(),
	// 		password: $('#login-form .password').val()
	// 	}
	// 	$.post('/login', signupInfo, function(data){
	// 		console.log(data)
	// 		// renderProfileData(data)
	// 		showFriendsOnLogin()
	// 		// renderCharts(data.counts)
	// 		// window.location.href="/dashboard"
	// 		getAllUsers()
	// 	})
	// 	$("#overlay").hide()
	// })















var timeoutId = 0;

$(document).ready(function(){


	var results = []
	function randomizeFeed(){
		var feedItems = []
		//to help us semantically for now, until we need to use func for nonfamous array
		//change these variable names where they appear elsewhere in code to be more semantic
		//also add p tags to var text
		// var text = 
		// var feedAnnounce = 
		// var feedAnnouncement = 
		// var writeItem = data.name = " just wrote " + data.counts[data.counts.length-1].words + " words."
		// var friendItem = "<p>"+ data.friend1 + " and " + data.friend2 + " are now friends.</p>"
		// var badgeItem = "<p>"+ data.name + " just earned the " + data.badges[0].title + " badge.</p>"
		// feedItems.push(writeItem)
		// feedItems.push(friendItem)
		// feedItems.push(badgeItem)

		var famousArray = ["Henry Miller", "Anais Nin", "Stephen King", "J.K. Rowling", "Sylvia Plath", "Earnest Hemingway", "Cormac McCarthy", "Roxane Gay", "Mary Shelley"]
		//maybe rewrite to generate random number?
		var countsArray = [150, 500, 1000, 1200, 2000, 5000]
		var badgesArray = ["Aspiring Author", "Hemingway", "Very Productive", "Consecutive Days"]
		for(var i=0;i<=3; i++){
			var person = famousArray[Math.floor(Math.random() * famousArray.length)]
			var count = countsArray[Math.floor(Math.random() * countsArray.length)]
			var justWrote = "<p>"+ person + " just wrote " + count + " words.</p>"
			// $("#feed").append(justWrote)
			results.push(justWrote)
			for(var j=0; j<=1; j++){
				// var rand = 
				var person1 = famousArray[Math.floor(Math.random() * famousArray.length)]
				var person2 = famousArray[Math.floor(Math.random() * famousArray.length)]
				console.log(person1, person2)
				if(person1 !== person2){
					var nowFriends = "<p>"+ person1 + " and " + person2 + " are now friends.</p>"
					results.push(nowFriends)
					// $("#feed").append(nowFriends)
				}
				
				for(var k=0; k<=1; k++){
					var badgeperson = famousArray[Math.floor(Math.random() * famousArray.length)]
					var badge = badgesArray[Math.floor(Math.random() * badgesArray.length)]
					var earnedBadge = "<p>"+ badgeperson + " just earned the " + badge + " badge.</p>"
					// $("#feed").append(earnedBadge)
					results.push(earnedBadge)
				}
			}
		}
		console.log(results)

	}
	randomizeFeed()

	function appendToDOM(){
		$("#feed").append(results[Math.floor(Math.random() * results.length)])
		timeoutId = setTimeout(appendToDOM, ( (Math.random() * 4) + 3 ) * 1000)
	}
	// appendToDOM()
	timeoutId = setTimeout(appendToDOM, 7000)
	//to stop setTimeout; might not actually be what I need
	clearTimeout(timeoutId)

	
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
	// getFamous()

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























})

