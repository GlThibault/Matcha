var express = require('express')
var router = express.Router()
var connection = require('../config/db')

router.get('/', function(req, res, next) {
    if (req.session && req.session.user) {
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
        connection.query('SELECT * FROM block WHERE username = ?', [req.session.user], (err, rows, result) => {
            if (err) console.log(err)
            res.locals.blocks = rows
            connection.query('SELECT lat, lon FROM users WHERE username = ? LIMIT 1', [req.session.user], (err, rows, result) => {
                if (err) console.log(err)
                res.locals.userlat = rows[0].lat
                res.locals.userlon = rows[0].lon
                connection.query("SELECT users.username, users.lastname, users.firstname, users.email, users.bio, users.sexe, users.orientation, users.lat, users.lon, users.interests, users.age, users.pic0, (SELECT count(liked) FROM likes WHERE likes.liked=users.username) AS likes FROM users LEFT JOIN likes ON likes.username=users.username WHERE ((sexe = ? AND orientation != ?) OR (sexe = ? AND orientation != ?)) AND users.username != ? GROUP BY username, lastname, firstname, email, bio, sexe, orientation, interests, age, pic0, likes, lat, lon", [sexe1, orientation1, sexe2, orientation2, req.session.user], (err, rows, result) => {
                    if (err) console.log(err)
                    res.locals.user = req.session.user
                    res.locals.rows = rows
                    res.render('u', {
                        title: 'Utilisateurs'
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
    if (req.session && req.session.user) {
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
        connection.query('SELECT * FROM visits WHERE username = ? AND visited = ? LIMIT 1', [req.session.user, req.params.username], (err, rows, result) => {
            if (err) console.log(err)
            if (!rows[0] && req.session.user != req.params.username)
                connection.query('INSERT INTO visits SET username = ?, visited = ?', [req.session.user, req.params.username], (err, result) => {
                    if (err) console.log(err)
                })
        })
        connection.query('SELECT COUNT(*) AS count FROM block WHERE username = ? AND blocked = ?', [req.session.user, req.params.username], (err, rows, result) => {
            if (err) console.log(err)
            res.locals.block = rows[0].count
            connection.query('SELECT COUNT(*) AS count FROM likes WHERE username = ? AND liked = ?', [req.session.user, req.params.username], (err, rows, result) => {
                if (err) console.log(err)
                res.locals.like = rows[0].count
                connection.query('SELECT COUNT(*) AS count FROM likes WHERE username = ? AND liked = ?', [req.params.username, req.session.user], (err, rows, result) => {
                    if (err) console.log(err)
                    res.locals.liked = rows[0].count
                    connection.query('SELECT count(*) AS pop FROM likes WHERE liked = ?', [req.params.username], (err, rows, result) => {
                        if (err) console.log(err)
                        res.locals.pop = rows[0].pop
                        connection.query('SELECT * FROM users WHERE username = ? LIMIT 1', [req.params.username], (err, rows, result) => {
                            if (err) console.log(err)
                            res.locals.user = req.session.user
                            res.locals.data = rows[0]
                            res.render('user', {
                                title: rows[0]['firstname'] + " " + rows[0]['lastname']
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
