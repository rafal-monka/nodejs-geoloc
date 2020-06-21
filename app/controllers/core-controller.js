const wss = require('../../wss')

exports.notFound = (req, res) => res.json({status: 'fail', code: '404'})
exports.serverError = (err, req, res, next) => res.json({status: 'fail', code: '500', msg: err.stack})

exports.test = (req, res) => {    
    //send test message to ALL 
    for (let client of wss.getClients()) {
            if (client.isAlive === false) return client.ws.terminate();      
            //###client.isAlive = false;
            let respMsg = new Date()+'Message to all clients...'
            //arr.push()
            console.log(respMsg)
            //send to ALL
            //if (client.clientInfo.imei === "357876082170434") {
                client.send(respMsg);
            //}
    };
    
    let arr = [...wss.getClients()].map(item => item.clientInfo)
    res.json( arr )
}
