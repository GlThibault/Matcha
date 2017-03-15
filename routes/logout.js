var express = require('express')
var router = express.Router()
var session = require('express-session')
var connection = require('../config/db')

router.get('/', function(req, res) {
    if (req.session && req.session.user) {
        connection.query('UPDATE users SET online = FALSE, visit = ? WHERE username = ?', [new Date(), req.session.user], (err) => {
            if (err) console.log(err)
        })
    }
    req.session.destroy()
    res.redirect('/login')
})

module.exports = router
