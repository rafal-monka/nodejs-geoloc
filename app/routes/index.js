const express = require('express')
const router = express.Router()
const coreHandlers = require('../controllers/core-controller')
const fs = require('fs')
const routesPath = `${__dirname}/`
const { removeExtensionFromFile } = require('../middleware/utils')
const deviceMiddleware = require('../middleware/device-middleware.js')

//myMiddleware
const myMiddlewareLog = async (req, res, next) => {
    console.log('myMiddlewareLog', req.originalUrl)
    next()
}
router.use(myMiddlewareLog)

//check/register device before each POST request
router.post('*', deviceMiddleware)

// Loop routes path and loads every file as a route except this file and Auth route
fs.readdirSync(routesPath).filter((file) => {
    // Take filename and remove last part (extension)
    const routeFile = removeExtensionFromFile(file)
    // Prevents loading of this file and auth file
    return routeFile !== 'index' && routeFile !== 'auth'
      ? router.use(`/api/${routeFile}`, require(`./${routeFile}`))
      : ''
})

router.get("/api/home", (req, res) => {
    res.json({ message: "Welcome to Geoloc API application." });
});




// custom 404 page
router.use(coreHandlers.notFound)
// custom 500 page
router.use(coreHandlers.serverError)

module.exports = router