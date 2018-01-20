'use strict';

const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const Client = require('./model/client');
const PORT = process.env.PORT || 3000;

//export for testing
const server = module.exports = net.createServer();

let clientPool = [];

ee.on('default', (client, string) => {
  return client.socket.write(`Not a command: ${string.trim().split(' ', 1)}\n`);
});

server.on('connection', (socket) => {
  let client = new Client();

  clientPool.push(client);
  clientPool.forEach((c) => {
    return c.socket.write(`${client.nickname} is now present\n`);
  });

  socket.on('data', (data) => {
    let cmd = data.toString().split(' ').shift().trim();
    console.log(cmd);

    if(cmd === '@all'){
      clientPool.forEach((c) => {
        return c.socket.write(data.toString());
      });
    } else {
      ee.emit('default', client, data.toString().split(' ').slice(1).join());
    }
  });
});
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
