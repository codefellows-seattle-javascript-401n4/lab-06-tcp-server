'use strict';



const net = require ('net');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
const message = require ('./lib/message.js');


let clientPool = [];



function User (socket) {
  this.id;
  this.name;
  this.socket = socket;
}


server.on ('connected', (socket) => {
  let user = new User (socket);

  clientPool.push (user);
  user.id = 'user ${(clientPool.indexOf (user))}';
  user.name = user.id;
  console.log ('${user.name} has connected');


  socket.write ('welcome to chat' + '\r\n');


  socket.on ('data', (buffer) => {
    let text = buffer.toString ();
    let command;

    if (text.startsWith ('/')) {
      command = message.command (text);
      message.command (user, text, clientPool);
    }

    if (! text.startsWith ('/')) {
      message.talk (user, text, clientPool);
    }
  });
});



server.listen (PORT, () => {
  console.log ('server is on port', PORT);
});
