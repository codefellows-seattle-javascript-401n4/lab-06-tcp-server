'use strict';

const net = require('net');
const server = net.createServer();
const port = 3000;

let clientPool = [];

server.on('connection', (socket) => {

  clientPool.push(socket);

  socket.username = `User ${(clientPool.indexOf(socket) + 1) }`;

  console.log(`${socket.username} has connected.`);

  socket.on('data', (buffer) => {

    let text = buffer.toString();

    // if(text.startswith('/name')){
    //   socket.username = text.split(" ").slice(1).join(" ");
    // };

    console.log(socket.username + ": " + text);
  })

});

server.listen(port, () => {
  console.log("Server up on port: ", port);
});
