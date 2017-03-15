var express = require('express')
var router = express.Router()
var connection = require('../config/db')
var bcrypt = require('bcryptjs')
var session = require('express-session')
var iplocation = require('iplocation')

router.get('/', function(req, res) {
    res.render('register', {
        title: 'Inscription',
        user: req.session.user
    })
})

router.post('/', function(req, res) {
    if (req.body.username && req.body.email && req.body.firstname && req.body.lastname && req.body.password && req.body.confirmPassword) {
        connection.query('SELECT * FROM users WHERE username = ? OR email = ?', [req.body.username, req.body.email], (err, rows, result) => {
            if (err) console.log(err)
            else if (req.body.firstname.length > 80 || req.body.lastname.length > 80 || req.body.username.length > 80 || req.body.email.length > 200) {
                req.session.error = "Erreur."
                res.redirect('/register')
            } else if (req.body.username.search(/[^a-zA-Z0-9]/) != -1) {
                req.session.error = "Le nom d'utilisateur ne peux contenir que des lettres et des chiffres."
                res.redirect('/register')
            } else if (rows[0] && rows[0]['username']) {
                req.session.error = "Le nom d'utilisateur ou l'email est déjà utilisé."
                res.redirect('/register')
            } else if (rows[0] && rows[0]['email']) {
                req.session.error = "L'email est déjà utilisé."
                res.redirect('/register')
            } else if (req.body.password != req.body.confirmPassword) {
                req.session.error = "Les mots de passe ne correspondent pas."
                res.redirect('/register')
            } else if (req.body.password.length < 6) {
                req.session.error = "Erreur: votre mot de passe doit faire plus de 6 charactères"
                res.redirect('/register')
            } else if (req.body.password.length > 50) {
                req.session.error = "Erreur: votre mot de passe doit faire moins de 50 charactères"
                res.redirect('/register')
            } else if (req.body.password.search(/\d/) == -1) {
                req.session.error = "Erreur: votre mot de passe doit contenir au moins un chiffre"
                res.redirect('/register')
            } else if (req.body.password.search(/[a-z]/) == -1) {
                req.session.error = "Erreur: votre mot de passe doit contenir au moins une minuscule"
                res.redirect('/register')
            } else if (req.body.password.search(/[A-Z]/) == -1) {
                req.session.error = "Erreur: votre mot de passe doit contenir au moins une majuscule"
                res.redirect('/register')
            } else if (req.body.password.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\.\,\\:]/) != -1) {
                req.session.error = "Erreur: votre mot de passe ne peux pas contenir d'autres charactères que a-z A-Z 0-9 ! @ # $ % ^ & * ( ) _ + . ,  :"
                res.redirect('/register')
            } else {
                var hash = bcrypt.hashSync(req.body.password, 12)
                connection.query('INSERT INTO users SET username = ?, lastname = ?, firstname = ?, email = ?, password = ?, inscription_date = ?, visit = ?', [req.body.username, req.body.lastname, req.body.firstname, req.body.email, hash, new Date(), new Date()], (err, result) => {
                    if (err) {
                        req.session.error = "Erreur."
                        res.redirect('/profil')
                    } else {
                        iplocation(req.ip, function(error, res) {
                            if (!res || !res['city'])
                                connection.query('UPDATE users SET city = "Paris", lat = 48.8965, lon = 2.3182 WHERE username = ?', [req.body.username], (err) => {
                                    if (err) console.log(err)
                                })
                            else
                                connection.query('UPDATE users SET city = ?, lat = ?, lon = ? WHERE username = ?', [res['city'], res['latitude'], res['longitude'], req.body.username], (err) => {
                                    if (err) console.log(err)
                                })
                        })
                        req.session.success = "Votre compte a correctement été créé"
                        res.redirect('/login')
                    }
                })
            }
        })
    } else {
        req.session.error = "Erreur"
        res.redirect('/register')
    }
})

module.exports = router
