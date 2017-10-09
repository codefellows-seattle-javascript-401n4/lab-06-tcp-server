'use strict';

let clientPool = require('./clientPool.js');

let user = module.exports = {};

user.connect = (socket) => {
  welcomeUser(socket);
};

user.data = (buffer, socket) => {
  let data = buffer.toString();

  if(data.startsWith('/alias') || data.startsWith('/a')) {
    changeAlias(data, socket);
  }
  else if(data.startsWith('/whisper') || data.startsWith('/w')) {
    whisper(data, socket);
  }
  else if(data.startsWith('/list') || data.startsWith('/l')) {
    listUsers(data, socket);
  }
  else if(data.startsWith('/quit') || data.startsWith('/q')) {
    quit(socket);
  }
  else if(data.startsWith('/help') || data.startsWith('/h')) {
    helpMessage(socket);
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
  socket.write(`\nHello ${socket.alias}! Welcome to goozchat! \n`);
  socket.write('To create a custom username type " /alias " followed by a space and then your desired username \n\n');
  socket.write('Type /help or /h to see all commands. Or start chatting away!\n');
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

let helpMessage = (socket) => {
  socket.write('\n---- The Following Commands Are Available To You ----\n');
  socket.write('/alias or /a - to change your username\n');
  socket.write('/whisper or /w - to send a direct message to an user\n');
  socket.write('/list /l - to list all the users currently in the chatroom\n');
  socket.write('/quit /q - to leave the chatroom\n');
  socket.write('/help /h - to see all command options\n\n');
};

let quit = (socket) => {
  console.log(`${socket.alias} has left.`);
  clientPool = clientPool.filter( (client) => socket !== client);
  socket.end();
};