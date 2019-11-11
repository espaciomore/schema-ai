const SchemasController = require('./controllers/schemas.controller');

exports.routesConfig = function (app) {
    app.post('/schemas/up', [
        SchemasController.init
    ]);
    
    app.delete('/schemas/down', [
        SchemasController.drop
    ]);

    app.get('/schemas/get/:id', [
        SchemasController.get
    ]);

    app.get('/schemas/find', [
        SchemasController.find
    ]);

    app.post('/schemas/create', [
        SchemasController.create
    ]);

    app.post('/schemas/submit', [
        SchemasController.submit
    ]);

    app.patch('/schemas/update/:id', [
        SchemasController.update
    ]);
};
