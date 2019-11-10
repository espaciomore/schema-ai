const config = require('./common/config/env.config.js');
const { Pool } = require('pg');
const pool = new Pool(config.db_connection);

pool.on('connect', () => {
  //console.log('connected to the db');
});

const createTables = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      schemas (
       id SERIAL PRIMARY KEY,
       created_at TIMESTAMP,
       endpoint VARCHAR(126) NOT NULL,
       host VARCHAR(62) NOT NULL,
       response JSON,
       schema JSON,
       updated_at TIMESTAMP     
    )`;

  pool.query(queryText)
    .then(() => {
      //console.log('table schemas created');
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

const dropTables = () => {
  const queryText = 'DROP TABLE IF EXISTS schemas';
  pool.query(queryText)
    .then(() => {
      //console.log('schemas dropped');
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

pool.on('remove', () => {
  //console.log('disconnected from the db');
});

module.exports = {
  createTables,
  dropTables
};
