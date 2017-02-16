var express = require('express');
var router = express.Router();
var connection = require('../config/db')

router.get('/', function(req, res, next) {
    if (req.session && req.session.user) {
        if (req.session.error) {
            res.locals.error = req.session.error
            req.session.error = undefined}
        if (req.session.success) {
            res.locals.success = req.session.success
            req.session.success = undefined}
        connection.query('SELECT * FROM users WHERE bio != \'NULL\'', (err, rows, result) => {
              if (err) throw err
              res.locals.user = req.session.user
              res.locals.rows = rows
              res.render('u', {
                  title: 'Utilisateurs'
              });
          });
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page.";
        res.redirect('/login');
    }
});

router.get('/:username', function(req, res, next) {
    if (req.session && req.session.user) {
        if (req.session.error) {
            res.locals.error = req.session.error
            req.session.error = undefined
        }
        connection.query('SELECT * FROM users WHERE username = ?', [req.params.username], (err, rows, result) => {
            if (err) throw err
            res.locals.user = req.session.user
            res.locals.data = rows[0]
            res.render('user', {
              title: req.params.username,
              username: req.params.username
            });
        });
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page.";
        res.redirect('/login');
    }
});

module.exports = router;
