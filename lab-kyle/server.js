'use strict';

const net = require('net');
const EE = require('events').EventEmitter;
const ee = new EE();
const Client = require('./model/client');
const cmdParser = require('./lib/command-parser');
const PORT = process.env.PORT || 3000;

//export for testing gotta get that bonus point
const server = module.exports = net.createServer();

let clientPool = [];

ee.on('default', (client, string) => client.socket.write(`Not a command: ${string.trim().split(' ', 1)}\n`));
ee.on('@all', (client, string) => clientPool.forEach((c) => c.socket.write(`${client.nickname}: s${string.trim().split(' ').slice(1).join(' ')}\n`)));
ee.on('@nickname', (client, string) => {
  clientPool.filter((c) => c === client)[0].nickname = string;
  client.socket.write(`nickname changed to: ${string}\n`);
});
ee.on('@dm', (client, string) => {
  let targetPerson = string.trim().split(' ', 2)[1];
  let targetClient = clientPool.filter((c) => c.nickname === targetPerson)[0];

  targetClient.socket.write(`${client.nickname}: ${string.trim().split(' ').slice(1).join()}\n`);
  client.socket.write(`@dm to ${targetClient.nickname}: ${string.trim().split(' ').slice(1).join()}\n`);
});
ee.on('@exit', (client) => {
  clientPool.forEach((c) => c.socket.write(`${client.nickname} has left the building\n`));
  client.socket.emit('close', client);
});

server.on('connection', (socket) => {
  let client = new Client();

  clientPool.push(client);
  clientPool.forEach((c) => c.socket.write(`${client.nickname} is now present\n`));

  socket.on('data', (data) => cmdParser(client, data, ee));

  socket.on('close', () => {
    let index = clientPool.indexOf(client);
    client.socket.end();
    delete clientPool[index];
  });

});

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
