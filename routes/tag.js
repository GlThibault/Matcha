var express = require('express')
var router = express.Router()
var connection = require('../config/db')

router.post('/add', function(req, res) {
    if (req.session && req.session.user && req.body && req.body.tag) {
        connection.query('SELECT COUNT(*) AS count FROM tag WHERE username = ? AND tag = ?', [req.session.user, req.body.tag], (err, result) => {
            if (err) console.log(err)
            if (result[0] && result[0].count == 0) {
                connection.query('INSERT INTO tag SET username = ?, tag = ?', [req.session.user, req.body.tag], (err) => {
                    if (err) console.log(err)
                })
            }
        })
    } else if (req.session && req.session.user) {
        req.session.error = "Vous devez renseigner un tag."
        res.redirect('/profil')
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page."
        res.redirect('/login')
    }
})

router.get('/del/:tag', function(req, res) {
    if (req.session && req.session.user && req.params.tag) {
        connection.query('SELECT COUNT(*) AS count FROM tag WHERE username = ? AND tag = ?', [req.session.user, req.params.tag], (err, result) => {
            if (err) console.log(err)
            if (result[0] && result[0].count != 0) {
                connection.query('DELETE FROM tag WHERE username = ? AND tag = ?', [req.session.user, req.params.tag], (err) => {
                    if (err) console.log(err)
                    res.redirect('/profil')
                })
            }
        })
    } else if (req.session && req.session.user) {
        req.session.error = "Vous devez renseigner un tag."
        res.redirect('/profil')
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page."
        res.redirect('/login')
    }
})

module.exports = router
