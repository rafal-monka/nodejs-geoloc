const Device = require('../models/device-model')

exports.getAll = (req, res, next) => {  
    Device.find({}, null, {sort: {imei: -1}})
        .then(function (result) {
            res.json(result)
        })
        .catch (next) 
}

