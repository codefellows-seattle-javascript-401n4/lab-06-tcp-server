'use strict';

const net = require('net');
const server = net.createServer();
const client = require('./model/client.js')

function Client(socket){
  this.nickname = socket.nickname,

};

let clientPool = [];

server.on('connection', (socket) => {
  console.log('server connected!');
  socket.write('Hello socket, welcome to slugchat');
  socket.nickname = `user_${Math.random()}`;
  console.log(`${socket.nickname} connected!`);

  clientPool = [...clientPool, socket];

  let handleDisconnect = () => {
    console.log(`${socket.nickname} has left the chat`);
    clientPool = clientPool.filter(item => item !== socket);
  };

  socket.onError('error', handleDisconnect);
  socket.onError('close', handleDisconnect);

  socket.on('data', (buffer) => {
    let data = buffer.toString();
    if(data.startsWith('/nickname')){
      socket.nickname = data.split('/nickname')[1] || socket.nickname;
      socket.write(`you are now known as ${socket.nickname}`);
      return;
    }

    if(data.startsWith('/dm')){
      let content = data.split('/dm')[1] || ''
    }

    clientPool.forEach(socket => {
      socket.write(buffer.toString());
    });
  });
});

server.listen(3000, () => {
  console.log('Server up on port 3000!');
});
