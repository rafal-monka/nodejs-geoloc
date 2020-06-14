const Apikey = require('../models/apikey-model')

exports.getAll = (req, res, next) => {  
    Apikey.find({})
        .then(function (result) {
            res.json(result)
        })
        .catch (next) 
}

exports.getOne = (req, res, next) => {  
    Apikey.find({name: req.params.name})
        .then(function (result) {
            res.json({key: result[0].key})
        })
        .catch (next) 
}