
const mongoose = require('mongoose')
    
const apikeySchema = new mongoose.Schema({ 
    name: String, 
    key: String,
    created_at : { type: Date, default: new Date() }
});

module.exports = mongoose.model('Apikey', apikeySchema)