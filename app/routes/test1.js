const express = require('express')
const router = express.Router()

const core = require('../controllers/core-controller.js')

router.get('/', core.test)

module.exports = router