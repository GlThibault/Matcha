var express = require('express')
var router = express.Router()
var connection = require('../config/db')
var bcrypt = require('bcryptjs')
var session = require('express-session')

router.get('/', function(req, res) {
    res.render('login', {
        title: 'Connection'
    })
})

router.post('/', function(req, res) {
    if (req.body && req.body.username && req.body.password) {
        connection.query('SELECT orientation, sexe, password, pic0, firstname, lastname FROM users WHERE username = ? LIMIT 1', [req.body.username], (err, rows) => {
            if (err) console.log(err)
            else if (rows[0]) {
                if (bcrypt.compareSync(req.body.password, rows[0].password)) {
                    req.session.user = req.body.username.toLowerCase()
                    if (rows[0].pic0)
                        req.session.valid = true
                    if (rows[0].sexe) {
                        req.session.orientation = rows[0].orientation
                        req.session.sexe = rows[0].sexe
                    } else {
                        req.session.orientation = 'Bisexuelle'
                        req.session.sexe = 'Homme'
                        req.session.info = "Votre profil est vide, vous pouvez le remplir en cliquant sur Profil"
                    }
                    req.session.pic0 = rows[0].pic0
                    req.session.lastname = rows[0].lastname
                    req.session.firstname = rows[0].firstname
                    req.session.success = "Vous êtes maintenant connecté"
                    res.redirect('../')
                } else {
                    req.session.error = "Mauvais mot de passe"
                    res.redirect('/login')
                }
            } else {
                req.session.error = "L'utilisateur n'existe pas"
                res.redirect('/login')
            }
        })
    } else {
      req.session.error = "L'utilisateur n'existe pas"
      res.redirect('/login')
    }
})

module.exports = router
