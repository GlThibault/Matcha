var express = require('express')
var router = express.Router()
var connection = require('../config/db')

router.get('/', function(req, res) {
    if (req.session && req.session.user) {
        connection.query('SELECT * FROM block WHERE username = ?', [req.session.user], (err, rows) => {
            if (err) console.log(err)
            res.locals.blocks = rows
            connection.query('SELECT count(*) AS pop FROM likes WHERE liked = ?', [req.session.user], (err, rows) => {
                if (err) console.log(err)
                var pop = rows[0].pop * 10
                connection.query('SELECT count(*) AS visits FROM visits WHERE visited = ?', [req.session.user], (err, rows) => {
                    if (err) console.log(err)
                    res.locals.pop = pop + rows[0].visits
                    connection.query('SELECT likes.username, users.pic0, users.lastname, users.firstname, users.sexe, users.bio, users.age FROM likes LEFT JOIN users ON likes.username=users.username WHERE liked = ? ORDER BY likes.id DESC', [req.session.user], (err, rows) => {
                        if (err) console.log(err)
                        res.locals.likes = rows
                        connection.query('SELECT distinct visits.username, users.pic0, users.lastname, users.firstname, users.sexe, users.bio, users.age FROM visits LEFT JOIN users ON visits.username=users.username WHERE visited = ?', [req.session.user], (err, rows) => {
                            if (err) console.log(err)
                            res.locals.visits = rows
                            connection.query('SELECT * FROM users WHERE username = ? LIMIT 1', [req.session.user], (err, rows) => {
                                if (err) console.log(err)
                                res.locals.data = rows[0]
                                res.render('index', {
                                    title: 'Matcha'
                                })
                            })
                        })
                    })
                })
            })
        })
    } else {
        res.redirect('/register')
    }
})

module.exports = router
