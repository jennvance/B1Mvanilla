var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.all('/createprofile', function(req,res){
	var newProfile = new Profile(req.body)
	console.log(newProfile)
})

// still need to create html templates for each route

// router.get('/onWordCountSubmit', function(req, res){
// 	res.render('', { title: 'Stats'})
// })

// router.get('/setaGoal', function(req, res){
// 	res.render('', { title: 'SetaGoal'})
// })

// router.get('/onWordCountSubmit', function(req, res){
// 	res.render('', { title: 'Stats'})
// })






module.exports = router;
