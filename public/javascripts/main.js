//Raph new Vue() vs. Vue.extend()?

var vm = new Vue({
	el: "#burn",
	data: {
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
			//assign "this" to variable to access inside Ajax call
			var self = this
			var formData = {
				words: parseInt(data.words),
				date: new Date(data.date)
			}
			console.log(formData)
			$.ajax({
				url: "/addcount",
				type: "POST",
				data: formData,
				success: function(data){
					console.log("success DATA", data)
					//run logic functions
					console.log(self.calcTotal(data))
					self.sortByDate(data)

					//render new calculation
					self.stats.allTimeTotal = self.calcTotal(data)

					//run other logic functions
					console.log(self.selectByMonth(data, 1))
					console.log(self.calcTotal(self.selectByMonth(data, 1)))
					//returns date string with timestamp included but set to 00:00:00:000z
					//figure out why format is weird and where to correct
					console.log(self.findProductiveDate(self.selectByMonth(data,1)))
					
					console.log(self.calcAverageMonth(self.selectByMonth(data, 1)))
					console.log(self.calcAverageAllTime(self.sortByDate(data)))
					//Function might be off by 1 day. Thought it was working before but maybe not.
					console.log(self.findProductiveDay(data))

					self.stats.mostProductiveDate = self.findProductiveDate(self.selectByMonth(data,1))
					self.stats.mostProductiveDay = self.findProductiveDay(data)



					//announce new entry in feed
					// 		var text = data.name = " just wrote " + data.counts[data.counts.length-1].words + " words."
					// 		$("#feed").append(text)

					self.count.words = ""
					self.count.date = ""
				}
			})
		},
		calcTotal: function(data){
			return data.map(function(a){
				return a.words
			}).reduce(function(a,b){
				return a+b
			})
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
			var self = this
			var tempdate = filteredOrUnfilteredArray[0].date
			var date = new Date(tempdate)
			var year = date.getFullYear()
			var month = date.getMonth() + 1
			var total = self.calcTotal(filteredOrUnfilteredArray)
			var days = self.daysInMonth(month, year)
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
			var self = this
			var firstday = new Date(data[0].date)
			var today = new Date()
			var daysBetween = self.diffDates(firstday, today)
			var total = self.calcTotal(data)
			return (total / daysBetween).toFixed(0)
		},
		//END Count Functions
		//BEGIN Goal Functions
		submitGoal: function(data, event){
			event.preventDefault()
			var self = this
			var formData = {
				words: parseInt(data.words),
				date: new Date(data.date)
			}
			console.log("hi=", formData)
			$.ajax({
				url: "/setgoal",
				type: "POST",
				data: formData,
				success: function(data){
					console.log(data)
					console.log(self.calcWpdToGoal(data))
					//render
					self.stats.goalWordsPerDay = self.calcWpdToGoal(data)
					//end render
					self.goal.words = ""
					self.goal.date = ""
				}
			})
		},
		calcWpdToGoal: function(data){
			var self = this
			var today = new Date()
			var goalDate = new Date(data.date)
			//date selector selects for local instead of UTC time and it messes up diffDates() calc.
			//fix later
			var daysBetween = self.diffDates(today, goalDate) + 1
			var goalAmount = data.words
			return ( goalAmount / daysBetween).toFixed(0)
		},
		//END Goal Functions
		//BEGIN Profile Functions
		submitProfile: function(profile, event){
			event.preventDefault()
			console.log(profile)
			var self = this
			$.ajax({
				url: "/createprofile",
				type: "POST",
				data: new FormData($("#profileForm")[0]),
				enctype: 'multipart/form-data',
				cache: false,
				contentType: false,
				processData: false,
				success: function(data){
					console.log(data)
					self.renderPhoto(data)
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
		}
		//END Profile Functions





	},
	created: function(){
		console.log("Hi Jenn <3 !")
	}
})

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
			// renderProfileData(data)
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























})

