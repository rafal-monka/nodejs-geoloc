const wss = require('../../wss')

exports.notFound = (req, res) => res.json({status: 'fail', code: '404'})
exports.serverError = (err, req, res, next) => res.json({status: 'fail', code: '500', msg: err.stack})

exports.test = (req, res) => {    
    //let wssClients = wss.findClient('357876082170434')
    //console.log('wssClients.length', wssClients.length)
    let arr = []
    //console.log('wss.clients', wss.clients)
    //send test message to 
    for (let client of wss.getClients()) {
            if (client.isAlive === false) return client.ws.terminate();      
            //###client.isAlive = false;
            let respMsg = new Date()+'Message to all clients...'
            arr.push(client.clientInfo)
            console.log(respMsg)
            //send to ALL
            //if (client.clientInfo.imei === "357876082170434") {
                client.send(respMsg);
            //}
    };

    //console.log( wss.clients )
    res.json( arr )
}
