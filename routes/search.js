var express = require('express')
var router = express.Router()


router.get('/', function(req, res, next) {
    if (req.session && req.session.user) {
      res.render('search', {
          title: 'Recherches'
      })
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page."
        res.redirect('/login')
    }
})


module.exports = router
