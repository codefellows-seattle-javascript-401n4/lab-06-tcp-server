'use strict';

const net = require('net');
const server = net.createServer();

const controller = require('./lib/controller.js');

let clientPool = require('./lib/clientPool.js');


server.on('connection', (socket) => {
  controller.connect(socket);
 
  socket.on('data', (buffer) => {
    controller.data(buffer, socket);
  });


});



server.listen(3000, () => console.log('server up!'));




// handle the .error and .disconnect - console.log who left, show list of new users