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


	$(".su-panel").on("click", function(e){
		e.stopPropagation()
		// e.preventDefault()
	})

	$("#editProfile").on("click", function(e){
		e.preventDefault()
		$(".option-2").hide()
		$(".option-1").show()
	})

	$("#setGoalLink").on("click", function(e){
		e.preventDefault()
		$(".hide").show()
	})

	$("#showOverlay").on("click", function(){
		$("#overlay").show()
	})
	$("#overlay, #x").on("click", function(e){
		e.preventDefault()
		$("#overlay").hide();
	})

})