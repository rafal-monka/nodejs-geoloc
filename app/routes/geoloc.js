const express = require('express')
const router = express.Router()
const geoloc = require('../controllers/geoloc-controller.js')

router.post('/', geoloc.create)
router.get('/:imei', geoloc.find)

router.get('/paneldata/:imei/:startTime/:endTime', geoloc.panelData)

//TO-DELETE
//router.get('/between/:startTime/:endTime/:imei', geoloc.findBetweenTime)


module.exports = router