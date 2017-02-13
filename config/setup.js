var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  port     : 3307,
  user     : 'root',
  password : 'root'
});

connection.connect();

connection.query('CREATE DATABASE IF NOT EXISTS matcha')
connection.query('USE matcha')
connection.query('CREATE TABLE IF NOT EXISTS users (id INT(9) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, username VARCHAR(100) NOT NULL, lastname VARCHAR(100) NOT NULL, firstname VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, inscription_date DATE, reset VARCHAR(255) DEFAULT \'NULL\', sexe VARCHAR(25), orientation VARCHAR(25) DEFAULT \'Bisexuelle\', bio VARCHAR(10000), interests VARCHAR(255), age INT)')
connection.end()
console.log('Database created')
