'use strict';

const net = require("net");
const port = 3000;
const server = net.createServer();


let socketPool = [];

server.on('connection', (socket) => {

    socket.username = `User ${Math.random()}`;

    socketPool = [...socketPool, socket];

    socket.on('data', (buffer) => {

        let text = buffer.toString();

        // /nickname <something>
        if ( text.startsWith("/nickname"))  {
            socket.username = text.trim().split(" ").slice(1).join(" ");
        }

        // hit up my /dm
        if ( text.startsWith("/dm")){
        }
        // /quit
        if ( text.startsWith("/quit")) {
        }
        // Broadcast the message
        console.log(socket.username, ":", text);

        socketPool.forEach(function(connection) {
            connection.write(text);
        });
    });
});

server.listen(port, ()=>{
    console.log("Alive on port", port);
});
