$(document).ready(function(){
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

})