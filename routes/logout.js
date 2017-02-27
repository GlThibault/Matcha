var express = require('express')
var router = express.Router()
var session = require('express-session')

router.get('/', function(req, res) {
    req.session.destroy()
    res.redirect('/login')
})

module.exports = router
