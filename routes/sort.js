var express = require('express');
var router = express.Router();
var connection = require('../config/db')

router.get('/:option', function(req, res, next) {
    if (req.session && req.session.user) {
      if (!req.params.option)
        req.session.order = "";
      else if (req.params.option == 'age')
        req.session.order = 'age';
      else if (req.params.option == 'pop')
        req.session.order = 'pop';
      res.redirect('/u');
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page.";
        res.redirect('/login');
    }
});

module.exports = router;
