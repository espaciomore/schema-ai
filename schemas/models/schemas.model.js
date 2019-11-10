const config = require('../../common/config/env.config.js');
const {Pool} = require('pg');
const pool = new Pool(config.db_connection);

exports.findSchema = (host, endpoint) => {
    return pool.query(
        'SELECT * FROM schemas WHERE host=$1 AND endpoint=$2',
        [host, endpoint]);
}

exports.findSchemaBy = (id) => {
    return pool.query(
        'SELECT * FROM schemas WHERE id=$1',
        [id]);
}

exports.findAllSchemasBy = (host, endpoint, from, to) => {
    return pool.query(
        'SELECT * FROM schemas WHERE host=$1 OR endpoint=$2 AND updated_at BETWEEN $3 AND $4 ORDER BY updated_at DESC',
        [host, endpoint, from, to]);
}

exports.createSchema = (host, endpoint, response, schema) => {
    return pool.query(
        'BEGIN' +
        '\nIF NOT EXISTS (' + 'SELECT * FROM schemas WHERE host=$1 AND endpoint=$2' +')' +
        '\nBEGIN\n' +
        'INSERT INTO schemas (host,endpoint,response,schema) VALUES ($1,$2,$3,$4) RETURNING id' +
        '\nEND\n' +
        'END',
        [host, endpoint, response, schema]);
}

exports.updateSchema = (id, response, schema) => {
    return pool.query(
        'UPDATE schemas SET updated_at=$1, response=$2 schema=$3 WHERE id=$4 RETURNING id',
        ['now()', response, schema, id]);
};
