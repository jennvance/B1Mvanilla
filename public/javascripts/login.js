$(document).ready(function(){
	$('#signup-form').on('submit', function(event){
		event.preventDefault()
		var signupInfo = {
			username: $('#signup-form .username').val(),
			password: $('#signup-form .password').val()
		}
		console.log(signupInfo)
		$.post('/signup', signupInfo, function(data){
			console.log(data)
			// window.location.href = "/dashboard"
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
			// window.location.href="/dashboard"
		})
		$("#overlay").hide()
	})
})