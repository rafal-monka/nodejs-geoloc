require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser");
const path = require('path')
const expressHandlebars = require('express-handlebars')
const app = express();
const morgan = require('morgan');

const initDatabase = require('./config/database')
const wss = require('./wss')

//NODE_ENV
console.log("server/process.env.NODE_ENV", process.env.NODE_ENV)
console.log("app.get('env')", app.get('env'))
console.log("process.env.npm_package_version", process.env.npm_package_version)

//don't show the log when it is test
if(process.env.NODE_ENV !== 'test') {
  //use morgan to log at command line
  app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

//handlebars
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main',
}))
app.set('view engine', 'handlebars')

//cors
app.use(cors())

//bodyParser
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'})); 


//app routes (API)
app.use("/api", /* checkJwt,*/ require('./app/routes/'))

//make default URL for SPA
const buildLocation = 'public'; //include public folder with SPA app
app.use(express.static(path.join(__dirname, buildLocation)));

//#https://blog.fullstacktraining.com/404-after-refreshing-the-browser-for-angular-vue-js-app/
app.use("/*", (req, res, next) => {
    if (!req.originalUrl.includes(buildLocation) && !req.originalUrl.includes('/api/') && !req.originalUrl.includes('/login') && !req.originalUrl.includes('/user') && !req.originalUrl.includes('/logout') ) {    
        res.sendFile(`${__dirname}/${buildLocation}/index.html`);
    } else {
        next();
    }
});

//port
const port = process.env.PORT
//start server
var server = app.listen(port, (err) => {
    if (err) return console.log(err)
    //start wss server
    wss.init(server)
    return console.log(`server is listening on ${port}`)
})

//init database
initDatabase()

module.exports = app; // for testing


//----------------test
//for wss - unused
// server.on('upgrade', function upgrade(request, socket, head) {
//     console.log('app.on-upgrade/request.query.key', url.parse(request.url,true).query.key)
//     // wss.handleUpgrade(request, socket, head, function done(ws) {
//     //   console.log('wss.handleUpgrade', request.url)
//     //   wss.emit('connection', ws, request, client)
//     // });
// });


