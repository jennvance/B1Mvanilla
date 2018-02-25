
var vm = new Vue({
	el: "#burn",
	data: {
		loggedIn: false,
		logo: "logo",
		overlay: false,
		message: "Sign Up",
		showSignup: false,
		showProfileForm: false,
		showProfile: true,
		active: false,
		signIn: {
			name: "",
			username: "",
			password: ""
		},
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
			photo: ""
		},
		stats: {
			allTimeTotal: 1,
			allTimeAverage: 0,
			monthTotal: 0,
			monthAverage: 0,
			goalWordsPerDay: 0,
			mostProductiveDate: {},
			mostProductiveDay: "First, Write!"
		},
		timeoutId: 0,
		famousFeedStaging: [],
		//Raph, removing initial obj here
		//creates Vue blip
		//but leaving it
		//creates empty list item in UI
		famousFeedRender: [{
			text: "",
			id: 0
		}],
		famous: [],
		youMayKnow: [],
		friends: [],
		announcements: [{
			text: "",
			id: 0
		}]
		

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
					if(data==="Please log in"){
						this.overlay = true
						//except also need to save count
						//and add to counts upon login
					} else {

					console.log("success DATA", data)
					//run logic functions
					this.sortByDate(data)
					//render new calculation
					this.stats.allTimeTotal = this.calcTotal(data)
					//run other logic functions
					console.log(this.selectByMonth(data, 1))
					this.stats.monthTotal = this.calcTotal(this.selectByMonth(data, 1))
					//calcAverageMonth calculates entire month, but more pressingly need
					//month up until today for current month only
					this.stats.monthAverage = this.calcAverageMonth(this.selectByMonth(data, 1))
					console.log(this.calcAverageMonth(this.selectByMonth(data, 1)))
					//returns infinity if run on the first day user signs up, because #days = 0
					//also returns negative number if user enters count from before signup date
					this.stats.allTimeAverage = this.calcAverageAllTime(this.sortByDate(data))
					//Function might be off by 1 day. Thought it was working before but maybe not.
					console.log(this.findProductiveDay(data))
					//returns date string with timestamp included but set to 00:00:00:000z
					//figure out why format is weird and where to correct
					this.stats.mostProductiveDate = this.findProductiveDate(this.selectByMonth(data,1))
					this.stats.mostProductiveDay = this.findProductiveDay(data)
					//announce new entry in feed
					var announcement = this.profile.name + " just wrote " + data[data.length-1].words + " words."
					var identification = this.announcements.length
					this.announcements.unshift({
						text: announcement,
						id: identification
					})

					this.count.words = ""
					this.count.date = ""						
					}

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
			if(daysBetween === 0){
				console.log("Infinity Averted!")
				//account for identical values for
				//zero days between and one actual day between
				daysBetween = 1
			}
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
			// console.log(profile)
			$.ajax({
				url: "/createprofile",
				type: "POST",
				data: new FormData($("#profileForm")[0]),
				enctype: 'multipart/form-data',
				cache: false,
				contentType: false,
				processData: false,
				success: (data)=>{
					this.renderPhoto(data)
				}
			})
			this.showProfileForm = false
			this.showProfile = true
		},
		renderPhoto: function(data){
			if(data.photo){
				document.getElementById("profilePhoto").src = "/" + data.photo;
			}
		},
		editProfile: function(event){
			event.preventDefault()
			this.showProfile = false
			this.showProfileForm = true
		},
		//END Profile Functions
		//BEGIN Login/Signup Functions
		signUp: function(data, event){
			event.preventDefault()
			var self = this
			$.post('/signup', data, function(successData){
				//if user already exists, need to redirect to login
				if(successData === "<h1>User already exists; please log in.</h1>"){
					self.toggleForm()
					self.signIn.password = ""
				} else {
					self.profile.name = 
					self.profile.genre = 
					self.profile = {
						name: self.signIn.name,
						genre: "",
						bio: "",
						photo: ""
					},
					document.getElementById("profilePhoto").src = "/" + self.profile.photo;
		
					self.signIn = {
						name: "",
						username: "",
						password: ""
					}
					self.overlay = false
				}
				self.loggedIn = true
				self.showFriendsOnLogin()
				self.getStrangersOnly()
				// self.getAllUsers()
				// renderBadge(sucessData)
				
			})
		},
		logIn: function(data, event){
			event.preventDefault()
			console.log(data)
			var self = this
			$.post('/login', data, function(successData){
				if(successData === "Failed to log in"){
					self.toggleForm()
				} else {
					self.renderUser(successData)
					self.renderPhoto(successData)
					self.showProfile = true
					self.showFriendsOnLogin()
					self.getStrangersOnly()	
					this.overlay = false
					this.loggedIn = true				
				}
			})
			this.signIn = {
				name: "",
				username: "",
				password: ""
			}

		},
		renderUser: function(data){
				this.profile.name = data.name
				this.profile.genre = data.genre
				this.profile.bio = data.bio
				for(var i=0; i<data.friends.length; i++){
					this.friends.push(data.friends[i])
				}
		},
		showOverlay: function(event){
			// event.preventDefault()
			this.overlay = true
		},
		hideOverlay: function(event){
			event.preventDefault()
			this.overlay = false
		},
		toggleForm: function(){
			console.log('toggle')
			if(this.showSignup === false){
				this.message = "Log In"
				this.showSignup = true
			} else if (this.showSignup === true ){
				this.message = "Sign Up"
				this.showSignup = false
			}
		},
		//END Login/Signup Functions
		//BEGIN Friend Functions
		showFriendsOnLogin: function(){
			// $("#follow-bucket").css("display", "flex")
		},
		//need to remove user's own profile plus all friend profiles
		getStrangersOnly: function(){
			$.ajax({
				url: "/getstrangers",
				type: "GET",
				success: (data)=>{
					console.log(data)
					this.renderStrangers(data)

				}
			})
		},
		//need to exclude self from view of all users
		getAllUsers: function(){
			$.ajax({
				url: "/getallusers",
				type: "GET",
				success: (data)=>{
					console.log(data)
					this.renderAllUsers(data)
					// return data
				}
			})
		},
		renderStrangers: function(data){
			for(var i=0; i<data.length; i++){
				this.youMayKnow.push({
					name: data[i].name,
					genre: data[i].genre,
					bio: data[i].bio,
					photo: data[i].photo,
					id: data[i]._id
				})
			}
			// console.log(this.youMayKnow)
		},
		hover:function(item, v){
			item.hovered = v
			console.log(item)

		},
		addFriend: function(person, event){
			event.preventDefault()
			console.log(person)
			var id = {newFriendId: person.id}
			$.ajax({
				url: "/addfriend",
				type: "POST",
				data: id,
				success: (data)=>{
					console.log(data)
					if(data === "friends already"){
						console.log("You're already friends!")
					} else {
						console.log("you two are friends now:", data)
						var announcement = data.friend1 + " is now following " + data.friend2 + "."
						var identification = this.announcements.length
						this.announcements.unshift({
							text: announcement,
							id: identification
						})
						for(var i=0; i<this.youMayKnow.length; i++) {
							if(this.youMayKnow[i].name === data.friend2){
								this.youMayKnow.splice(i, 1)
								console.log(this.youMayKnow)
							}
						}

						this.friends = data.fullList
						for(var i=0;i<this.friends.length;i++){
							this.friends[i].hovered = false
						}
						console.log(this.friends)

						
						// this.renderFriends()					
					}
					
				}

			})
		},
		renderFriends: function(data){
			// for(var i=0;i<data.length;i++){
			// 	this.friends.push({
			// 		name: data[i].name,
			// 		genre: data[i].genre,
			// 		bio: data[i].bio,
			// 		photo: data[i].photo,
			// 		id: data[i]._id
			// 	})
			// }
			// console.log(this.friends)
		},
		renderLogo: function(){
			var logoArray = ["b","u","r","n"," ","o","n","e"," ","m","i","l","l","i","o","n"]
			//at interval, remove index 0 from array and add to this.logo string
			console.log("hey", this.logo)
			var typedLogo = setInterval(function(){
				var item = logoArray.shift()
				if(this.logo){
					this.logo = this.logo + item
				}
				// console.log(item)
				// console.log(this.logo)
				// console.log(this.logo)
				if(logoArray.length===0){
					clearInterval(typedLogo)
				}
			},500)
		},
		getFamous: function(){
			$.ajax({
				url: "/getfamous",
				type: "GET",
				success: (data)=>{
					console.log(data)
					this.renderRandom(this.generateRandom(data))
					//change name of renderStrangers?? since not as semantic here
					this.renderStrangers(data)
				}
			})
		},
		generateRandom: function(array){
			console.log(array)
			return array[Math.floor(Math.random() * array.length)]
		},
		renderRandom: function(random){
			console.log(random)
			this.profile.name = random.name
			this.profile.genre = random.genre
			this.profile.bio = random.bio
			this.renderPhoto(random)
		},
		randomizeFamousFeed: function(){
			//lots of bugs
			//need to prevent "...wrote 0 words"
			//need to remove item from staging array after adding to render array
			//to prevent repeats
			//need to shorten text so feed isn't multi-line

			var famousArray = ["Henry Miller", "Anais Nin", "Truman Capote", "F. Scott Fitzgerald", "Sylvia Plath", "Earnest Hemingway", "Mary Shelley", "Virginia Woolf"]
			var badgesArray = ["Hemingway", "Very Productive", "Streak", "Completed Manuscript"]
			for(var i=0;i<=3;i++){
				var person = famousArray[Math.floor(Math.random() * famousArray.length)]
				var count = Math.floor(Math.random() * 1000)
				var justWrote = person + " just wrote " + count + " words."
				this.famousFeedStaging.push(justWrote)
				for(var j=0; j<=1; j++){
					var person1 = famousArray[Math.floor(Math.random() * famousArray.length)]
					var person2 = famousArray[Math.floor(Math.random() * famousArray.length)]
					if(person1 !== person2){
						var nowFriends = person1 + " and " + person2 + " are now friends."
						this.famousFeedStaging.push(nowFriends)
					}
					for(var k=0; k<=1; k++){
						var badgeperson = famousArray[Math.floor(Math.random() * famousArray.length)]
						var badge = badgesArray[Math.floor(Math.random() * badgesArray.length)]
						var earnedBadge = badgeperson + " just earned the " + badge + " badge."
						this.famousFeedStaging.push(earnedBadge)
					}
				}

			}
			console.log(this.famousFeedStaging)
		},
		appendToDOM: function(){
			this.famousFeedRender.unshift({
				text: this.famousFeedStaging[Math.floor(Math.random() * this.famousFeedStaging.length)],
				id: this.famousFeedRender.length
			})

			this.timeoutId = setTimeout(this.appendToDOM, ( (Math.random() * 13 ) + 7 ) * 2000)
		}
	},
	created: function(){
		console.log("Hi Jenn <3 !", this.logo)
		// this.renderLogo()
		this.getFamous()
		//puts feed items into array
		this.randomizeFamousFeed()
		// adds feed items to array at intervals
		this.appendToDOM()
		this.timeoutId = setTimeout(this.appendToDOM, 10000)
	}
})


	//to stop setTimeout; might not actually be what I need
	// clearTimeout(timeoutId)



	function renderBadge(data){
		console.log(data)
		$(".badge-title").html(data.badges[0].title)
		$(".badge-summary").html(data.badges[0].summary)
		$(".badge-img").attr("src", data.badges[0].img)
		var feedAnnouncement = "<p>"+ data.name + " just earned the " + data.badges[0].title + " badge.</p>"
		$("#feed").append(feedAnnouncement)
	}



	


/*

Upon visiting page first time:

LEFT side order:
1. FRIEND profiles (view 4 at a time, allow user to click through to reveal 4 more in "window")
2. FEED of all FRIENDS (including famous, which will be friends)
3. PEOPLE TO FOLLOW (all site users, randomized)

PROFILE reads famous author
CENTER reads marketing txt; below it is add count form
LEFT reads "people you may know", famous only, no follow buttons
BADGES hidden
FEED reveals famous announcements

Upon signup:

PROFILE reads blank; "please fill out"
CENTER reads add count form
LEFT reads: auto-follow famous; add Follow buttons
(and people you may know)
BADGES revealed; Aspiring Author awarded
FEED reveals 
GOAL button visible; can click for form


Upon login:

PROFILE reads current profile
CENTER stays same
LEFT reads famous AND following
(and people you may know)
BADGES stays same
GOAL button visible



Upon submitting profile, following friend, adding count:

following friend:
move user from "youMayKnow" to friends
remove "follow" button; replace with profile data
this will fix bug where if you're already friends, the
server returns undefined

*/


	











