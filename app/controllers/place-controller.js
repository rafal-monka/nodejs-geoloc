const Place = require('../models/place-model')

exports.getAll = (req, res, next) => {  
    Place.find({})
        .then(function (result) {
            res.json(result)
        })
        .catch (next) 
}


exports.getTest = (req, res, next) => {  
    Place.find({})
        .then(function (result) {
            let places = []
            result.forEach(element => {
                places.push({
                    lat: element.latitude, 
                    lng: element.longitude                    
                }) 
            })
            res.json(places)
        })
        .catch (next) 
}

exports.create = async (req, res, next) => {   
    let obj = {
        imei,
        userid,
        longitude,
        latitude,
        altitude,
        name,
        devicetime,
        bts_lng,
        bts_lat 
    } = req.body
    let place = new Place(obj)

    //###check if place already exists
    place.save()
        .then(function (result ){
            res.status(200).json(result)
        })
        .catch (next)
}

