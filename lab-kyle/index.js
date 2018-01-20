'use strict';

const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const Client = require('./model/client');
const cmdParser = require('./lib/command-parser');
const PORT = process.env.PORT || 3000;


//export for testing
const server = module.exports = net.createServer();

let clientPool = [];

ee.on('default', (client, string) => {
  client.socket.write(`Not a command: ${sting.trim().split(' ', 1)}\n`);
});


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
      connection.write(text);
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
