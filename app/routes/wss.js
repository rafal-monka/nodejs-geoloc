const express = require('express')
const router = express.Router()

const wssCtrl = require('../controllers/wss-controller.js')

router.get('/', wssCtrl.listClients)

module.exports = router