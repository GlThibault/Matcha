var express = require('express');
var router = express.Router();
var connection = require('../config/db')
var bcrypt = require('bcrypt');

router.get('/', function(req, res, next) {
  res.render('register', { title: 'register' });
});

router.post('/', function(req, res) {
  if (req.body.password != req.body.confirmPassword) throw err
  var hash = bcrypt.hashSync(req.body.password, 7);
  connection.query('INSERT INTO users SET username = ?, lastname = ?, firstname = ?, email = ?, password = ?', [req.body.username, req.body.lastname, req.body.firstname, req.body.email, hash], (err, result) => {
    if (err) throw err
  })
  res.redirect('../')
  req.session.error = "Votre compte a été créé avec succès";
});

module.exports = router;
