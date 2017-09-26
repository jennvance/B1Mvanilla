$(document).ready(function(){
	$('#signup-form').on('submit', function(event){
		event.preventDefault()
		var signupInfo = {
			username: $('#signup-form .username').val(),
			password: $('#signup-form .password').val()
		}
		$.post('/signup', signupInfo, function(data){
			console.log(data)
			window.location.href = "/dashboard"
		})
	})

	$('#login-form').on('submit', function(event){
		event.preventDefault()
		var signupInfo = {
			username: $('#login-form .username').val(),
			password: $('#login-form .password').val()
		}
		$.post('/login', signupInfo, function(data){
			console.log(data)
			window.location.href="/dashboard"
		})
	})
})