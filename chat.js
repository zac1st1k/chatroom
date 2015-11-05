var net = require('net');

var chatServer = net.createServer(),
    clientList = [];
chatServer.on('connection', function(client) {
    'use strict';
    client.name = client.remoteAddress + ':' + client.remotePort;
    client.write('Hi ' + client.name + '!\n');
    clientList.push(client);
    client.on('data', function(data) {
        broadcast(data, client);
    });
    client.on('end', function() {
        clientList.splice(clientList.indexOf(client), 1);
    });
});


function broadcast(message, client) {
    'use strict';
    var cleanup = [];
    for (var i = 0; i < clientList.length; i += 1) {
        if (client !== clientList[i]) {
            if (clientList[i].writable) {
                clientList[i].write(client.name + ' says ' + message);
            } else {
                cleanup.push(clientList[i]);
                clientList[i].destroy();
            }
        }
    }
    for (i = 0; i < cleanup.length; i += 1) {
        clientList.splice(clientList.indexOf(cleanup[i]), 1);
    }
}
chatServer.listen(9000);