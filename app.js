var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var connection = require('./config/db');
var bcrypt = require('bcrypt');

// Routes Var
var index = require('./routes/index');
var profil = require('./routes/profil');
var login = require('./routes/login');
var register = require('./routes/register');
var forgot = require('./routes/forgot');
var u = require('./routes/u');
var reset = require('./routes/reset');
var logout = require('./routes/logout');

var app = express();

var multer  = require('multer')
var upload = multer({ dest: 'public/images/' })
// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Params
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'ZBm9235Ymx4a',
    resave: true,
    saveUninitialized: true,
    cookie: {secure: false}
}))
app.use(cookieParser());

// Routes
app.use('/', index);
app.use('/login', login);
app.use('/profil', profil);
app.use('/register', register);
app.use('/u', u);
app.use('/forgot', forgot);
app.use('/logout', logout);
// app.use('/reset/:key', reset);
app.use('/reset/:key', function(req, res) {
    var hash = bcrypt.hashSync(req.params.key, 12);
    connection.query('UPDATE users SET password = ?, reset = \'NULL\' WHERE reset = ?', [hash, req.params.key], (err, result) => {
        if (err) throw err
    })
    req.session.error = "Votre mot a été changé. Vous pouvez maintenant vous connecter.";
    res.redirect('/');
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
