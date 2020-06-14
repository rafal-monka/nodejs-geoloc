process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Device = require('../app/models/device-model');
let Geoloc = require('../app/models/geoloc-model');
let Route = require('../app/models/route-model');
let Place = require('../app/models/place-model');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp); //https://www.chaijs.com/api/bdd/

describe('Upload', () => {

    describe('POST /upload', () => {
        it('it should POST upload', (done) => {
            let body = {
                "imei": "IMEI-TEST-1",
                "clientdata": "Android",
                "geolocs": [
                    "[-122.0842, 37.421998, 0.0, 20.0, 0.0, 0.0, [, 2020-06-09 17:44:11, 1, 1.1, 2.2, bts-1]",
                    "[-122.0842, 37.421998, 0.0, 20.0, 0.0, 0.0, +0, 2020-06-09 17:44:12, 2]",
                    "[-122.0842, 37.421998, 0.0, 20.0, 0.0, 0.0, ], 2020-06-09 17:44:13, 3, 1.1, 2.2, bts-3]"
                  ],
                "routes": [
                    "[jocker walk morning, 2020-06-09 17:00:00, 2020-06-09 17:30:00, 123, 456, 789]",
                    "[jocker walk afternoon, 2020-06-10 17:00:00, 2020-06-10 17:30:00, 1123, 1456, 1789]"
                    ],
                "places": [
                    "[-122.084, 37.422, 0, google, 2020-06-09 17:25:43]",
                    "[-122.084, 37.422, 0, test, 2020-06-09 17:26:51]",
                    "[-122.084, 37.422, 0, test-place1-offline, 2020-06-09 17:42:30]"
                  ]
            }
            chai.request(server)
                .post('/api/upload')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('geolocCount').eql(3)
                    res.body.should.have.property('routeCount').eql(2)
                    res.body.should.have.property('placeCount').eql(3)
                    done();
                });
        });    
    }); 

    describe('POST /upload', () => {
        it('it should FAIL upload: Missing IMEI number', (done) => {
            let body = {
                //"imei": "", //Missing IMEI number
                "geolocs": [
                    "[-122.0842, 37.421998, 0.0, 20.0, 0.0, 0.0, [, 2020-06-09 17:44:11, 1, 1.1, 2.2, bts-4]"
                  ]
            }
            chai.request(server)
                .post('/api/upload')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(404)
                    done();
                });
        });    
    }); 


    after( async () => {  
        //await Geoloc.deleteMany({})
        await Route.deleteMany({})
        await Place.deleteMany({})
        await Device.deleteMany({})
    })

});

