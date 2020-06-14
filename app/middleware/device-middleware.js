const Device = require('../models/device-model')

module.exports = async (req, res, next) => {
    console.log('deviceMiddleware')
    if (!req.body.imei) {
        res.status(404).send("Missing IMEI number")
        return
    }
    let device = new Device({
        imei: req.body.imei,
        description: req.body.clientdata === undefined ? '': req.body.clientdata
    })
    Device
        .find( {imei: device.imei}, async function (err, docs) {
            console.log('###devices (docs.length)', docs.length)
            if (docs.length===0) {
                await device.save()
            } else {                
                console.log('###device already exists', docs[0].description, device.description)
                if (device.description) { 
                    if (docs[0].description === undefined || (docs[0].description && docs[0].description.toLowerCase() !== device.description.toLowerCase())) {
                        await Device.findByIdAndUpdate(docs[0]._id, {
                            description: device.description,
                            updated_at: new Date()
                        })
                    }
                }                
            }
            next()
        })
        .catch(next) 
}