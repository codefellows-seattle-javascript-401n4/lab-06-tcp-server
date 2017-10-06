'use strict';

const net = require('net');
const port = 8000;
const server = net.createServer();
const User = require('./lib/user.js');
const Message = require('./lib/message.js');

server.on('connection', (socket) => {
  console.log('Socket conneted');
  let newConnection = {username: Date.now(), id: socket.localAddress, socket: socket};
  let newPerson = new User(newConnection);
  newPerson.addUser();

  socket.on('data', (buffer) => {
    let message = new Message(buffer.toString(), socket, newPerson.username);
    message.typeHandler();
    console.log(`${newPerson.username}: ${message.fulltext}`);
  });
});

server.listen(port, () =>{
  console.log('Server alive on ' + port);
});
