var JennVance = (function(){

	var firstName = 'Jenn'
	var lastName  = 'Vance'

	var jennVance = {
		hobby: 'reading',
		favoriteColor: 'red',
		greet: function(){
			return "Hello, I'm " + firstName + ' ' + lastName
		}
	}

	return jennVance

})()


var foo = function() {
	return 2
}
foo()

(function(){
	return 2
})()

