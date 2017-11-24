var add = function(first, second){
	if ( typeof second === 'number' ) {
		return first + second
	}
	if ( typeof second === 'undefined' ) {
		return function(number){
			return first + number
		}
	}
}

console.log(add(5,3))

console.log(add(5)(3))

var dostuff = (input) => {
	return input + 1
}


var dostuff = input => { return input + 1 }

var dostuff = (input) => input + 1


