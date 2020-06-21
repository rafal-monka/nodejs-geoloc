const moment = require('moment')
const Geoloc = require('../models/geoloc-model')
const Device = require('../models/device-model')
const panelDataConf = require('../../config/paneldata')
const wss = require('../../wss')

const DETAILED_GEOLOCS_LIMIT = 2000 //number of max records for detailed geolocs, otherwise query for aggregated
const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZ"

//###TO-DELETE
exports.find = (req, res, next) => { 
    Device.find( {imei: req.params.imei} )
        .then(function (result) {
            res.json(result)
        })
        .catch (next) 
}

exports.create = (req, res, next) => {   
    let obj = {
        imei,
        deviceid,
        clientdata, 
        serverdata,
        longitude,
        latitude,
        altitude,
        accuracy,
        speed,
        bearing,
        name,
        devicetime,
        bts_lng,
        bts_lat,
        bts_info 
    } = req.body

    obj.clientdata = 'on' /* on-line */
    let geoloc = new Geoloc(obj)
    geoloc.save()
        .then(function (result ){
            for (let client of wss.getClients()) {
                if (client.clientInfo.imei === result.imei) {
                    client.send(JSON.stringify(result));
                }
            };
            res.status(200).json(result)
        })
        .catch (next)  
}

exports.panelData = async (req, res, next) => { 
    try {    
        var imei = req.params.imei 
        var startTime = moment(req.params.startTime).utcOffset('+0000').format(DATE_FORMAT); 
        var endTime   = moment(req.params.endTime).utcOffset('+0000').format(DATE_FORMAT); 
        Geoloc
            .aggregate(
                panelDataConf.metadata(imei, startTime, endTime)    
            )
            .then(async metadata => {
                try {
                    let geolocs = {}
                    let type 
                    if (metadata.length === 1) {
                        if (metadata[0].count <= DETAILED_GEOLOCS_LIMIT) {                           
                            type = 'detailed'
                            geolocs = await getDetailedGeolocs(imei, startTime, endTime)
                        } else {
                            type = 'aggregated'
                            let sectionWidth = Math.round(metadata[0].devicetime_span / DETAILED_GEOLOCS_LIMIT);
                            geolocs = await getAggregatedGeolocs(imei, startTime, endTime, metadata[0].min_devicetime, sectionWidth)
                        }                              
                    } else {
                        type = "nodata"
                    } 
                    res.json({
                        type: type,
                        geolocs: geolocs,
                        metadata: metadata
                    })  
                } catch (err) {
                    next(err)
                }         
            }) 
    } catch (err) {
        next(err)
    }
}

getDetailedGeolocs = (imei, startTime, endTime) => {
// console.log('findDetailedGeolocs (imei, startTime, endTime)', imei, startTime, endTime)
    var startDate = moment(startTime).utcOffset('+0000').format(DATE_FORMAT); 
    var endDate   = moment(endTime).utcOffset('+0000').format(DATE_FORMAT); 
// console.log('startDate, endDate', startDate, endDate)
    return Geoloc
        .find({ 
            imei: imei,        
            devicetime: {
                $gte:  startDate,
                $lte:  endDate
            }
        }, null, {sort: {devicetime: 1}})
        .limit(DETAILED_GEOLOCS_LIMIT)
        .then(function (result) {
            let geolocs = []
            result.forEach(element => {
                geolocs.push({
                    lat: element.latitude, 
                    lng: element.longitude, 
                    spd: element.speed*3.6,  //m/s -> km/h ###Math.round(Math.random()*100)
                    btslat: element.bts_lat,
                    btslng: element.bts_lng,
                    btsi: element.bts_info
                }) 
            })
            return geolocs
        })
}
    
getAggregatedGeolocs = (imei, startTime, endTime, minDeviceTime, sectionWidth) => {
// console.log('getAggregatedGeolocs[1]', imei, startTime, endTime, minDeviceTime, sectionWidth)
    var startTime = moment(startTime).utcOffset('+0000').format(DATE_FORMAT); 
    var endTime = moment(endTime).utcOffset('+0000').format(DATE_FORMAT); 
// console.log('getAggregatedGeolocs[2]', imei, startTime, endTime)
    return Geoloc
        .aggregate(
            panelDataConf.aggregated(imei, startTime, endTime, minDeviceTime, sectionWidth)    
        )
        .then((results) => {
            console.log('getAggregatedGeolocs', 'return results', results.length)
            let geolocs = []
            results.forEach(element => {
                geolocs.push({
                    lat: element.avg_lat, 
                    lng: element.avg_lng, 
                    spd: element.avg_speed*3.6,  //m/s -> km/h 
                    minlat: element.min_lat,
                    maxlat: element.max_lat,
                    minlng: element.min_lng,
                    maxlng: element.max_lng,
                    cnt: element.count
                }) 
            })
            return geolocs
        })
}
