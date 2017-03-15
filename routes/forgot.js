var express = require('express')
var router = express.Router()
var connection = require('../config/db')
var sendmail = require('sendmail')()

router.get('/', function(req, res) {
    res.render('forgot', {
        title: 'Mot de passe oublié'
    })
})

router.post('/', function(req, res) {
    if (req.body && req.body.username) {
        connection.query('SELECT email FROM users WHERE username = ?', [req.body.username], (err, rows) => {
            if (err) console.log(err)
            else if (rows[0]) {
                var hash = (Math.random() + 1).toString(36).substr(2, 15)
                connection.query('UPDATE users SET reset = ? WHERE username = ?', [hash, req.body.username], (err) => {
                    if (err) console.log(err)
                })
                var fullUrl = '<a href="' + req.protocol + '://' + req.get('host') + '/reset/' + hash + '">Réinitialiser le mot de passe</a>'
                sendmail({
                    from: 'tglandai@student.42.fr',
                    to: rows[0].email,
                    subject: 'Matcha | Mot de passe oublié',
                    html: 'Vous avez effectuez une demande de réinitialisation du mot de passe sur le site Matcha <br/> Cliquez sur le lien ci-dessous pour continuer:<br/>' + fullUrl + '<br/><br/>Vous pourrez ensuite vous connecter avec le mot de passe : ' + hash + '<br/><br/>Vous pourrez ensuite le changer dans votre profil.',
                }, function(err, reply) {
                    console.log(err && err.stack)
                    console.dir(reply)
                })
                req.session.success = "Un lien de réinitialisation vous a été envoyé par mail avec un nouveau mot de passe."
                res.redirect('/login')
            } else {
                req.session.error = "L'utilisateur n'existe pas"
                res.redirect('/forgot')
            }
        })
    } else {
        req.session.error = "L'utilisateur n'existe pas"
        res.redirect('/forgot')
    }
})

module.exports = router
