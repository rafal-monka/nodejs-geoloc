const express = require('express')
const router = express.Router()
const gmaps = require('../controllers/google-maps-controller.js')

router.get('/getKey', gmaps.getKey)
router.get('/directions/', gmaps.getDirections)

module.exports = router