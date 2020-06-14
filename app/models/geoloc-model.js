
const mongoose = require('mongoose')

const geolocSchema = new mongoose.Schema({ 
    imei: String,
    deviceid : { type: Number, default: null },
    clientdata: String,
    serverdata: String,
    longitude: Number,
    latitude: Number,
    altitude: Number,
    accuracy: Number,
    speed: Number,
    bearing: Number,
    name: String,
    devicetime: Date,
    bts_lng : { type: Number, default: 0 },
    bts_lat : { type: Number, default: 0 },
    bts_info: { type: String, default: '' },    
    created_at : { type: Date, default: new Date() },
    updated_at : { type: Date, default: null }
})

module.exports = mongoose.model('Geoloc', geolocSchema)
