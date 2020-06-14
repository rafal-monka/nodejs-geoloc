
const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema({ 
    imei : String,
    name : String,
    datefrom : Date ,
    dateto : Date ,
    pausetime: Number,
    distance: Number,
    distance2: Number,
    created_at : { type: Date, default: new Date() },
    updated_at : { type: Date, default: null }
})

module.exports = mongoose.model('Route', routeSchema)
