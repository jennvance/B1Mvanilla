var mongoose = require('mongoose')

var BadgeSchema = new mongoose.Schema({
	title: String,
	summary: String,
	img: String
})

var BadgeModel = mongoose.model('Badge', BadgeSchema)

var aspiringAuthor = new BadgeModel({
	title: "Aspiring Author",
	summary: "You have joined but not written anything.",
	img: "./public/images/example.jpg"
})

var firstEntry = new BadgeModel({
	title: "First Entry",
	summary: "You wrote a thing!",
	img: "./public/images/example2.jpg"
})

module.exports = {
	aspiringAuthor: aspiringAuthor,
	firstEntry: firstEntry
}


