const express = require('express')
const router = express.Router()
const apikey = require('../controllers/apikey-controller.js')

router.get('/', apikey.getAll)
router.get('/:name', apikey.getOne)

module.exports = router