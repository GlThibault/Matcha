var express = require('express')
var router = express.Router()
var connection = require('../config/db')
var busboy = require('connect-busboy')
var fs = require('fs')
var mime = require('mime-types')

router.use(busboy())
router.post('/:id', function(req, res) {
    if (req.session && req.session.user && req.params.id) {
        req.pipe(req.busboy)
        req.busboy.on('file', function(fieldname, file, filename) {
            connection.query('SELECT * FROM users WHERE username = ?', [req.session.user], (err, rows) => {
                if (err) console.log(err)
                if (rows[0] && rows[0][req.params.id]) {
                    var picture = 'public' + rows[0][req.params.id]
                    fs.stat(picture, function(err) {
                        if (err) {
                            console.error(err)
                        } else
                            fs.unlink(picture, function(err) {
                                if (err) console.log(err)
                            })
                    })
                }
            })
            var fname = '/images/' + req.session.user + '_' + req.params.id + '_' + filename
            var fstream = fs.createWriteStream('./public' + fname)
            file.pipe(fstream)
            fstream.on('close', function() {
                if (filename.length) {
                    var type = mime.lookup(fname).substr(0, 6);
                    if (type != 'image/')
                        fname = "";
                } else
                    fname = "";
                if (req.params.id == 'pic0') {
                    connection.query('UPDATE users SET pic0 = ? WHERE username = ?', [fname, req.session.user], (err) => {
                        if (err) console.log(err)
                    })
                    if (fname.length > 0)
                        req.session.valid = true
                    req.session.pic0 = true
                }
                if (req.params.id == 'pic1')
                    connection.query('UPDATE users SET pic1 = ? WHERE username = ?', [fname, req.session.user], (err) => {
                        if (err) console.log(err)
                    })
                if (req.params.id == 'pic2')
                    connection.query('UPDATE users SET pic2 = ? WHERE username = ?', [fname, req.session.user], (err) => {
                        if (err) console.log(err)
                    })
                if (req.params.id == 'pic3')
                    connection.query('UPDATE users SET pic3 = ? WHERE username = ?', [fname, req.session.user], (err) => {
                        if (err) console.log(err)
                    })
                if (req.params.id == 'pic4')
                    connection.query('UPDATE users SET pic4 = ? WHERE username = ?', [fname, req.session.user], (err) => {
                        if (err) console.log(err)
                    })
                if (filename.length && type == 'image/') {
                    req.session.success = "Votre image a bien été sauvegardé."
                    res.redirect('/profil')
                } else {
                    req.session.error = "Votre image a un problème, essayé avec une autre."
                    res.redirect('/profil')
                }
            })
        })
    } else if (req.session && req.session.user) {
        req.session.error = "Erreur"
        res.redirect('/profil')
    } else {
        req.session.error = "Vous devez être connecté pour accéder a cette page."
        res.redirect('/login')
    }
})

module.exports = router
