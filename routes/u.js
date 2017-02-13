var express = require('express');
var router = express.Router();
var connection = require('../config/db')

router.get('/', function(req, res, next) {
    if (req.session && req.session.user) {
        if (req.session.error) {
            res.locals.error = req.session.error
            req.session.error = undefined
        }
        connection.query('SELECT * FROM users WHERE bio != \'NULL\'', (err, rows, result) => {
              if (err) throw err
              res.locals.user = req.session.user
              res.locals.rows = rows
              res.render('u', {
                  title: 'Utilisateurs'
              });
          });
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page.";
        res.redirect('/login');
    }
});

module.exports = router;
