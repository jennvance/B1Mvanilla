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
	})

})