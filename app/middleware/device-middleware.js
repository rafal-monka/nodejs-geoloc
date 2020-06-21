const Device = require('../models/device-model')

module.exports = async (req, res, next) => {
    console.log('---deviceMiddleware---')
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
            if (docs.length===0) {
                console.log('---deviceMiddleware---/adding device')
                await device.save()
                console.log('---deviceMiddleware---/device added')
            } else {                
                if (device.description) { 
                    if (docs[0].description === undefined || (docs[0].description && docs[0].description.toLowerCase() !== device.description.toLowerCase())) {
                        console.log('---deviceMiddleware---/modyfing device description')
                        await Device.findByIdAndUpdate(docs[0]._id, {
                            description: device.description,
                            updated_at: new Date()
                        })
                        console.log('---deviceMiddleware---/description modified')
                    }
                }                
            }
            next()
        })
        .catch(next) 
}