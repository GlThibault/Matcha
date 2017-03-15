var express = require('express')
var router = express.Router()


router.get('/', function(req, res) {
    if (req.session && req.session.user) {
        connection.query("SELECT distinct tag FROM tag", (err, rows) => {
            if (err) console.log(err)
            res.locals.alltags = rows
            res.render('search', {
                title: 'Recherches'
            })
        })
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page."
        res.redirect('/login')
    }
})


module.exports = router
