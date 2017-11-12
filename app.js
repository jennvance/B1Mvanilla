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

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


var routes = require('./routes/index');
var users = require('./routes/users');
var UltimateModel = require('./dbmodels/createprofile')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./uploads'))

// app.use('/', routes);
// app.use('/users', users);


//Begin login code (rewrite later)
mongoose.connect("mongodb://localhost/burndb", function(err){
  if(err){console.error(err)}
    else{ console.info('mongoose initialized')}
})

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
    
    console.log('body??', req.body)
    var newUser = new UltimateModel(req.body)
    console.log("user: " + newUser)
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
    UltimateModel.findOne({username: req.body.username}, function(err, user){
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
    UltimateModel.findOne({_id: req.session._id}, function(err, user){
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
    UltimateModel.findOne({_id:req.session._id}, function(err, user){
        res.send(user)
    })
})

app.get('/logout', function(req, res){
    req.session.reset()
    res.redirect('/')
})

app.post('/createprofile', upload.single('photo'), function(req,res){
    console.log(req.body)
    console.log(req.file)

    UltimateModel.findOne({_id:req.session._id}, function(err,user){
        if ( user ){
            user.name = req.body.name;
            user.genre = req.body.genre;
            user.bio = req.body.bio;
            user.favorites = req.body.favorites;
            //breaks code if not required for submit
            user.photo = req.file.filename;

            user.save(function(){
                // console.log(UltimateModel)
            })

        }
        //else (i.e. if no user) direct to signup (and login?)


        res.send(user)
    })
    
})

app.post("/addcount", function(req,res){
    console.log("request body", req.body)
    UltimateModel.findOne({_id:req.session._id}, function(err, user){
        if(user){
            count = {
                date: req.body.date,
                words: req.body.words
            }
            user.counts.push(count)
            user.save()
            res.send(user.counts)
        }
        // else {
        //     //show overlay containing login
        // }
    })
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
