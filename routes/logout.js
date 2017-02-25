var express = require('express')
var router = express.Router()
var session = require('express-session')

router.get('/', function(req, res) {
    res.clearCookie(session.user)
    res.clearCookie(session.sexe)
    res.clearCookie(session.orienation)
    res.clearCookie(session.valid)
    req.session.destroy()
    res.redirect('/login')
})

module.exports = router
