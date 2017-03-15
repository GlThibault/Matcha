var express = require('express')
var router = express.Router()
var connection = require('../config/db')

router.get('/:username', function(req, res) {
    if (req.session && req.params.username && req.session.user == req.params.username) {
        req.session.error = "Vous ne pouvez vous bloquer."
        res.redirect('../u/' + req.params.username)
    } else if (req.session && req.session.user && req.params.username) {
        connection.query('SELECT COUNT(*) AS count FROM block WHERE username = ? AND blocked = ?', [req.session.user, req.params.username], (err, result) => {
            if (err) console.log(err)
            if (result[0] && result[0].count == 0) {
                connection.query('INSERT INTO block SET username = ?, blocked = ?', [req.session.user, req.params.username], (err) => {
                    if (err) console.log(err)
                    else
                        res.redirect('/')
                })
            } else {
                connection.query('DELETE FROM block WHERE username = ? AND blocked = ?', [req.session.user, req.params.username], (err) => {
                    if (err) console.log(err)
                    else
                        res.redirect('../u/' + req.params.username)
                })
            }
        })
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page."
        res.redirect('/login')
    }
})

module.exports = router
