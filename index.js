'use strict';

const net = require('net');
const server = net.createServer();

const connect = require('./lib/connect.js');
let clientPool = require('./lib/clientPool.js');


server.on('connection', socket => connect(socket));

server.listen(3000, () => console.log('server up!'));



