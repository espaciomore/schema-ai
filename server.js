if(process.env.NODE_ENV === undefined){
    process.env.NODE_ENV = 'dev';
}

const config = require('./common/config/env.config.js');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const SchemasRouter = require('./schemas/routes.config');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
  if (req.method === 'OPTIONS') {
    return res.send(200);
  } else {
    return next();
  }
});

app.use(bodyParser.json());
SchemasRouter.routesConfig(app);

app.use(function(req, res){
  res.status(404).send({
    message: 'only valid routes are allowed',
    description: [
        'GET /schemas/get/:id',
        'GET /schemas/find?host=&endpoint=&from=&to=',
        //'POST /schemas/create',
        'POST /schemas/submit',
        'PATCH /schemas/update/:id'
    ]
  });
});

app.conn = app.listen(config.port, function () {
  console.log('app listening at port ' + config.port);
});

module.exports = app;
