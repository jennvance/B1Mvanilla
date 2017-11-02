var mongoose = require('mongoose')

var ProfileSchema = new mongoose.Schema({
	name: String,
	genre: String,
	bio: String,
	favorites: String
})

var Profile = mongoose.model('Profile', ProfileSchema)

module.exports = Profile