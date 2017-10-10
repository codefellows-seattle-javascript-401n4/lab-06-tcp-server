'use strict';

const net = require('net');
const server = net.createServer();
const port = 3000;
const chat = require('./lib/chat.js');

let clientPool = [];

function User(socket){
  this.id;
  this.name;
  this.socket = socket;
}

server.on('connection', (socket) => {

  let user = new User(socket);

  clientPool.push(user);
  user.id = `User ${(clientPool.indexOf(user))}`;
  user.name = user.id;
  console.log(`${user.name} has connected.`);

  socket.write('Welcome to my chat room!' + `\r\n`);

  socket.on('data', (buffer) => {

    let text = buffer.toString();
    let command;

    if(text.startsWith('/')){
      command = chat.command(text);
      chat[command](user, text, clientPool);
    }

    if(!text.startsWith('/')){
      chat.talk(user, text, clientPool);
    }

  });

});

server.listen(port, () => {
  console.log('Server up on port: ', port);
});
