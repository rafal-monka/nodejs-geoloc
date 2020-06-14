const Route = require('../models/route-model')

exports.getAll = (req, res, next) => {  
    Route.find({})
        .then(function (result) {
            res.json(result)
        })
        .catch (next) 
}

exports.create = (req, res, next) => {  
    let obj = {
        imei,
        name,
        datefrom,
        dateto,
        pausetime,
        distance,
        distance2
    } = req.body
    let route = new Route(obj)
    route.save()
        .then(function (result ){
            res.status(200).json(result)
        })
        .catch (next)      
}

