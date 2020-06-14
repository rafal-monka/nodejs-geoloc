
const mongoose = require('mongoose')

const placeSchema = new mongoose.Schema({ 
    imei: String,
    userid: { type: Number, default: null },
    longitude: Number,
    latitude: Number,
    altitude: Number,
    accuracy : { type: Number, default: null },
    name: String,
    devicetime: Date,
    bts_lng : { type: Number, default: null },
    bts_lat : { type: Number, default: null },
    bts_info: { type: String, default: null },     
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: null }
})

module.exports = mongoose.model('Place', placeSchema)
