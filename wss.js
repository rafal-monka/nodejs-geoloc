const url = require('url')
const WebSocket = require('ws');

var wss;

exports.getClients = () => {
    return wss.clients
}

//#not used
// heartbeat = () => {
//     this.isAlive = true
//     console.log('[server] on-pong', thos.clientID);
// }

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
            let i = 0
            for (let client of wss.clients) {
                i++
                console.log(i)
                if (clientID === client.clientInfo.clientID) {
                    let txt = '[server] RE:'+msg.toUpperCase()
                    client.send(txt);
                } else {
                    //do nothing
                }
            }
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
