process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Place = require('../app/models/apikey-model');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp); //https://www.chaijs.com/api/bdd/

describe('API keys', () => { 

    describe('GET /api/apikey', () => {
        it('it should GET all API keys', (done) => {            
            chai.request(server) 
                .get('/api/apikey')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array').with.lengthOf(3)
                    done();
                });
        });
    });

    describe('GET /api/apikey/gmaps', () => {
        it('it should GET Google Maps API key', (done) => {
            chai.request(server) 
                .get('/api/apikey/gmaps')
                .end((err, res) => {
                    res.should.have.status(200)
                    done();
                });
        });
    });

});


    //Before each test we empty the database -> clean.js
    // before((done) => { 
    //     Place.deleteMany({}, (err) => { 
    //        done();           
    //     });        
    // });