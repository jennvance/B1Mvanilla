var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')
var sessionsModule = require('client-sessions')
var pug = require('pug');

var routes = require('./routes/index');
var users = require('./routes/users');
var Profile = require('./dbmodels/createprofile')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);


//Begin login code (rewrite later)
mongoose.connect("mongodb://localhost/burndb", function(err){
  if(err){console.error(err)}
    else{ console.info('mongoose initialized')}
})

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  created: {
    type: Date,
    default: function(){return new Date() }
  }
})

var UserModel = mongoose.model('User', UserSchema)

var checkIfLoggedIn = function(req, res, next){
    if ( req.session._id ) {
        console.log("user is logged in")
        next()
    }
    else {
        console.log("no one is logged in")
        res.redirect('/')
    }
}

var checkIfLoggedInForAjax = function(req, res, next){
    if ( req.session._id ) {
        console.log("user is logged in")
        next()
    }
    else {
        console.log("no one is logged in")
        res.send({failure:'not logged in'})
    }
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('./'))

app.use(sessionsModule({
    cookieName: 'auth-cookie',  // front-end cookie name
    secret: 'DR@G0N$',        // the encryption password : keep this safe
    requestKey: 'session',    // we can access our sessions at req.session,
    duration: (86400 * 1000) * 7, // one week in milliseconds
    cookie: {
        ephemeral: false,     // when true, cookie expires when browser is closed
        httpOnly: true,       // when true, the cookie is not accesbile via front-end JavaScript
        secure: false         // when true, cookie will only be read when sent over HTTPS
    }
})) // encrypted cookies!


app.use(function(req, res, next){
    console.log('session? ', req.session)
    next()
})

app.get('/', function(req, res){
    res.sendFile('./views/index2.html', {root:'./'})
})



app.get('/session-test', function(req, res){
    console.log('session? ', req.session)
    if ( !req.session.counter ) {
        req.session.counter = 1
    }
    else {
        req.session.counter++
    }
    res.send('session counter: ' + req.session.counter)
})

app.all('/signup', function(req, res){
    // this user object has a plain-text password
    // we must hash the password before we save the user
    var newUser = new UserModel(req.body)
    bcrypt.genSalt(11, function(saltErr, salt){
        if (saltErr) {console.log(saltErr)}
        console.log('salt generated: ', salt)

        bcrypt.hash(newUser.password, salt, function(hashErr, hashedPassword){
            if ( hashErr){ console.log(hashErr) }
            newUser.password = hashedPassword

            newUser.save(function(saveErr, user){
                if ( saveErr ) { console.log(saveErr)}
                else {
                    req.session._id = user._id // this line is what actually logs the user in. 
                    res.send({success:'success!'})
                }
            })
        })

    })
})

app.post('/login', function(req, res){
    UserModel.findOne({username: req.body.username}, function(err, user){
        if ( err ) { console.log('failed to find user')}
        else if ( !user ) { 
            console.log('no user found')
            res.send('<h1>Failed to log in</h1>')
        }
        else {
            // at this point, we know they're trying to log in as someone who DOES exist in our database, but do they have the right password?
            bcrypt.compare(req.body.password, user.password, function(bcryptErr, matched){
                if ( bcryptErr ) { console.log(bcryptErr)}
                //matched will be either true or false
                else if ( !matched ) {
                    console.log('passwords dont match')
                    res.send('<h1>Failed to log in</h1>')
                }
                else {
                    req.session._id = user._id
                    res.send({success:'success!'})
                } 

            })
        }
    }) 
})

app.get('/dashboard', checkIfLoggedIn, function(req, res){
    UserModel.findOne({_id: req.session._id}, function(err, user){
        if ( user ) {
            res.send(`Hello, ${user.username}. Welcome to your dashboard!
                <a href="/logout">Log Out</a>

            `)
        }
        else {
            res.send("you don't belong here!")
        }
    })
})

app.get('/me', checkIfLoggedInForAjax, function(req, res){
    UserModel.findOne({_id:req.session._id}, function(err, user){
        res.send(user)
    })
})

app.get('/logout', function(req, res){
    req.session.reset()
    res.redirect('/')
})

app.post('/createprofile', function(req,res){
    console.log(req.body)

    var newProfile = new Profile(req.body)
    newProfile.save()
    console.log(newProfile)
    res.send("hi jenn!")
})


//resume node boilerplate
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
