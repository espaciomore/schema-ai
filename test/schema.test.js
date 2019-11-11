process.env.NODE_ENV = 'test'

const SchemaModel = require('../schemas/models/schemas.model');

const server = require('../server');

const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

before(async () => {
	await SchemaModel.createTable();
	console.log('before');
});

describe('GET /schemas', () => {
  it('does not allow invalid routes', done => {
    chai
      .request(server)
      .get('/schemas')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equals('only valid routes are allowed');
        expect(res.body.description[0]).to.equals('GET /schemas/get/:id');
        done();
      });
  });
});

after(async () => {
	await SchemaModel.dropTable();
	console.log('after');
	server.conn.close(0);
});
