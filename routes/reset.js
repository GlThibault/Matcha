var express = require('express')
var router = express.Router()
var connection = require('../config/db')
var bcrypt = require('bcryptjs')

router.use('/:key', function(req, res) {
    if (req.params.key) {
        var hash = bcrypt.hashSync(req.params.key, 12)
        connection.query('UPDATE users SET password = ?, reset = \'NULL\' WHERE reset = ?', [hash, req.params.key], (err) => {
            if (err) {
                req.session.error = "Erreur."
                res.redirect('/login')
            } else {
                req.session.success = "Votre mot a été changé. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe."
                res.redirect('/login')
            }
        })
    } else {
        res.redirect('/login')
    }
})

module.exports = router
