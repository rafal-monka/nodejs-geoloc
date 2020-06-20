require('dotenv').config()
const express = require('express')
const http = require('http')
const url = require('url')
const cors = require('cors')
const bodyParser = require("body-parser");
const path = require('path')
const expressHandlebars = require('express-handlebars')
const app = express();
const WebSocket = require('ws');
let morgan = require('morgan');
const initDatabase = require('./config/database')

//NODE_ENV
console.log("server/process.env.NODE_ENV", process.env.NODE_ENV)
console.log("app.get('env')", app.get('env'))
console.log("process.env.npm_package_version", process.env.npm_package_version)

//don't show the log when it is test
if(process.env.NODE_ENV !== 'test') {
  //use morgan to log at command line
  app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

app.use(cors())

//make default URL for SPA
const buildLocation = 'public';
app.use(express.static(path.join(__dirname, buildLocation))); //include public folder with SPA app   
//#https://blog.fullstacktraining.com/404-after-refreshing-the-browser-for-angular-vue-js-app/
app.use((req, res, next) => {
  if (!req.originalUrl.includes(buildLocation) && !req.originalUrl.includes('/api/')) {
    res.sendFile(`${__dirname}/${buildLocation}/index.html`);
  } else {
    next();
  }
});

app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'})); 

//app routes
app.use(require('./app/routes/'))

//handlebars
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main',
}))
app.set('view engine', 'handlebars')




//start server
const clients = [];

const port = process.env.PORT || 3033
var server = app.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }
  return console.log(`server is listening on ${port}`)
})



//-----------------wss
server.on('upgrade', function upgrade(request, socket, head) {
    console.log('app.on-upgrade/request.query.key', url.parse(request.url,true).query.key)
    //console.log('calling app.on-upgrade.handleUpgrade...', request.url)

    // wss.handleUpgrade(request, socket, head, function done(ws) {
    //   console.log('wss.handleUpgrade', request.url)
    //   wss.emit('connection', ws, request, client)
    // });

});
//web socket
const wss = new WebSocket.Server(/*{ noServer: true }*/{server : server});


wss.on('connection', function connection(ws, request /*, client*/) {
    console.log('wss.on-connection/request.query.key', url.parse(request.url,true).query.key)
    let clientID = url.parse(request.url,true).query.key
    console.log('wss.on-connection/clientID=', clientID)

    let c = clients.findIndex(i => i.clientID === clientID)
    console.log('found?',c)
    if (c === -1) clients.push( {ws: ws, clientID: clientID} );

    ws.on('message', function message(msg) {
        console.log(`wss.on-message Received message ${msg} from client ${clientID}`)
        let i = 0
        for (let client of clients) {
          i++
          console.log(i)
          if (clientID === client.clientID) {
              //console.log('sending from client/clientID=',client.clientID)
              let txt = 'RE:'+msg.toUpperCase()
              client.ws.send(txt);
          } else {
              //console.log('bypass client/clientID=',client.clientID)
          }
        }

        //@@@loop
        if (false) setInterval(function ping() {
            clients.forEach(function each(client) {
              if (client.isAlive === false) return client.terminate();      
              //###client.isAlive = false;
              console.log('sending...', new Date())
              client.ws.send(new Date()+"/sending...");
            });
        }, 5000);

    });
});
//-----------------wss

//init database
initDatabase()

module.exports = app; // for testing

  