$(document).ready(function(){
	//UI only
	$("#li-button").on("click", function(e){
		e.preventDefault()
		$("#signup-form").hide()
		$("#login-form").show()
		$("#li-button").hide()
		$("#su-button").show()
	})
	$("#su-button").on("click", function(e){
		e.preventDefault()
		$("#login-form").hide()
		$("#signup-form").show()
		$("#su-button").hide()
		$("#li-button").show()
	})
	$("#overlay, #x").on("click", function(e){
		e.preventDefault()
		$("#overlay").hide();
	})

	$(".su-panel").on("click", function(e){
		e.stopPropagation()
		// e.preventDefault()
	})


	//DB interactions
	// $("#profileForm").on("submit", function(e){
	// 	e.preventDefault()


	// 	$.ajax({
	// 		url: "/createprofile",
	// 		type: "POST",
	// 		data: new FormData($("#profileForm")[0]),
	// 		cache: false,
	// 		contentType: false,
	// 		processData: false,
	// 		success: function(data){
	// 			console.log(data)
	// 		}
	// 	})

	// 	var tempPhoto = document.getElementById("inputPhoto").files[0]
	// 	console.log(tempPhoto)

	// 	var profileInfo = {
	// 		name: $("#profileForm .name").val(),
	// 		genre: $("#profileForm .genre").val(),
	// 		bio: $("#profileForm .bio").val(),
	// 		favorites: $("#profileForm .favorites").val(),
	// 		photo: tempPhoto.name
	// 	}

	// 	//WTF
	// 	// $.post('/createprofile', profileInfo, function(data){
	// 	// 	console.log(data)
	// 	// 	console.log(profileInfo)
	// 	// })
	// 	//decided it works better without reset
	// 	// document.getElementById("profileForm").reset()

	// 	var name = profileInfo.name;
	// 	var genre = profileInfo.genre;
	// 	var bio = profileInfo.bio;
	// 	var favorites = profileInfo.favorites;
	// 	var photo = profileInfo.photo;

	// 	var nameId = document.getElementById("profileName")
	// 	var genreId = document.getElementById("profileGenre")
	// 	var bioId = document.getElementById("profileBio")
	// 	var favoritesId = document.getElementById("profileFavorites")
	// 	var photoId = document.getElementById("profilePhoto")
	// 	nameId.innerHTML = name;
	// 	genreId.innerHTML = genre;
	// 	bioId.innerHTML = bio;
	// 	favoritesId.innerHTML = favorites;

	// 	//does src not work because something needs to happen to photo on server?
	// 	console.log(photo)
	// 	photoId.src = photo;

	// 	$(".option-1").hide();
	// 	$(".option-2").show()

	// })

	$("#editProfile").on("click", function(e){
		e.preventDefault()
		$(".option-2").hide()
		$(".option-1").show()
	})

	$("#setGoalLink").on("click", function(e){
		e.preventDefault()
		$(".hide").show()
	})

	$("#setGoal").on("submit",function(e){
		e.preventDefault()
		// $("")
	console.log("November")
	//didn't use FormData here with no repercussions
	var glWds = document.getElementById('goalWds').value;
	var glDt = document.getElementById('goalDate').value;
	calcWpdToGoal(glWds, glDt)
	document.getElementById("setGoal").reset()
	})

})