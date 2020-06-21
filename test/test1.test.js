process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Place = require('../app/models/place-model');
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp); //https://www.chaijs.com/api/bdd/

describe('Test', () => {

    //Test the /GET route
    describe('/GET test (404)', () => {
        it('it should NOT found (404)', (done) => {
            chai.request(server) 
                .get('/api/NOTFOUND')
                .end((err, res) => {
                    res.should.have.status(200)                
                    res.body.should.be.a('object')
                    res.body.should.have.property('code').eql("404")
                    done();
                });
        });
    })

    //Test the /GET route
    describe('/GET test', () => {
        it('it should GET test1', (done) => {
            chai.request(server) 
                .get('/api/test1')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')//eql("test-controller-1")
                    done();
                });
        });
    });

});

/*
describe('Place', function() {
    describe('#Place.getAll()', function() {
        it('should retrieve places', async function() {
            let places = await Place.find()
            assert(places.length >= 0);
        });
    });
});
*/