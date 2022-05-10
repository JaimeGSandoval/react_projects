const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'dev',
  password: 'lfz',
  host: 'localhost',
  port: 5432,
  database: 'perntodo',
});

module.exports = pool;
