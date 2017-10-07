'use strict';

let clientPool = require('./clientPool.js');
let connectModule = require('./connect.js');
let dataModule = require('./data.js');

let user = module.exports = {};

user.connect = (socket) => {
  welcomeUser(socket);
};

user.data = (buffer, socket) => {
  let data = buffer.toString();
  let command = data.split(' ')[0];

  sendMessage(data,socket);

};


// user connecting methods
let welcomeUser = (socket) => {
  createUser(socket);
  welcomeMessage(socket);
};

let createUser = (socket) =>{
  socket.alias = `user${Math.random()}`;
  clientPool = [...clientPool, socket];
  console.log(`${socket.alias} connected`);
};

let welcomeMessage = (socket) => {
  socket.write(`Hello ${socket.alias}! Welcome to goozchat! \n`);
  socket.write('To create a custom username type " /alias " followed by a space and then your desired username \n');
  socket.write('Use /w or /whisper for direct messages\n');
};


// methods for each data receiving scenario 
let sendMessage = (data, socket) => {
  clientPool.forEach( (user) => {
    user.write(`${socket.alias}: ${data}`);
  });
  console.log(clientPool);
  console.log(`${socket.alias}: ${data.trim()}`);  
};

let changeAlias = (data, socket) => {
  socket.alias = data.split(' ')[1];
  socket.write(`You're new username is: ${socket.alias}\n`);
  return;
};

let whisper = (data, socket) => {
  // socket.target = data.split(' ')[1];
  let clientAlias = clientPool.map(client => client.alias);
  console.log(clientAlias);
  return;
};

