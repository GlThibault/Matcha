var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// Routes
var index = require('./routes/index');
var profil = require('./routes/profil');
var login = require('./routes/login');
var register = require('./routes/register');
var forgot = require('./routes/forgot');
var u = require('./routes/u');

var app = express();


// Cookies
app.use(session({
  secret: 'ZBm9235Ymx4a',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/profil', profil);
app.use('/login', login);
app.use('/register', register);
app.use('/u', u);
app.use('/logout', function (req, res) {
  res.clearCookie(session.user);
  req.session.destroy();
  res.redirect('/')
});
app.use('/forgot', forgot);
app.use('/reset/', function (req, res) {
  console.log('test')
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.user = req.session.user
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
