const express = require('express')
const router = express.Router()
const place = require('../controllers/place-controller.js')

router.get('/', place.getAll)
router.post('/', place.create)

module.exports = router