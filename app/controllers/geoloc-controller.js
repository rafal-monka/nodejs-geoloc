const moment = require('moment')
const Geoloc = require('../models/geoloc-model')
const Device = require('../models/device-model')

exports.find = (req, res, next) => { 
    Device.find( {imei: req.params.imei} )
        .then(function (result) {
            res.json(result)
        })
        .catch (next) 
}

exports.findBetweenTime = (req, res, next) => {
    console.log('req.params.startTime, .endTime, .imei', req.params.startTime, req.params.endTime, req.params.imei)
    var startDate = moment(req.params.startTime).utcOffset('+0000').format("YYYY-MM-DDTHH:mm:ss.SSSZ"); 
    var endDate   = moment(req.params.endTime).utcOffset('+0000').format("YYYY-MM-DDTHH:mm:ss.SSSZ"); 
    console.log('startDate, endDate', startDate, endDate)
    Geoloc
        .find({ 
            imei: req.params.imei,        
            devicetime: {
                $gte:  startDate,
                $lte:  endDate
            }
        }, null, {sort: {devicetime: 1}})
        .limit(500)
        .then(function (result) {
            let geolocs = []
            result.forEach(element => {
                geolocs.push([
                    element.latitude, 
                    element.longitude, 
                    element.speed*3.6  //m/s -> km/h ###Math.round(Math.random()*100)
                ]) 
            })
            res.json(geolocs)
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

