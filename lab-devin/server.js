'use strict';

const net = require('net');
const server = net.createServer();
const Client = require('./lib/client.js');

let clientPool = [];

server.on('connection', (socket) => {

  let client = new Client(socket);
  socket.write(`${client.handle}, has joined the chat`);

  console.log(`${client.handle} connected`);

  clientPool = [...clientPool, client];

  let handleDisconnect = () => {

    clientPool.forEach(user => {
      user.socket.write(`${client.handle} has left the chat`);

    });

    clientPool = clientPool.filter(user => user !== client);
  };

  let errorHandler = (err) => {

    console.log('client errored out', err);

    clientPool = clientPool.filter(user => user !== client);
  };

  socket.on('close', handleDisconnect);
  socket.on('error', errorHandler);

  socket.on('data', (buffer) => {

    let data = buffer.toString().trim();

    if(data.startsWith('/handle')) {
      changeHandle(client, data);
      return;
    }
    if(data.startsWith('/dm')) {
      dm(client, data);
      return;
    }
    if(data.trim() === '/quit') {
      quit(client);
      return;
    }

  });
});


let changeHandle = (client, data) => {

  let curr = client.handle;

  client.handle = data.split('/handle')[1].trim() || client.handle;
  clientPool.forEach (user => {

    if(user.handle === client.handle)
      user = client;
    user.socket.write(`${curr} has changed name to ${client.handle}`);
  });
};

let quit = client => {

  let index = clientPool.indexOf(client);
  clientPool.splice(index, index + 1);
  client.socket.end();

};

let dm = (client, data) => {

  data = data.split(' ') || '';
  let target = data[1];
  let message = data.slice(2).join(' ');

  clientPool.forEach(user => {

    if(target === user.handle)
      user.socket.wrtite(`Direct message from ${client.handle}: ${message}`);
  });
};

server.listen(process.env.PORT || 3000, () => {
  console.log('server running on port 3000');
});
