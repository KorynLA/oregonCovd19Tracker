var { Pool } = require('pg');
//Creating a pool so user doesn't have to handshake everytime a query is made
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 3000,
  connectionTimeoutMillis: 2000,
});


module.exports = pool;