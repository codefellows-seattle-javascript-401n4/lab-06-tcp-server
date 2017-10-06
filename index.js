'use strict';

const net = require('net');
const port = 8000;
const server = net.createServer();
const User = require('./lib/user.js');
const Session = require('./lib/session.js');
const Message = require('./lib/message.js');

server.on('connection', (socket) => {
  console.log('Socket conneted');
  let newConnection = {username: Date.now(), id: socket.localAddress, socket: socket};
  let newPerson = new User(newConnection);
  let newSession = new Session({socket: socket, username: newPerson.username});
  newPerson.addUser();
  newSession.begin();
  socket.on('data', (buffer) => {
    let message = new Message(buffer.toString(), socket, newPerson.username);
    message.typeHandler();
    console.log(`${newPerson.username}: ${message.fulltext}`);
  });
});

server.listen(port, () =>{
  console.log('Server alive on ' + port);
});
