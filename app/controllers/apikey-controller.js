const Apikey = require('../models/apikey-model')

exports.getAll = (req, res, next) => {  
    Apikey.find({})
        .then(function (result) {
            res.json(result)
        })
        .catch (next) 
}

exports.getOne = (req, res, next) => {
    const keyname = req.params.name;  
    Apikey.findOne({name: keyname})
        .then(function (result) {
            res.json( {key: result.key} )
        })
        .catch (next) 
}
