if(process.env.NODE_ENV === undefined){
    process.env.NODE_ENV = 'test';
}

const SchemaModel = require('../schemas/models/schemas.model');
const Console = require('../helpers/console');
console.log = Console.log;

const server = require('../server');

const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

validSchema = {
    "$schema":"http://json-schema.org/draft-07/schema#",
    "type":"object",
    "required":["name"],
    "properties":{
        "name":{
            "type":"string"
        }
    }
};

before(async () => {
    await SchemaModel.createTable();
});

describe('on invalid route request', () => {
    it('should not allow invalid routes', async () => {
        await chai.request(server).get('/schemas')
            .then((res) => {
                expect(res).to.have.status(404);
                expect(res.body.message).to.equal('only valid routes are allowed');
                expect(res.body.description[0]).to.equal('GET /schemas/get/:id');
            })
            .catch((err) => { throw err; });
    });
    it('should not accept an invalid schema id', async () => {
        await chai.request(server).get('/schemas/get/:id')
            .then((res) => {
                expect(res).to.have.status(400);
                expect(res.body.message).to.equal('the request could not be processed');
            })
            .catch((err) => { throw err; });
    });
    it('should not accept an invalid date', async () => {
		await chai.request(server).get('/schemas/find?host=foo&endpoint=/bar&from=null&to=null')
            .then((res) => {
                expect(res).to.have.status(400);
                expect(res.body.message).to.equal('the request could not be processed');
            })
            .catch((err) => { throw err; });
    });
});

describe('on empty database request', () => {
    it('should not return any schemas', async () => {
        await chai.request(server).get('/schemas/get/1')
            .then((res) => {
                expect(res).to.have.status(404);
                expect(res.body.message).to.equal('no schema has been submitted');
            })
            .catch((err) => { throw err; });
    });
    it('should not find any schemas', async () => {
        await chai.request(server)
            .get('/schemas/find?host=foo&endpoint=/bar&from=2019-01-01&to=2023-01-01')
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf(0);
            })
            .catch((err) => { throw err; });
    });
});

describe('on schema submit request', () => {
    it('should not submit without host', async () => {
        await chai.request(server).post('/schemas/submit')
            .send(JSON.stringify({endpoint:'/bar',response:{name:'yin'}}))
            .then((res) => {
                expect(res).to.have.status(400);
                expect(res.body.message).to.equal('the request was incomplete');
                expect(res.body.required[0]).to.equal('host');
            })
            .catch((err) => { throw err; });
    });
    it('should not submit without endpoint', async () => {
        await chai.request(server).post('/schemas/submit')
            .send(JSON.stringify({host:'foo',response:{name:'yin'}}))
            .then((res) => {
                expect(res).to.have.status(400);
                expect(res.body.message).to.equal('the request was incomplete');
                expect(res.body.required[1]).to.equal('endpoint');
            })
            .catch((err) => { throw err; });
    });
    it('should not submit without response', async () => {
        await chai.request(server).post('/schemas/submit')
            .send(JSON.stringify({host:'foo',endpoint:'/bar'}))
            .then((res) => {
                expect(res).to.have.status(400);
                expect(res.body.message).to.equal('the request was incomplete');
                expect(res.body.required[2]).to.equal('response');
            })
            .catch((err) => { throw err; });
    });
});


describe('on schema update request', () => {
    it('should not update without response', async () => {
        await chai.request(server).patch('/schemas/update/1')
            .send(JSON.stringify({schema: validSchema}))
            .then((res) => {
                expect(res).to.have.status(400);
                expect(res.body.message).to.equal('the request was incomplete');
                expect(res.body.required[0]).to.equal('response');
            })
            .catch((err) => { throw err; });
    });
    it('should not update without schema', async () => {
        await chai.request(server).patch('/schemas/update/1')
            .send(JSON.stringify({response:{name:'yin'}}))
            .then((res) => {
                expect(res).to.have.status(400);
                expect(res.body.message).to.equal('the request was incomplete');
                expect(res.body.required[1]).to.equal('schema');
            })
            .catch((err) => { throw err; });
    });
});

after(async () => {
    await SchemaModel.dropTable();
	server.conn.close(0);
});
