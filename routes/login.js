var express = require('express')
var router = express.Router()
var connection = require('../config/db')
var bcrypt = require('bcryptjs')
var session = require('express-session')

router.get('/', function(req, res, next) {
    if (req.session.error) {
        res.locals.error = req.session.error
        req.session.error = undefined
    }
    if (req.session.success) {
        res.locals.success = req.session.success
        req.session.success = undefined
    }
    res.locals.user = req.session.user
    res.render('login', {
        title: 'Connection'
    })
})

router.post('/', function(req, res) {
    connection.query('SELECT orientation, sexe, password, pic0 FROM users WHERE username = ? LIMIT 1', [req.body.username], (err, rows, result) => {
        if (err) console.log(err)
        else if (rows[0]) {
            if (bcrypt.compareSync(req.body.password, rows[0].password)) {
                req.session.user = req.body.username.toLowerCase()
                if (rows[0].sexe) {
                    req.session.orientation = rows[0].orientation
                    req.session.sexe = rows[0].sexe
                    req.session.valid = true
                } else
                    req.session.info = "Votre profil est vide, vous pouvez le remplir en cliquant sur Profil"
                req.session.pic0 = rows[0].pic0
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
})

module.exports = router
