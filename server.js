require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser");
const path = require('path')
const expressHandlebars = require('express-handlebars')
const app = express();
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

//include public folder with SPA app
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));                                   
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
const port = process.env.PORT || 3033
app.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }
  return console.log(`server is listening on ${port}`)
})

//init database
initDatabase()

module.exports = app; // for testing

  