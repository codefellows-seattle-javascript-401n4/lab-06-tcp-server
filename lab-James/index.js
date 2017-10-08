'use strict';

const net = require('net');
const server = net.createServer();
const port = 3000;

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

  socket.write('Welcome to my chat room!');

  socket.on('data', (buffer) => {

    let text = buffer.toString();

    if(text.startsWith('/name')){
      user.name = text.trim().split(" ").slice(1).join(" ");
      user.socket.write(`Name successfuly changed to ${user.name}`);
    };

    if(text.startsWith('/dm')){
      let recipient = text.trim().split(" ").slice(1, 2).join(" ");
      let directMessage = text.trim().split(" ").slice(2).join(" ");
      let target;

      clientPool.forEach(user => {
        if(user.name === recipient){
          target = user.socket;
        }
      });

      target.write(user.name + `: ${directMessage}`);

    }

    if(!text.startsWith(('/'))){
      console.log(user.name + `: ${text}`);
      clientPool.forEach(socket => {
        socket.socket.write(user.name + `: ${text}`);
      });
    }

  });

});

server.listen(port, () => {
  console.log("Server up on port: ", port);
});
