process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Place = require('../app/models/place-model');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp); //https://www.chaijs.com/api/bdd/

const _NAME = 'PLACE-NAME-TEST'

describe('Places', () => {

    describe('POST /api/place', () => {
        it('it should POST a place', (done) => {
            let place = {
                imei: 'IMEI-TEST-1',
                longitude: 17.11,
                latitude: 51.12,
                altitude: 123.45,
                name: _NAME,
                devicetime: '2020-06-05'
            }
            chai.request(server)
                .post('/api/place')
                .send(place)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('name').eql(_NAME)
                    done();
                });
        });    
    }); 

    describe('GET /api/place', () => {
        it('it should GET all the places', (done) => {
            chai.request(server) 
                .get('/api/place')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')//.with.lengthOf(1)
                    done();
                });
        });
    });

    after( async () => {  
        //await Place.deleteMany({})
    })

});


    //Before each test we empty the database -> clean.js
    // before((done) => { 
    //     Place.deleteMany({}, (err) => { 
    //        done();           
    //     });        
    // });