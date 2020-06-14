const express = require('express')
const router = express.Router()
const geoloc = require('../controllers/geoloc-controller.js')

router.post('/', geoloc.create)
router.get('/:imei', geoloc.find)

module.exports = router