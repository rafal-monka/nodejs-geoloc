const moment = require('moment')
const Geoloc = require('../models/geoloc-model')
const Device = require('../models/device-model')
const panelDataConf = require('./paneldata-conf')
const DETAILED_GEOLOCS_LIMIT = 2000

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
    console.log('create.geoloc.obj', obj)
    let geoloc = new Geoloc(obj)
    geoloc.save()
        .then(function (result ){
            res.status(200).json(result)
        })
        .catch (next)  
}

getDetailedGeolocs = (imei, startTime, endTime) => {
// console.log('findDetailedGeolocs (imei, startTime, endTime)', imei, startTime, endTime)
    var startDate = moment(startTime).utcOffset('+0000').format("YYYY-MM-DDTHH:mm:ss.SSSZ"); 
    var endDate   = moment(endTime).utcOffset('+0000').format("YYYY-MM-DDTHH:mm:ss.SSSZ"); 
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
                geolocs.push([
                    element.latitude, 
                    element.longitude, 
                    element.speed*3.6  //m/s -> km/h ###Math.round(Math.random()*100)
                ]) 
            })
            return geolocs
        })
}

getAggregatedGeolocs = (imei, startTime, endTime, minDeviceTime, sectionWidth) => {
// console.log('getAggregatedGeolocs[1]', imei, startTime, endTime, minDeviceTime, sectionWidth)
    var startTime = moment(startTime).utcOffset('+0000').format("YYYY-MM-DDTHH:mm:ss.SSSZ"); 
    var endTime = moment(endTime).utcOffset('+0000').format("YYYY-MM-DDTHH:mm:ss.SSSZ"); 
// console.log('getAggregatedGeolocs[2]', imei, startTime, endTime)
    return Geoloc
        .aggregate(
            panelDataConf.aggregated(imei, startTime, endTime, minDeviceTime, sectionWidth)    
        )
        .then((results) => {
            console.log('getAggregatedGeolocs', 'return results', results.length)
            let geolocs = []
            results.forEach(element => {
                geolocs.push([
                    element.avg_lat, 
                    element.avg_lng, 
                    element.avg_speed*3.6,  //m/s -> km/h 
                    element.min_lat,
                    element.max_lat,
                    element.min_lng,
                    element.max_lng,
                    element.count
                ]) 
            })
            return geolocs
        })
}

exports.panelData = async (req, res, next) => { 
    try {    
        var imei = req.params.imei 
        var startTime = moment(req.params.startTime).utcOffset('+0000').format("YYYY-MM-DDTHH:mm:ss.SSSZ"); 
        var endTime   = moment(req.params.endTime).utcOffset('+0000').format("YYYY-MM-DDTHH:mm:ss.SSSZ"); 
        Geoloc
            .aggregate(
                panelDataConf.metadata(imei, startTime, endTime)    
            )
            .then(async metadata => {
                try {
                    if (metadata.length === 1) {
                        let geolocs = {}
                        let type 
                        if (metadata[0].count <= DETAILED_GEOLOCS_LIMIT) {                           
                            type = 'detailed'
                            geolocs = await getDetailedGeolocs(imei, startTime, endTime)
                        } else {
                            //@@@
                            type = 'aggregated'
                            let sectionWidth = Math.round(metadata[0].devicetime_span / DETAILED_GEOLOCS_LIMIT);
                            geolocs = await getAggregatedGeolocs(imei, startTime, endTime, metadata[0].min_devicetime, sectionWidth)
                        }                              
                        res.json({
                            type: type,
                            geolocs: geolocs,
                            metadata: metadata
                        })          
                    }  else {
                        res.status(404).json("Something went wrong with getting panel data.")
                    } 
                } catch (err) {
                    next(err)
                }         
            }) 
    } catch (err) {
        next(err)
    }
}


