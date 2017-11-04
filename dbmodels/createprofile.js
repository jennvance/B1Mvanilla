var mongoose = require('mongoose')

var ProfileSchema = new mongoose.Schema({
	name: String,
	genre: String,
	bio: String,
	favorites: String,
	photo: String
})

var Profile = mongoose.model('Profile', ProfileSchema)


var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  created: {
    type: Date,
    default: function(){return new Date() }
  }
})

var UserModel = mongoose.model('User', UserSchema)

var UltimateSchema = new mongoose.Schema({
	username: String,
	password: String,
	created: {
		type: Date,
		default: function(){return new Date() }
	},
	name: String,
	genre: String,
	bio: String,
	favorites: String,
	photo: String,
	counts: Array,
	goal: {
		date: Date,
		numwds: Number
	}
})

var UltimateModel = mongoose.model('Ultimate', UltimateSchema)


module.exports = {
	Profile: Profile,
	UserModel: UserModel,
	UltimateModel: UltimateModel
}