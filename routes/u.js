var express = require('express');
var router = express.Router();
var connection = require('../config/db')

router.get('/', function(req, res, next) {
    if (req.session && req.session.user) {
        if (req.session.error) {
            res.locals.error = req.session.error
            req.session.error = undefined
        }
        if (req.session.success) {
            res.locals.success = req.session.success
            req.session.success = undefined
        }
        connection.query('SELECT username, COUNT(DISTINCT username) AS count FROM likes GROUP BY username', (err, rows, result) => {
            if (err) throw err
            res.locals.likes = rows
            connection.query('SELECT * FROM users WHERE bio != \'NULL\'', (err, rows, result) => {
                if (err) throw err
                res.locals.user = req.session.user
                res.locals.rows = rows
                res.render('u', {
                    title: 'Utilisateurs'
                });
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
        connection.query('SELECT COUNT(*) AS count FROM likes WHERE username = ? AND liked = ?', [req.session.user, req.params.username], (err, result) => {
            if (err) throw err
            res.locals.likes = result[0].count
            connection.query('SELECT * FROM users WHERE username = ?', [req.params.username], (err, rows, result) => {
                if (err) throw err
                res.locals.user = req.session.user
                res.locals.data = rows[0]
                res.render('user', {
                    title: rows[0]['lastname'] + " " + rows[0]['firstname']
                });
            });
        });
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page.";
        res.redirect('/login');
    }
});

module.exports = router;
