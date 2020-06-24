const express = require('express')
const router = express.Router()
const device = require('../controllers/device-controller.js')

router.get('/', device.getAll)

module.exports = router