var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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
