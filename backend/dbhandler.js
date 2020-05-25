var { Client } = require('pg');
//Creating a pool so user doesn't have to handshake everytime a query is made
var client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
  	rejectUnauthorized: false
  }
});


module.exports = client;