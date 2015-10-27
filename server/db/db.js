var mysql = require('mysql');

var pool = mysql.createPool({
  user: 'bb13d03ae42809',
  password: 'f5675c11',
  database: 'heroku_a35b008f64f7309',
  host: 'us-cdbr-iron-east-03.cleardb.net'
});

// var pool = mysql.createPool({
// 	user: 'root',
// 	password: '',
// 	database: 'heroku_a35b008f64f7309',
// 	host: 'localhost'
// });

// export the db connection
module.exports = pool;