const url = require('url')
const WebSocket = require('ws');

var wss;

getClients = () => {
    return [...wss.clients]
}

exports.getClients = getClients

exports.init = (server) => {
    wss = new WebSocket.Server(/*{ noServer: true }*/{server : server});
    wss.on('connection', function connection(ws, request) {
        let clientID = request.headers['sec-websocket-key'] 
        let imei = url.parse(request.url,true).query.imei

        ws.clientInfo = {
            clientID: clientID, 
            imei: imei
        }

        console.log('wss.on-connection/request.query (imei)', imei, clientID)
        ws.send('[server] New client connected #'+clientID+' for IMEI '+imei);
        //#ws.on('pong', heartbeat);

        ws.on('close', function message(msg, clientID) {
            console.log(`wss.on-close Received message code=${msg}, key/clientID=${clientID}`)
        })
            
        ws.on('message', function message(msg) {
            console.log(`wss.on-message Received message ${msg} from client ${clientID}`)
            getClients()
                .filter(client => client.clientInfo.clientID === clientID )
                .forEach(client => {
                    client.send( '[SERVER] RE:'+msg.toUpperCase() );
                })
        });

    });   

}


//----temp
//#test ping loop
// if (false) setInterval(function ping() {
//     clients.forEach(function each(client) {
//     if (client.isAlive === false) return client.terminate();      
//     //###client.isAlive = false;
//     console.log('ping...', new Date())
//     client.ws.send(new Date()+" - message...");
//     });
// }, 5000);

//#not used
// heartbeat = () => {
//     this.isAlive = true
//     console.log('[server] on-pong', thos.clientID);
// }


/*let i = 0
for (let client of wss.clients) {
    i++
    console.log(i)
    if (clientID === client.clientInfo.clientID) {
        let txt = '[SERVER] RE:'+msg.toUpperCase()
        client.send(txt);
    } else {
        //do nothing
    }
}
*/