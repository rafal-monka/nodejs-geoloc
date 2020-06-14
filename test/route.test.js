process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Route = require('../app/models/route-model');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp); //https://www.chaijs.com/api/bdd/

const _NAME = 'ROUTE-NAME-TEST'

describe('Routes', () => {

    describe('POST /api/route', () => {
        it('it should POST route', (done) => {
            let body = {
                imei: 'IMEI-TEST-1',
                name: _NAME,
                datefrom: '2020-06-10T08:08:43.000+00:00',
                dateto: '2020-06-10T08:08:43.000+00:00',
                pausetime: 1000,
                distance: 1000,
                distance2: 1000 
            }
            chai.request(server)
                .post('/api/route')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('name').eql(_NAME)
                    done();
                });
        });    
    }); 

    describe('GET /api/route', () => {
        it('it should GET all the routes', (done) => {
            chai.request(server) 
                .get('/api/route')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array').with.lengthOf(1)
                    done();
                });
        });
    });

    after( async () => {  
        await Route.deleteMany({})
    })

});
