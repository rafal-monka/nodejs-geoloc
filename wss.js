const url = require('url')
const WebSocket = require('ws');

var wss;

exports.getClients = () => {
    return wss.clients
}

deleteClient = (clientID) => {
    if (!clientID) return
    let inx = clients.findIndex(item => item.clientID === clientID)
    console.log('deleteClient...',clientID, inx)
    if (inx === -1) throw new Error('deleteClient failed. NOT FOUND clientID '+clientID)
    clients.splice(inx, 1)
}

heartbeat = () => {
    this.isAlive = true
    console.log('[server] on-pong', thos.clientID);
}

exports.init = (server) => {
    wss = new WebSocket.Server(/*{ noServer: true }*/{server : server});
    wss.on('connection', function connection(ws, request /*, client*/) {
        let clientID = request.headers['sec-websocket-key'] 
        let imei = url.parse(request.url,true).query.imei

        //add new wss client when one does not exist
        // if (clients.findIndex(i => i.clientID === clientID) === -1) clients.push({
        //     ws: ws, 
        // });
        ws.clientInfo = {
            clientID: clientID, 
            imei: imei
        }
        //clients.add(ws)

        console.log('wss.on-connection/request.query (imei)', imei, clientID)
        ws.send('[server] New client connected #'+clientID+' for IMEI '+imei);
        //ws.on('pong', heartbeat);

        ws.on('close', function message(msg, clientID) {
            console.log(`wss.on-close Received message code=${msg}, key/clientID=${clientID}`)
            //if (this.isAlive === false) return ws.terminate();
            //deleteClient(clientID)
            //clients.delete(ws)
        })
            
        ws.on('message', function message(msg) {
            console.log(`wss.on-message Received message ${msg} from client ${clientID}`)
            let i = 0
            for (let client of wss.clients) {
                i++
                console.log(i)
                if (clientID === client.clientInfo.clientID) {
                    //console.log('sending from client/clientID=',client.clientID)
                    let txt = '[server] RE:'+msg.toUpperCase()
                    client.send(txt);
                } else {
                    //console.log('bypass client/clientID=',client.clientID)
                }
            }
    
            //@@@test ping loop
            if (false) setInterval(function ping() {
                clients.forEach(function each(client) {
                if (client.isAlive === false) return client.terminate();      
                //###client.isAlive = false;
                console.log('ping...', new Date())
                client.ws.send(new Date()+" - message...");
                });
            }, 5000);
    
        });

    });   

}


