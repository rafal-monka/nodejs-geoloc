const express = require('express')
const router = express.Router()
const upload = require('../controllers/upload-controller.js')

router.post('/', upload.create)

module.exports = router