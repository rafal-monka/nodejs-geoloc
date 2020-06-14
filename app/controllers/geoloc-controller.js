const Geoloc = require('../models/geoloc-model')
const Device = require('../models/device-model')

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

