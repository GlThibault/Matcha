var express = require('express');
var router = express.Router();
var session = require('express-session');
var connection = require('../config/db');

router.get('/:username', function(req, res, next) {
    if (req.session && req.session.user && req.session.pic0) {
        connection.query('SELECT COUNT(*) AS count FROM likes WHERE username = ? AND liked = ?', [req.session.user, req.params.username], (err, result) => {
            if (err) throw err
            if (result[0].count == 0) {
                connection.query('INSERT INTO likes SET username = ?, liked = ?', [req.session.user, req.params.username], (err, result) => {
                    if (err) throw err
                    else
                        res.redirect('../u/' + req.params.username);
                })
            } else {
                connection.query('DELETE FROM likes WHERE username = ? AND liked = ?', [req.session.user, req.params.username], (err, result) => {
                    if (err) throw err
                    else
                      res.redirect('../u/' + req.params.username);
                })
            }
        })
    } else if (req.session && req.session.user) {
        req.session.error = "Vous devez ajouter une photo de profil pour like une personne.";
        res.redirect('../u/' + req.params.username);
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page.";
        res.redirect('/login');
    }
});

module.exports = router;
