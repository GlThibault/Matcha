var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session && req.session.user) {
        if (req.session.error) {
            res.locals.error = req.session.error
            req.session.error = undefined
        }
        if (req.session.success) {
            res.locals.success = req.session.success
            req.session.success = undefined
        }
        res.locals.user = req.session.user
        res.render('index', {
            title: 'Matcha'
        });
    } else {
        res.redirect('/register');
    }
});

module.exports = router;
