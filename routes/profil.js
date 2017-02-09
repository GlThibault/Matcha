var express = require('express');
var router = express.Router();
var connection = require('../config/db')

router.get('/', function(req, res, next) {
    if (req.session && req.session.user) {
        if (req.session.error) {
            res.locals.error = req.session.error
            req.session.error = undefined
        }
        connection.query('SELECT * FROM users WHERE username = ?', [req.session.user], (err, rows, result) => {
            if (err) throw err
            res.locals.user = req.session.user
            res.locals.data = rows[0]
            res.render('profil', {
                title: 'Profil'
            });
        });
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page.";
        res.redirect('/login');
    }
});

router.post('/', function(req, res) {
    connection.query('SELECT * FROM users WHERE username = ? NOT(username = ?)', [req.body.username, req.session.user], (err, rows, result) => {
        if (rows && rows[0]['username']) {
            req.session.error = "Le nom d'utilisateur est déjà utilisé.";
            res.redirect('/profil');
            exit();
        }
    })
    connection.query('SELECT email FROM users WHERE username = ?', [req.session.user], (err, rows, result) => {
        var useremail = rows[0]['email'];
        connection.query('SELECT email FROM users WHERE email = ? NOT(email = ?)', [req.body.email, useremail], (err, rows, result) => {
            if (rows && rows[0]['email']) {
                req.session.error = "L'email est déjà utilisé.";
                res.redirect('/profil');
                exit();
            }
        })
    })
    connection.query('UPDATE users SET username = ?, lastname = ?, firstname = ?, email = ?, sexe = ?, orientation = ?, bio = ? WHERE username = ?', [req.body.username, req.body.lastname, req.body.firstname, req.body.email, req.body.sexe, req.body.orientation, req.body.bio, req.session.user], (err, result) => {
        if (err) throw err
        req.session.user = req.body.username;
        req.session.error = "Vos informations ont été mis à jour.";
        res.redirect('/profil');
    })
});

module.exports = router;
