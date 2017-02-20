var express = require('express');
var router = express.Router();
var connection = require('../config/db')

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
        if (req.session.warning) {
            res.locals.warning = req.session.warning
            req.session.warning = undefined
        }
        if (req.session.info) {
            res.locals.info = req.session.info
            req.session.info = undefined
        }
        connection.query('SELECT count(*) AS pop FROM likes WHERE username = ?', [req.session.user], (err, rows, result) => {
            if (err) console.log(err)
            res.locals.pop = rows[0].pop
            connection.query('SELECT likes.username, users.pic0, users.lastname, users.firstname, users.sexe, users.bio, users.age FROM likes LEFT JOIN users ON likes.username=users.username WHERE liked = ? ORDER BY likes.id DESC', [req.session.user], (err, rows, result) => {
                if (err) console.log(err)
                res.locals.likes = rows
                connection.query('SELECT visits.username, users.pic0, users.lastname, users.firstname, users.sexe, users.bio, users.age FROM visits LEFT JOIN users ON visits.username=users.username WHERE visited = ? ORDER BY visits.id DESC', [req.session.user], (err, rows, result) => {
                    if (err) console.log(err)
                    res.locals.visits = rows
                    connection.query('SELECT * FROM users WHERE username = ? LIMIT 1', [req.session.user], (err, rows, result) => {
                        if (err) console.log(err)
                        res.locals.user = req.session.user
                        res.locals.data = rows[0]
                        res.render('index', {
                            title: 'Matcha'
                        });
                    });
                });
            });
        });
    } else {
        res.redirect('/register');
    }
});

module.exports = router;
