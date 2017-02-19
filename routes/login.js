var express = require('express');
var router = express.Router();
var connection = require('../config/db')
var bcrypt = require('bcrypt');
var session = require('express-session');

router.get('/', function(req, res, next) {
    if (req.session.error) {
        res.locals.error = req.session.error
        req.session.error = undefined}
    if (req.session.success) {
        res.locals.success = req.session.success
        req.session.success = undefined}
    res.locals.user = req.session.user
    res.render('login', {
        title: 'Connection'
    });
});

router.post('/', function(req, res) {
    connection.query('SELECT orientation, sexe, password FROM users WHERE username = ? LIMIT 1', [req.body.username], (err, rows, result) => {
        if (err) throw err
        else if (rows[0]) {
            if (bcrypt.compareSync(req.body.password, rows[0].password)){
                req.session.user = req.body.username.toLowerCase();
                req.session.orientation = rows[0].orientation;
                req.session.sexe = rows[0].sexe;
                req.session.success = "Vous êtes maintenant connecté";
                res.redirect('../');
            } else {
                req.session.error = "Mauvais mot de passe";
                res.redirect('/login');
            }
        } else {
            req.session.error = "L'utilisateur n'existe pas";
            res.redirect('/login');
        }
    })
});


module.exports = router;
