var mysql      = require('mysql')

var connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3307,
  user     : 'root',
  password : 'root',
  database : 'matcha'
})

connection.connect()

module.exports = connection
