var express = require('express');
var router = express.Router();
var session = require('express-session');
var connection = require('../config/db');

router.get('/:username', function(req, res, next) {
    if (req.session && req.session.user) {
      connection.query('INSERT INTO likes SET username = ?, liked = ?', [req.session.user, req.params.username], (err, result) => {
          if (err) throw err
          else {
            res.redirect('../u/' + req.params.username);
          }
      })
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page.";
        res.redirect('/login');
    }
});

module.exports = router;
