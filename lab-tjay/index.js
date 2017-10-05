'use strict';

const net = require('net');
const server = net.createServer();
const Client = require('./lib/client.js');
const command = require('./lib/commands.js');

let clientPool = [];

server.on('connection', (socket) => {
  console.log('server connected!');
  socket.write('Hello, welcome to Rocket Chat - where we bring you the most horrible things on the internet, at Rocket Speeds!');

  let user = new Client(socket);

  console.log(`${user.nickname} has joined the chat.`);



  clientPool = [...clientPool, socket];



  socket.on('data', (buffer) => {
    let data = buffer.toString();
    if(data.startsWith('/nickname')){
      socket.nickname = data.split('/nickname')[1] || socket.nickname;
      socket.write(`you are now known as ${socket.nickname}`);
      return;
    }
  });

});

server.listen(3000, () => {
  console.log('Server up on port 3000!');
})
