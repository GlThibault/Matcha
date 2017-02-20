var express = require('express');
var router = express.Router();
var connection = require('../config/db')

router.get('/:username', function(req, res, next) {
    if (req.session && req.session.user == req.params.username) {
        req.session.error = "Vous ne pouvez vous signaler.";
        res.redirect('../u/' + req.params.username);
    } else if (req.session && req.session.user) {
      req.session.error = "WIP.";
      res.redirect('../u/' + req.params.username);
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page.";
        res.redirect('/login');
    }
});

module.exports = router;
