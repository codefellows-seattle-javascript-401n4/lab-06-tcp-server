'use strict';

let clientPool = require('./clientPool');

let connect = module.exports = function(socket){
  welcomeUser(socket);
};

let welcomeUser = (socket) => {
  socket.user = `user${Math.random()}`;
  clientPool = [...clientPool, socket.user];
  console.log(`${socket.user} connected`);
  console.log(clientPool);
  socket.write(`Hello ${socket.user}! Welcome to goozchat! \n`);
  socket.write('To select your own username type " /w " followed by a space and then your desired username');
};

