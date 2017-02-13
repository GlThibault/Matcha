var express = require('express');
var router = express.Router();
var session = require('express-session');

router.get('/', function(req, res) {
    res.clearCookie(session.user);
    req.session.destroy();
    req.session.success = "Vous êtes maintenant déconnecté";
    res.redirect('/')
});

module.exports = router;
