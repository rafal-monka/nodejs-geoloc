const express = require('express')
const router = express.Router()
const route = require('../controllers/route-controller.js')

router.get('/', route.getAll)
router.post('/', route.create)

module.exports = router