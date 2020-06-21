const wss = require('../../wss')

exports.listClients = (req, res) => {    
    let arr = wss.getClients()//[...wss.getClients()]
    //send test message to ALL 
    arr.forEach(client => {    
        let respMsg = new Date()+'Message to all clients...'
        client.send(respMsg);
    });

    // tmp = []
    // arr.filter(i => i.clientInfo.imei === "357876082170434" ).forEach(item => {
    //     tmp.push( item.clientInfo )
    // })

    res.render("wss-clients", {clients: arr.map(item => item.clientInfo)/*, tmp: JSON.stringify(tmp)*/} )    
}
