var express = require('express')
var router = express.Router()
var connection = require('../config/db')

router.get('/', function(req, res) {
    if (req.session && req.session.user) {
        var sexe1 = ''
        var sexe2 = ''
        var orientation1 = ''
        var orientation2 = ''
        if (req.session.sexe == 'Homme') {
            if (req.session.orientation == 'Homosexuelle' || req.session.orientation == 'Bisexuelle') {
                sexe1 = 'Homme'
                orientation1 = 'Hétérosexuelle'
            }
            if (req.session.orientation == 'Hétérosexuelle' || req.session.orientation == 'Bisexuelle') {
                sexe2 = 'Femme'
                orientation2 = 'Homosexuelle'
            }
        } else if (req.session.sexe == 'Femme') {
            if (req.session.orientation == 'Homosexuelle' || req.session.orientation == 'Bisexuelle') {
                sexe1 = 'Femme'
                orientation1 = 'Hétérosexuelle'
            }
            if (req.session.orientation == 'Hétérosexuelle' || req.session.orientation == 'Bisexuelle') {
                sexe2 = 'Homme'
                orientation2 = 'Homosexuelle'
            }
        } else {
            sexe1 = 'Homme'
            sexe2 = 'Femme'
        }
        connection.query('SELECT * FROM block WHERE username = ?', [req.session.user], (err, rows) => {
            if (err) console.log(err)
            res.locals.blocks = rows
            connection.query('SELECT lat, lon, username FROM users WHERE username = ? LIMIT 1', [req.session.user], (err, coords) => {
                if (err) console.log(err)
                res.locals.userlat = coords[0].lat
                res.locals.userlon = coords[0].lon
                res.locals.username = coords[0].username
                connection.query("SELECT distinct tag FROM tag", (err, rows) => {
                    if (err) console.log(err)
                    res.locals.alltags = rows
                    connection.query("SELECT * FROM tag", (err, rows) => {
                        if (err) console.log(err)
                        res.locals.tags = rows
                        connection.query("SELECT users.username, users.lastname, users.firstname, users.email, users.bio, users.sexe, users.orientation, users.lat, users.lon, users.interests, users.age, users.pic0, \
                        (SELECT count(liked)*10+(SELECT count(*) FROM visits WHERE visits.visited=users.username) FROM likes WHERE likes.liked=users.username) AS likes FROM users \
                        LEFT JOIN likes ON likes.username=users.username WHERE ((sexe = ? AND orientation != ?) OR (sexe = ? AND orientation != ?)) AND users.username != ? \
                        GROUP BY username, lastname, firstname, email, bio, sexe, orientation, interests, age, pic0, likes, lat, lon ORDER BY likes DESC", [sexe1, orientation1, sexe2, orientation2, req.session.user], (err, rows) => {
                            if (err) console.log(err)
                            res.locals.rows = rows
                            res.render('u', {
                                title: 'Utilisateurs'
                            })
                        })
                    })
                })
            })
        })
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page."
        res.redirect('/login')
    }
})

router.get('/:username', function(req, res, next) {
    if (req.session && req.session.user && req.session.firstname && req.session.lastname && req.params.username) {
        if (req.session.error) {
            res.locals.error = req.session.error
            req.session.error = undefined
        }
        if (req.session.success) {
            res.locals.success = req.session.success
            req.session.success = undefined
        }
        if (req.session.info) {
            res.locals.info = req.session.info
            req.session.info = undefined
        }
        connection.query('SELECT username FROM users WHERE username = ? LIMIT 1', [req.params.username], (err, rows) => {
            if (err) console.log(err)
            if (rows[0] && req.session.user != req.params.username) {
                connection.query('INSERT INTO visits SET username = ?, visited = ?', [req.session.user, req.params.username], (err) => {
                    if (err) console.log(err)
                    var notification = req.session.firstname + " " + req.session.lastname + " a visité votre profil."
                    connection.query('INSERT INTO notif SET username = ?, sender = ?, notification = ?, date = ?', [req.params.username, req.session.user, notification, new Date()], (err) => {
                        if (err) console.log(err)
                        res.io.to(global.people[req.params.username]).emit('notif', notification)
                    })
                })
            }
        })
        connection.query('SELECT COUNT(*) AS count FROM block WHERE username = ? AND blocked = ?', [req.session.user, req.params.username], (err, rows) => {
            if (err) console.log(err)
            res.locals.block = rows[0].count
            connection.query('SELECT COUNT(*) AS count FROM likes WHERE username = ? AND liked = ?', [req.session.user, req.params.username], (err, rows) => {
                if (err) console.log(err)
                res.locals.like = rows[0].count
                connection.query('SELECT COUNT(*) AS count FROM likes WHERE username = ? AND liked = ?', [req.params.username, req.session.user], (err, rows) => {
                    if (err) console.log(err)
                    res.locals.liked = rows[0].count
                    connection.query('SELECT count(*) AS pop FROM likes WHERE liked = ?', [req.params.username], (err, rows) => {
                        if (err) console.log(err)
                        var pop = rows[0].pop * 10
                        connection.query('SELECT count(*) AS visits FROM visits WHERE visited = ?', [req.params.username], (err, rows) => {
                            if (err) console.log(err)
                            res.locals.pop = pop + rows[0].visits
                            connection.query('SELECT * FROM (SELECT * FROM messages WHERE (username = ? AND sender = ?) OR (username = ? AND sender = ?) ORDER BY id DESC LIMIT 35) g ORDER BY id ASC', [req.session.user, req.params.username, req.params.username, req.session.user], (err, rows) => {
                                if (err) console.log(err)
                                res.locals.messages = rows
                                connection.query('SELECT * FROM tag WHERE username = ?', [req.params.username], (err, rows) => {
                                    if (err) console.log(err)
                                    res.locals.tags = rows
                                    connection.query('SELECT *, date_format(visit, "%d/%m/%Y") AS date FROM users WHERE username = ? LIMIT 1', [req.params.username], (err, rows) => {
                                        if (err) console.log(err)
                                        if (rows[0]) {
                                            res.locals.data = rows[0]
                                            if (req.session.pic0)
                                              res.locals.active = 1
                                            else
                                              res.locals.active = 0
                                            res.render('user', {
                                                title: rows[0]['firstname'] + " " + rows[0]['lastname']
                                            })
                                        } else {
                                            var err = new Error('Not Found')
                                            err.status = 404
                                            next(err);
                                        }
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page."
        res.redirect('/login')
    }
})

module.exports = router
