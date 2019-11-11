const SchemaModel = require('../models/schemas.model');

exports.init = (req, res) => {
    SchemaModel.createTable();
    res.status(202);
};

exports.drop = (req, res) => {
    SchemaModel.dropTable();
    res.status(202);
};

exports.get = (req, res) => {
    SchemaModel.findSchemaBy(req.params.id)
        .then((results) => {
            if(results !== undefined && results.rows.length == 0){
                res.status(404).send({ message: 'no schema has been submitted'})
            } else {
                res.status(200).send(results.rows[0]);
            } 
        })
        .catch((error) => {
            console.log(error)
            res.status(400).send({message: 'the request could not be processed', description: error});
        });
};

exports.find = (req, res) => {
    SchemaModel.findAllSchemasBy(req.query.host, req.query.endpoint, req.query.from, req.query.to)
        .then((results) => {
            res.status(200).send(results.rows);
        })
        .catch((error) => {
            console.log(error)
            res.status(400).send({message: 'the request could not be processed', description: error});
        });
};

exports.create = (req, res) => {
    if (req.body.host === undefined || req.body.endpoint === undefined || req.body.response === undefined || req.body.schema === undefined) {
        res.status(400).send({message: 'the request was incomplete', required: ['host', 'endpoint', 'response', 'schema']});
        return;
    }
    SchemaModel.createSchema(req.body.host, req.body.endpoint, req.body.response, req.body.schema)
        .then((results) => {
            res.status(201).send({id: results.rows[0].id});
        })
        .catch((error) => {
            console.log(error)
            res.status(400).send({message: 'the request could not be processed', description: error});
        });
};

exports.submit = (req, res) => {
    if (req.body.host === undefined || req.body.endpoint === undefined || req.body.response === undefined) {
        res.status(400).send({message: 'the request was incomplete', required: ['host', 'endpoint', 'response']});
        return;
    }
    SchemaModel.findSchema(req.body.host, req.body.endpoint)
        .then((results) => {
            if (results.rows !== undefined && results.rows.length > 0) {
                res.status(400).send({message: 'the schema needs to be updated', id: results.rows[0].id});
            } else {
                SchemaModel.createSchema(req.body.host, req.body.endpoint, null)
                    .then((create_result) => {
                        res.status(202).send({message: 'the schema has been submitted', id: create_result.rows[0].id});
                    });
            }
        })
        .catch((error) => {
            console.log(error)
            res.status(400).send({message: 'the request could not be processed', description: error});
        });
};

exports.update = (req, res) => {
    if (req.body.response === undefined || req.body.schema === undefined) {
        res.status(400).send({message: 'the request was incomplete', required: ['response', 'schema']});
        return;
    }
    SchemaModel.updateSchema(req.params.id, req.body.response, req.body.schema)
        .then((results) => {
            res.status(200).send({id: results.rows[0].id});
        })
        .catch((error) => {
            console.log(error)
            res.status(400).send({message: 'the request could not be processed', description: error});
        });
};
