'use strict';

const net = require('net');
const port = 3000;
const server = net.createServer();

let clientPool = [];

server.on('connection', (socket) => {

  socket.username = `User ${Math.random()}`;

  clientPool = [...clientPool, socket];

  console.log('Sockeye Connected');

  socket.write('Much Chat Happens\n\n');

  socket.on('data', (buffer) => {

    let text = buffer.toString();
    if(text.startsWith('/nickname')) {
      socket.username = text.trim().split(' ').slice(1).join(' ');
    }
    console.log(socket.username + ': ' + text);


    let data = buffer.toString();
    clientPool.forEach((connection) => {
      connection.write(data);
    });

  }

  // socket.on('data', (buffer) => {
  //

  // });



  //socket.on('error');
  //socket.on('close');
  //socket.on('disconnect');

});

server.listen(port, () => {
  console.log('Active on port: ' + port);
});
