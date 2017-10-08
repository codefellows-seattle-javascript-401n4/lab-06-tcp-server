'use strict';

const net = require('net');
const server = net.createServer();
const Client = require('./lib/simpleServer.js');
const quit = require('./lib/tcpEnd.js');

let clientPool = [];

server.on('connection', (socket) => {
  let client = new Client(socket);

  clientPool.push(client);
  socket.on('data', (buffer) => {
    let data = buffer.toString();
    if(data.startsWith('/quit')){
      socket.end();
      quit.end(socket, console.log);
    }else if(data.startsWith('/nickname')){
      socket.nickname = data.trim().split(' ').slice(1).join(' ') + ': ' || socket.nickname;
    }else if(data.startsWith('/list')){
      clientPool.forEach(function(client){
        console.log(client.nickname);
        socket.write(client.nickname);
      });

    }else if(data.startsWith('/dm')){

      let message = data.split(' ');
      let username = message[1];
      message.shift();
      message.shift();
      message = message.join(' ');
      clientPool = clientPool.filter( (value) => value.nickname !== username);
      console.log(clientPool);
      clientPool[1].socket.write(message);
    }
    else{
      clientPool.forEach(function(client){
        client.socket.write(socket.nickname + data);
      });
    }
  });
  socket.on('error', (err) => {
    console.log(err);
  });
});
server.listen(3000, () => {
  console.log('Alive on port', 3000);
});
