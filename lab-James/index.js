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

  socket.write('Welcome to my chat room!' + `\r\n`);

  socket.on('data', (buffer) => {

    let text = buffer.toString();

    if(text.startsWith('/name')){
      user.name = text.trim().split(" ").slice(1).join(" ");
      console.log(`${user.id} has changed name to ${user.name}`);
      user.socket.write(`Name successfuly changed to ${user.name}\r\n`);
    };

    if(text.startsWith('/dm')){
      let recipient = text.trim().split(" ").slice(1, 2).join(" ");
      let directMessage = text.trim().split(" ").slice(2).join(" ");
      let target;

      clientPool.forEach(client => {
        if(client.name === recipient){
          target = client.socket;
          console.log(`DM from ${user.name} to ${recipient}`);
          target.write(user.name + `: ${directMessage}\r\n`);
        }

      });

      if(target === undefined){
        socket.write(`User not found.\r\n`);
      }
    }

    if(text.startsWith('/quit')){
      let index = clientPool.indexOf(user);
      clientPool.splice(index, 1);

      clientPool.forEach(client => {
        client.socket.write(user.name + ` has disconnected.\r\n`);
      });

      console.log(user.name + ' has disconnected.')
      socket.end();
    }

    if(text.startsWith('/list')){
      console.log(`${user.name} listed all current users.`);
      clientPool.forEach(client => {
        socket.write(`${client.name}\r\n`);
      });
    }

    if(!text.startsWith('/')){
      console.log(user.name + `: ${text}`);
      clientPool.forEach(client => {
        client.socket.write(`${user.name}: ${text}\r\n`);
      });
    }

  });

});

server.listen(port, () => {
  console.log("Server up on port: ", port);
});
