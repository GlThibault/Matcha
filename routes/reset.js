var express = require('express');
var router = express.Router();
var connection = require('../config/db')
var bcrypt = require('bcrypt');

router.get('/', function(req, res) {
    var hash = bcrypt.hashSync(req.params.key, 12);
    connection.query('UPDATE users SET password = ?, reset = \'NULL\' WHERE reset = ?', [hash, req.params.key], (err, result) => {
        if (err) throw err
    })
    req.session.success = "Votre mot a été changé. Vous pouvez maintenant vous connecter.";
    res.redirect('/')
});

module.exports = router;
