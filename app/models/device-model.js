
const mongoose = require('mongoose')
    
const deviceSchema = new mongoose.Schema({ 
    imei: {type: String/*, unique: true, required: true*/}, 
    description: String,
    status : {type: Number, default: 1},
    created_at : { type: Date, default: new Date() },
    updated_at : { type: Date, default: null }
});

module.exports = mongoose.model('Device', deviceSchema)