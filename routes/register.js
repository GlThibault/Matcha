var express = require('express');
var router = express.Router();
var connection = require('../config/db')
var bcrypt = require('bcrypt');
var session = require('express-session');

router.get('/', function(req, res, next) {
    if (req.session.error) {
        res.locals.error = req.session.error
        req.session.error = undefined
    }
    res.locals.user = req.session.user
    res.render('register', {
        title: 'Inscription',
        user: req.session.user
    });
});

router.post('/', function(req, res) {
  connection.query('SELECT * FROM users WHERE username = ? OR email = ?', [req.body.username, req.body.email], (err, rows, result) => {
      if (err) throw err
      else if (rows[0] && rows[0]['username']) {
          req.session.error = "Le nom d'utilisateur est déjà utilisé.";
          res.redirect('/register');
      }
      else if (rows[0] && rows[0]['email']) {
          req.session.error = "L'email est déjà utilisé.";
          res.redirect('/register');
      }
      else if (req.body.password != req.body.confirmPassword) {
          req.session.error = "Les mots de passe ne correspondent pas.";
          res.redirect('/register');
      }
      else if (req.body.password.length < 6) {
          req.session.error = "Erreur: votre mot de passe doit faire plus de 6 charactères";
          res.redirect('/register');
      } else if (req.body.password.length > 50) {
          req.session.error = "Erreur: votre mot de passe doit faire moins de 50 charactères";
          res.redirect('/register');
      } else if (req.body.password.search(/\d/) == -1) {
          req.session.error = "Erreur: votre mot de passe doit contenir au moins un chiffre";
          res.redirect('/register');
      } else if (req.body.password.search(/[a-z]/) == -1) {
          req.session.error = "Erreur: votre mot de passe doit contenir au moins une minuscule";
          res.redirect('/register');
      } else if (req.body.password.search(/[a-z]/) == -1) {
          req.session.error = "Erreur: votre mot de passe doit contenir au moins une najuscule";
          res.redirect('/register');
      } else if (req.body.password.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:]/) != -1) {
          req.session.error = "Erreur: votre mot de passe ne peux pas contenir d'autres charactères que a-z A-Z 0-9 ! @ # $ % ^ & * ( ) _ + . , ; :";
          res.redirect('/register');
      } else {
        var hash = bcrypt.hashSync(req.body.password, 12);
        connection.query('INSERT INTO users SET username = ?, lastname = ?, firstname = ?, email = ?, password = ?, inscription_date = ?', [req.body.username, req.body.lastname, req.body.firstname, req.body.email, hash, new Date()], (err, result) => {
            if (err) throw err
        })
        res.redirect('../login')
      }
    })
});

module.exports = router;
