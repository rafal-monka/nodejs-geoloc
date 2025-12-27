const https = require('https');
const Apikey = require('../models/apikey-model')

const GOOGLE_MAPS_API_URL = process.env.GOOGLE_MAPS_API_URL;
const GOOGLE_MAPS_API_WEB_KEY_NAME = process.env.GOOGLE_MAPS_API_WEB_KEY_NAME;

exports.getKey = (req, res, next) => {      
    const keyname = GOOGLE_MAPS_API_WEB_KEY_NAME;
    Apikey.findOne({name: keyname})
        .then(function (result) {
            res.json( {key: result.key} )
        })
        .catch (next) 

    
}

exports.getDirections = (req, res, next) => {  
    let origin = '' || req.query.origin;
    let destination = '' || req.query.destination;
    let waypoints = '' || req.query.waypoints;
    let mode = '' || req.query.mode;
        
    let url = GOOGLE_MAPS_API_URL +"directions/json";
    const keyname = GOOGLE_MAPS_API_WEB_KEY_NAME;

    Apikey.findOne({name: keyname})
        .then(function (result) {
            //res.json( {key: result.key} )

            url += `?origin=${(origin)}`
            url += `&destination=${(destination)}&waypoints=${(waypoints)}`
            url += `&mode=${(mode)}`
            url += `&key=${(result.key)}` ; //_DIRECTIONS

            //res.json({url: encodeURI(url)})
            https.get(encodeURI(url), res2 => {
                let data = [];
                //const headerDate = res2.headers && res.headers.date ? res2headers.date : 'no response date';
                //console.log('Status Code:', res2.statusCode);
                //console.log('Date in Response header:', headerDate);

                res2.on('data', chunk => {
                    data.push(chunk);
                });

                res2.on('end', () => {
                    console.log('Response ended: ');
                    const result = JSON.parse(Buffer.concat(data).toString());

                    res.json(result)
                });
            }).on('error', err => {
                console.log('Error: ', err.message);
            });

        })
        .catch (next)
}

