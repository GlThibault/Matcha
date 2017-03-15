var express = require('express')
var router = express.Router()
var connection = require('../config/db')
var sendmail = require('sendmail')()

router.get('/:username', function(req, res) {
    if (req.session && req.params.username && req.session.user == req.params.username) {
        req.session.error = "Vous ne pouvez vous signaler."
        res.redirect('../u/' + req.params.username)
    } else if (req.session && req.session.user && req.params.username) {
        sendmail({
            from: 'tglandai@student.42.fr',
            to: 'tglandai@student.42.fr',
            subject: 'Matcha | Utilisateur signalé',
            html: 'L\'utilisateur ' + req.params.username + ' a été signalé comme étant un faux compte par ' + req.session.user,
        }, function(err, reply) {
            console.log(err && err.stack)
            console.dir(reply)
        })
        req.session.info = "L'utilisateur a bien été signalé aux administrateurs."
        res.redirect('../u/' + req.params.username)
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page."
        res.redirect('/login')
    }
})

module.exports = router
