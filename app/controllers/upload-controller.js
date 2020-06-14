
const Device = require('../models/device-model')
const Geoloc = require('../models/geoloc-model')
const Place = require('../models/place-model')
const Route = require('../models/route-model')

let geolocCount = []
let placeCount = []
let routeCount = []

exports.create = async (req, res, next) => {    
    try {
        // Get request
        const geolocs = req.body.geolocs
        const routes = req.body.routes 
        const places = req.body.places
        const imei = req.body.imei
        //common
        let clientdata = 'off' /* off-line */

        //geolocs
        if (geolocs) {
            console.log('geolocs');
            geolocsArr = []
            geolocs.map(geoloc => {
                let recArr = geoloc.substring(1, geoloc.length-1).split(',') 
                let bts = {
                    bts_lng: 0,
                    bts_lat: 0,
                    bts_info: ''
                }
                try { 
                    bts = {
                        bts_lng: +recArr[9],
                        bts_lat: +recArr[10],
                        bts_info: recArr[11].substring(1) 
                    }    
                } catch (e) {
                    //do nothing
                }  
                let obj = {
                    imei: imei,
                    clientdata: clientdata,
                    longitude: +recArr[0],
                    latitude: +recArr[1],
                    altitude: +recArr[2],
                    accuracy: +recArr[3], 
                    speed: +recArr[4], 
                    bearing: +recArr[5],
                    name: recArr[6].substring(1),
                    devicetime: recArr[7].substring(1),
                    bts_lng: bts.bts_lng,
                    bts_lat: bts.bts_lat,
                    bts_info: bts.bts_info
                }
                /* Note: recArr[8] _ID is not saved in database but used in cache upload! */
                   
                //console.log('upload.geoloc.obj', obj)
                geolocsArr.push(obj)       
            })
            geolocCount = await Geoloc.insertMany(geolocsArr)                        
        }

        //places
        if (places) {
            console.log('places');
            placesArr = []
            places.map(place => {
                let recArr = place.substring(1, place.length-1).split(',')
                let obj = {
                    imei: imei,
                    longitude: +recArr[0],
                    latitude: +recArr[1],
                    altitude: +recArr[2],
                    name: recArr[3].substring(1),
                    devicetime: recArr[4].substring(1)
                }
                placesArr.push(obj)  
            })   
            placeCount = await Place.insertMany(placesArr) 
        }

        //routes
        if (routes) {
            console.log('routes');
            routesArr = []
            routes.map(route => {
                let recArr = route.substring(1, route.length-1).split(',')
                let obj = {
                    imei: imei,
                    name: recArr[0],
                    datefrom: recArr[1].substring(1),
                    dateto: recArr[2].substring(1),
                    distance: +recArr[3],
                    distance2: +recArr[4],
                    pausetime: +recArr[5],  
                }
                routesArr.push(obj)  
            })   
            routeCount = await Route.insertMany(routesArr) 
        }
        res.status(200).json({
            'status': 'OK', 
            'routeCount': routeCount.length,
            'placeCount': placeCount.length,
            'geolocCount': geolocCount.length
        })
    } catch (err) {
        console.log('###', err)
        next(err)
    }
}