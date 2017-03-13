var express = require('express')
var router = express.Router()
var connection = require('../config/db')

router.post('/', function(req, res, next) {
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
        connection.query('SELECT * FROM block WHERE username = ?', [req.session.user], (err, rows, result) => {
            if (err) console.log(err)
            res.locals.blocks = rows
            connection.query('SELECT lat, lon, username FROM users WHERE username = ? LIMIT 1', [req.session.user], (err, coords, result) => {
                if (err) console.log(err)
                res.locals.userlat = coords[0].lat
                res.locals.userlon = coords[0].lon
                res.locals.username = coords[0].username
                connection.query("SELECT distinct tag FROM tag", (err, rows, result) => {
                    if (err) console.log(err)
                    res.locals.alltags = rows
                    connection.query("SELECT * FROM tag", (err, rows, result) => {
                        if (err) console.log(err)
                        res.locals.tags = rows
                        connection.query("SELECT users.username, users.lastname, users.firstname, users.email, users.bio, users.sexe, users.orientation, users.lat, users.lon, users.interests, users.age, users.pic0, (SELECT count(liked)*10+(SELECT count(*) FROM visits WHERE visits.visited=users.username) FROM likes WHERE likes.liked=users.username) AS likes FROM users LEFT JOIN likes ON likes.username=users.username WHERE ((sexe = ? AND orientation != ?) OR (sexe = ? AND orientation != ?)) AND users.username != ? GROUP BY username, lastname, firstname, email, bio, sexe, orientation, interests, age, pic0, likes, lat, lon ORDER BY likes DESC", [sexe1, orientation1, sexe2, orientation2, req.session.user], (err, rows, result) => {
                            if (err) console.log(err)
                            res.locals.rows = rows
                            res.render('result', {
                                title: 'Result'
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
