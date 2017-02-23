var express = require('express')
var router = express.Router()
var connection = require('../config/db')
var bcrypt = require('bcryptjs')

router.get('/', function(req, res, next) {
    if (req.session && req.session.user) {
        if (req.session.error) {
            res.locals.error = req.session.error
            req.session.error = undefined}
        if (req.session.success) {
            res.locals.success = req.session.success
            req.session.success = undefined}
        connection.query('SELECT * FROM users WHERE username = ?', [req.session.user], (err, rows, result) => {
            if (err) console.log(err)
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
    if (req.body.bio.length > 9000) {
        req.session.error = "Votre bio est trop longue.";
        res.redirect('/profil');
    } else {
        if (req.body.firstname.length > 80 || req.body.lastname.length > 80 || req.body.username.length > 80 || req.body.email.length > 200) {
            req.session.error = "Erreur.";
            res.redirect('/profil');
        } else {
            connection.query('SELECT * FROM users WHERE username = ?', [req.body.username, req.session.user], (err, rows, result) => {
                if (rows[0] && rows[0]['username'] && rows[0]['username'].toUpperCase() != req.session.user.toUpperCase()) {
                    req.session.error = "Le nom d'utilisateur est déjà utilisé.";
                    res.redirect('/profil');
                } else {
                    connection.query('SELECT email FROM users WHERE username = ?', [req.session.user], (err, rows, result) => {
                        var useremail = rows[0]['email'];
                        connection.query('SELECT email FROM users WHERE email = ?', [req.body.email, useremail], (err, rows, result) => {
                            if (rows[0] && rows[0]['email'] && rows[0]['email'].toUpperCase() != useremail.toUpperCase()) {
                                error = 1;
                                req.session.error = "L'email est déjà utilisé.";
                                res.redirect('/profil');
                            } else if (req.body.password && req.body.confirmPassword) {
                                if (req.body.password != req.body.confirmPassword) {
                                    error = 1;
                                    req.session.error = "Les mots de passe ne correspondent pas.";
                                    res.redirect('/profil');
                                } else if (req.body.password.length < 6) {
                                    error = 1;
                                    req.session.error = "Erreur: votre mot de passe doit faire plus de 6 charactères";
                                    res.redirect('/profil');
                                } else if (req.body.password.length > 50) {
                                    error = 1;
                                    req.session.error = "Erreur: votre mot de passe doit faire moins de 50 charactères";
                                    res.redirect('/profil');
                                } else if (req.body.password.search(/\d/) == -1) {
                                    error = 1;
                                    req.session.error = "Erreur: votre mot de passe doit contenir au moins un chiffre";
                                    res.redirect('/profil');
                                } else if (req.body.password.search(/[a-z]/) == -1) {
                                    error = 1;
                                    req.session.error = "Erreur: votre mot de passe doit contenir au moins une minuscule";
                                    res.redirect('/profil');
                                } else if (req.body.password.search(/[a-z]/) == -1) {
                                    error = 1;
                                    req.session.error = "Erreur: votre mot de passe doit contenir au moins une majuscule";
                                    res.redirect('/profil');
                                } else if (req.body.password.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:]/) != -1) {
                                    error = 1;
                                    req.session.error = "Erreur: votre mot de passe ne peux pas contenir d'autres charactères que a-z A-Z 0-9 ! @ # $ % ^ & * ( ) _ + . , ; :";
                                    res.redirect('/profil');
                                } else {
                                    var hash = bcrypt.hashSync(req.body.password, 12);
                                    connection.query('UPDATE users SET password = ? WHERE username = ?', [hash, req.session.user], (err, result) => {
                                        if (err) console.log(err)
                                    })
                                    connection.query('UPDATE users SET username = ?, lastname = ?, firstname = ?, email = ?, sexe = ?, orientation = ?, bio = ?, age = ? WHERE username = ? LIMIT 1', [req.body.username, req.body.lastname, req.body.firstname, req.body.email, req.body.sexe, req.body.orientation, req.body.bio, req.body.age, req.session.user], (err, result) => {
                                        if (err) {
                                          req.session.error = "Erreur.";
                                          res.redirect('/profil');
                                        } else {
                                        req.session.user = req.body.username;
                                        req.session.success = "Vos informations ont été mis à jour.";
                                        res.redirect('/profil');}
                                    })
                                }
                            } else {
                                connection.query('UPDATE users SET username = ?, lastname = ?, firstname = ?, email = ?, sexe = ?, orientation = ?, bio = ?, age = ? WHERE username = ? LIMIT 1', [req.body.username, req.body.lastname, req.body.firstname, req.body.email, req.body.sexe, req.body.orientation, req.body.bio, req.body.age, req.session.user], (err, result) => {
                                    if (err) {
                                      req.session.error = "Erreur.";
                                      res.redirect('/profil');
                                    } else {
                                    req.session.user = req.body.username;
                                    req.session.sexe = req.body.sexe;
                                    req.session.orientation = req.body.orientation;
                                    req.session.valid = true;
                                    req.session.success = "Vos informations ont été mis à jour.";
                                    res.redirect('/profil');}
                                })
                            }
                        })
                    })
                }
            })
        }
    }
});

module.exports = router;
