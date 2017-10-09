'use strict';

const net = require('net');
const port = process.env.port || 3000;
const server = net.createServer();
let clientPool = [];
server.on('connection' , (socket) => {
  socket.userName = `User ${Math.floor(Math.random() * 100)}`;
  clientPool = [...clientPool, socket];
  console.log(socket.userName + ' socket connected');
  if(clientPool.length == 1){
    console.log(clientPool.length + ' user in chatroom');
  }else{
    console.log(clientPool.length + ' users in chatroom');
  }
  socket.on('data', (buffer) => {
    let text = buffer.toString();

    if (text.startsWith('/nickname')){
      socket.userName = text.trim().split(' ').slice(1).join(' ');
    }

    else if (text.startsWith('/quit')){
      clientPool.splice(clientPool.indexOf(socket), 1);
      socket.end(socket.userName + ' has ended the chat');
      console.log(clientPool.length + ' user(s) in chatroom');

    }
    else if(text.startsWith('/dm ' + socket.userName)){
      console.log('wow');
    }

    console.log(socket.userName, ':', text);
    clientPool.forEach(function(connection){
      connection.write(socket.userName + ':' + text);
    });
  });


});
server.listen(port, () => {
  console.log('Alive on port', port);
});
