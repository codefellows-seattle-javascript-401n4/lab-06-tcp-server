'use strict';

let clientPool = require('./clientPool.js');

let user = module.exports = {};

user.connect = (socket) => {
  welcomeUser(socket);
};

user.data = (buffer, socket) => {
  let data = buffer.toString();

  if(data.startsWith('/alias')) {
    changeAlias(data, socket);
  }
  else if(data.startsWith('/whisper')) {
    whisper(data, socket);
  }
  else if(data.startsWith('/list')) {
    listUsers(data, socket);
  }
  else {
    sendMessage(data,socket);    
  }

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
  socket.write('Use /whisper for direct messages\n');
};


// methods for each data receiving scenario 
let sendMessage = (data, socket) => {
  clientPool.forEach( (user) => {
    user.write(`${socket.alias}: ${data}`);
  });
  console.log(`${socket.alias}: ${data.trim()}`);  
};

let changeAlias = (data, socket) => {
  socket.alias = data.split(' ')[1].trim() || socket.alias;
  socket.write(`You're new username is: ${socket.alias}\n`);
  return;
};

let whisper = (data, socket) => {
  let target = data.split(' ')[1].trim();
  let message = data.split(' ').slice(2).join(' ');
  clientPool.forEach( (client) => {
    if(client.alias === target){
      client.write(`${socket.alias} whispers: ${message}`);
    }
  });
  return;
};

let listUsers = (data, socket) => {
  socket.write('Current Users in Chatroom:\n');
  clientPool.forEach( (client) => {
    socket.write(`${client.alias}\n`);
  });
};
