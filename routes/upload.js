var express = require('express')
var router = express.Router()
var connection = require('../config/db')
var busboy = require('connect-busboy')
var fs = require('fs')

router.use(busboy())
router.post('/:id', function(req, res) {
    req.pipe(req.busboy)
    req.busboy.on('file', function(fieldname, file, filename) {
        connection.query('SELECT * FROM users WHERE username = ?', [req.session.user], (err, rows, result) => {
            if (err) console.log(err)
            if (rows[0][req.params.id]) {
                var picture = 'public' + rows[0][req.params.id]
                fs.stat(picture, function(err, stats) {
                    if (err) {
                        return console.error(err)
                    } else
                        fs.unlink(picture, function(err) {
                            if (err) return console.log(err)
                        })
                })
            }
        })
        var fname = '/images/' + req.session.user + '_' + req.params.id + '_' + filename
        var fstream = fs.createWriteStream('./public' + fname)
        file.pipe(fstream)
        fstream.on('close', function() {
            if (req.params.id == 'pic0') {
                connection.query('UPDATE users SET pic0 = ? WHERE username = ?', [fname, req.session.user], (err, result) => {
                    if (err) console.log(err)
                })
                req.session.pic0 = true
            }
            if (req.params.id == 'pic1')
                connection.query('UPDATE users SET pic1 = ? WHERE username = ?', [fname, req.session.user], (err, result) => {
                    if (err) console.log(err)
                })
            if (req.params.id == 'pic2')
                connection.query('UPDATE users SET pic2 = ? WHERE username = ?', [fname, req.session.user], (err, result) => {
                    if (err) console.log(err)
                })
            if (req.params.id == 'pic3')
                connection.query('UPDATE users SET pic3 = ? WHERE username = ?', [fname, req.session.user], (err, result) => {
                    if (err) console.log(err)
                })
            if (req.params.id == 'pic4')
                connection.query('UPDATE users SET pic4 = ? WHERE username = ?', [fname, req.session.user], (err, result) => {
                    if (err) console.log(err)
                })
            req.session.success = "Votre image a bien été sauvegardé."
            res.redirect('/profil')
        })
    })
})

module.exports = router
