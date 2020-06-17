process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Geoloc = require('../app/models/geoloc-model');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp); //https://www.chaijs.com/api/bdd/

const _IMEI = 'IMEI-TEST-1'

describe('Geolocs', () => {

    describe('POST /api/geoloc', () => {
        it('it should POST geoloc', (done) => {
            let body = {
                imei: _IMEI,
                deviceid: 0,
                serverdata: '',
                longitude: 100.11,
                latitude: 100.11,
                altitude: 100.11,
                accuracy: 100.11,
                speed: 10.11,
                bearing: 100.01,
                name: 'EMPTY',
                devicetime: '2020-06-10T08:08:43.000+00:00',
                bts_lng: 101.11,
                bts_lat: 102.11,
                bts_info: 'BTS-EMPTY-INFO'
            }
            chai.request(server)
                .post('/api/geoloc')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('imei').eql(_IMEI)
                    done();
                });
        });    
    }); 

    describe('GET /api/geoloc', () => {
        it('it should GET ###???', (done) => {
            chai.request(server) 
                .get('/api/geoloc/'+_IMEI)
                .end((err, res) => {
                    res.should.have.status(200)
                    done();
                });
        });
    });


    describe('GET /api/geoloc/paneldata/:from/:to/:imei', () => {
        it('it should GET geolocs from time period', (done) => {
            chai.request(server) 
                .get('/api/geoloc/paneldata/357876082170434/2020-06-14T11:09:12.000+00:00/2020-06-14T23:30:00.000+00:00')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    done();
                });
        });
    });

    after( async () => {  
        //await Geoloc.deleteMany({})
    })

});
