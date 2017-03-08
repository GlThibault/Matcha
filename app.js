// App var
var express = require('express'),
    app = express(),
    path = require('path'),
    favicon = require('serve-favicon'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    redis = require('redis'),
    socketIOSession = require('socket.io.session'),
    client = redis.createClient(),
    Server = require('socket.io'),
    server = require('http').Server(app),
    io = require('socket.io')(server)
    connection = require('./config/db')

// Routes var
var index = require('./routes/index'),
    profil = require('./routes/profil'),
    login = require('./routes/login'),
    register = require('./routes/register'),
    forgot = require('./routes/forgot'),
    u = require('./routes/u'),
    reset = require('./routes/reset'),
    logout = require('./routes/logout'),
    upload = require('./routes/upload'),
    like = require('./routes/like'),
    block = require('./routes/block'),
    report = require('./routes/report'),
    loc = require('./routes/loc'),
    tag = require('./routes/tag')


// Redis
client.on('connect', function() {
    console.log('Connected to redis-server')
})

// View Engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Params
app.use(cookieParser())
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(express.static(path.join(__dirname, 'public')))
var sessionMiddleware = {
    store: new RedisStore({}),
    secret: 'ZBm9235Ymx4a',
    resave: true,
    saveUninitialized: true
}
app.use(session(sessionMiddleware))
var socketSession = socketIOSession(sessionMiddleware)
io.use(socketSession.parser)

app.use(function(req, res, next) {
    res.io = io
    connection.query('SELECT username, notification, date_format(date, "%d/%m/%Y") AS date from notif WHERE username = ? ORDER BY id DESC LIMIT 25', [req.session.user], (err, rows, result) => {
        if (err) console.log(err)
        res.locals.notifs = rows
    })
    if (req.session) {
        if (req.session.error) {
            res.locals.error = req.session.error
            req.session.error = undefined
        }
        if (req.session.success) {
            res.locals.success = req.session.success
            req.session.success = undefined
        }
        if (req.session.warning) {
            res.locals.warning = req.session.warning
            req.session.warning = undefined
        }
        if (req.session.info) {
            res.locals.info = req.session.info
            req.session.info = undefined
        }
        if (req.session.user)
          res.locals.user = req.session.user
    }
    next()
})

// Routes
app.use('/', index)
app.use('/login', login)
app.use('/profil', profil)
app.use('/register', register)
app.use('/u', u)
app.use('/forgot', forgot)
app.use('/logout', logout)
app.use('/reset', reset)
app.use('/upload', upload)
app.use('/like', like)
app.use('/block', block)
app.use('/report', report)
app.use('/loc', loc)
app.use('/tag', tag)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
})

// Socket.io
var people = {}
io.sockets.on("connection", function(socket) {
    connection.query('UPDATE users SET online = TRUE, visit = ? WHERE username = ?', [new Date(), socket.session.user], (err, result) => {
        if (err) console.log(err)
    })
    if (socket.session.user)
        people[socket.session.user] = socket.id
    socket.session.login = true
    socketSession.save(socket)
    socket.on('message', function(data) {
        connection.query('INSERT INTO messages SET username = ?, sender = ?, message = ?', [data.user, data.by, data.message], (err, result) => {
            if (err) console.log(err)
            socket.broadcast.to(global.people[data.user]).emit('message', {
                username: data.by,
                message: data.message
            });
        })
        var notification = data.by + " vous a envoyé un message."
        connection.query('INSERT INTO notif SET username = ?, sender = ?, notification = ?, date = ?', [data.user, data.by, notification, new Date()], (err, result) => {
            if (err) console.log(err)
        })
    });
    socket.on('disconnect', function () {
        connection.query('UPDATE users SET online = FALSE WHERE username = ?', [socket.session.user], (err, result) => {
            if (err) console.log(err)
        })
    })
})
global.people = people
global.io = io

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.user = req.session.user
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = {
    app: app,
    server: server
}
