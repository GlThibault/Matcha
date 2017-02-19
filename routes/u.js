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
        var sexe1 = ''
        var sexe2 = ''
        var orientation1 = ''
        var orientation2 = ''
        if (req.session.sexe == 'Homme') {
            if (req.session.orientation == 'Homosexuelle' || req.session.orientation == 'Bisexuelle') {
                sexe1 = 'Homme'
                orientation1 = 'Hétérosexuelle'
            }
            if (req.session.orientation == 'Hétérosexuelle' || req.session.orientation == 'Bisexuelle') {
                sexe2 = 'Femme'
                orientation2 = 'Homosexuelle'
            }
        } else if (req.session.sexe == 'Femme') {
            if (req.session.orientation == 'Homosexuelle' || req.session.orientation == 'Bisexuelle') {
                sexe1 = 'Femme'
                orientation1 = 'Hétérosexuelle'
            }
            if (req.session.orientation == 'Hétérosexuelle' || req.session.orientation == 'Bisexuelle') {
                sexe2 = 'Homme'
                orientation2 = 'Homosexuelle'
            }
        } else {
          sexe1 = 'Homme';
          sexe2 = 'Femme';
        }
        connection.query("SELECT users.username, users.lastname, users.firstname, users.email, users.bio, users.sexe, users.orientation, users.interests, users.age, users.pic0, (SELECT count(username) FROM likes WHERE likes.username=users.username) AS likes FROM users LEFT JOIN likes ON likes.username=users.username WHERE ((sexe = ? AND orientation != ?) OR (sexe = ? AND orientation != ?)) AND users.username != ? GROUP BY username, lastname, firstname, email, bio, sexe, orientation, interests, age, pic0, likes", [sexe1, orientation1, sexe2, orientation2, req.session.user], (err, rows, result) => {
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
        connection.query('SELECT * FROM visits WHERE username = ? AND visited = ? LIMIT 1', [req.session.user, req.params.username], (err, rows, result) => {
          if (err) throw err
          if (!rows[0] && req.session.user != req.params.username)
            connection.query('INSERT INTO visits SET username = ?, visited = ?', [req.session.user, req.params.username], (err, result) => {if (err) throw err});
        });
        connection.query('SELECT count(*) AS pop FROM likes WHERE username = ?', [req.session.user], (err, rows, result) => {
            if (err) throw err
            res.locals.pop = rows[0].pop
            connection.query('SELECT * FROM users WHERE username = ? LIMIT 1', [req.params.username], (err, rows, result) => {
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
