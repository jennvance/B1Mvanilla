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
		e.preventDefault()
	})


	//DB interactions
	$("#profileForm").on("submit", function(e){
		e.preventDefault()
		var profileInfo = {
			name: $("#profileForm .name").val(),
			genre: $("#profileForm .genre").val(),
			bio: $("#profileForm .bio").val(),
			favorites: $("#profileForm .favorites").val()
			// photo: $("#profileForm .photo").val()
		}
		//WTF
		$.post('/createprofile', profileInfo, function(data){
			console.log(data)
			// window.location.href = "/dashboard"
		})

		document.getElementById("profileForm").reset()

		var name = profileInfo.name;
		var genre = profileInfo.genre;
		var bio = profileInfo.bio;
		var favorites = profileInfo.favorites;
		// var photo = profileInfo.photo;

		var nameId = document.getElementById("profileName")
		var genreId = document.getElementById("profileGenre")
		var bioId = document.getElementById("profileBio")
		var favoritesId = document.getElementById("profileFavorites")
		// var photoId = document.getElementById("profilePhoto")
		nameId.innerHTML = name;
		genreId.innerHTML = genre;
		bioId.innerHTML = bio;
		favoritesId.innerHTML = favorites;
		//is innerHTML correct for an image?
		// photoId.innerHTML = photo;

	})

})