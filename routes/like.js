var express = require('express')
var router = express.Router()
var session = require('express-session')
var connection = require('../config/db')

router.get('/:username', function(req, res) {
    if (req.session && req.params.username && req.session.user == req.params.username) {
        req.session.error = "Vous ne pouvez pas vous like."
        res.redirect('../u/' + req.params.username)
    } else if (req.session && req.session.user && req.params.username && req.session.pic0 && req.session.valid) {
        connection.query('SELECT COUNT(*) AS count FROM likes WHERE username = ? AND liked = ?', [req.session.user, req.params.username], (err, result) => {
            if (err) console.log(err)
            if (result[0] && result[0].count == 0) {
                connection.query('INSERT INTO likes SET username = ?, liked = ?', [req.session.user, req.params.username], (err, result) => {
                    if (err) console.log(err)
                    var notification = req.session.firstname + " " + req.session.lastname + " vous like."
                    connection.query('INSERT INTO notif SET username = ?, sender = ?, notification = ?, date = ?', [req.params.username, req.session.user, notification, new Date()], (err, result) => {
                        if (err) console.log(err)
                        res.io.to(global.people[req.params.username]).emit('notif', notification)
                        res.redirect('../u/' + req.params.username)
                    })
                })
            } else {
                connection.query('DELETE FROM likes WHERE username = ? AND liked = ?', [req.session.user, req.params.username], (err) => {
                    if (err) console.log(err)
                    connection.query('SELECT COUNT(*) AS count FROM likes WHERE username = ? AND liked = ?', [req.params.username, req.session.user], (err, result) => {
                        if (err) console.log(err)
                        if (result[0].count > 0) {
                            var notification = req.session.firstname + " " + req.session.lastname + " ne vous like plus."
                            connection.query('INSERT INTO notif SET username = ?, sender = ?, notification = ?, date = ?', [req.params.username, req.session.user, notification, new Date()], (err) => {
                                if (err) console.log(err)
                                res.io.to(global.people[req.params.username]).emit('notif', notification)
                            })
                        }
                        res.redirect('../u/' + req.params.username)
                    })
                })
            }
        })
    } else if (req.session && req.session.user && req.session.valid) {
        req.session.error = "Vous devez ajouter une photo de profil pour like une personne."
        res.redirect('../u/' + req.params.username)
    } else if (req.session && req.session.user) {
        req.session.error = "Vous devez remplir votre profil et ajouter une photo de profil pour like une personne."
        res.redirect('../u/' + req.params.username)
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page."
        res.redirect('/login')
    }
})

module.exports = router
