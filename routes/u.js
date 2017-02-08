var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.error) {
        res.locals.error = req.session.error
        req.session.error = undefined
    }
    res.locals.user = req.session.user
    res.render('u', {
        title: 'Utilisateurs'
    });
});

module.exports = router;
