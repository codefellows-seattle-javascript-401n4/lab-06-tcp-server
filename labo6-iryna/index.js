'use strict';

const net = require('net');
const port = 3000;
const server = net.createServer();
const User = require('./lib/user');
const command = require('./lib/handle-command.js');

let socketPool = [];

server.on('connection', (socket) => {

    socket.username = `${Math.round(Math.random()*100)}`;
    socket.write(`Hello ${socket.username}! Use\n "/list"to list all current users\n  "/nickname <newname>" to change name,\n "/dm@<username>" for direct messages,\n "/quit" to quit chat\n`) ;

    let newUser = new User(socket, socket.username);
    console.log(`user ${socket.username} has joined the chat`);

    socketPool = [...socketPool, newUser];

    socket.on("data", (buffer) => {
      socketPool = command(buffer, socket, socketPool);
      console.log(socketPool);
    });

    socket.on('error',(err)=>{
      console.log('error: ', err);
    });

    socket.on('close',()=>{
      socketPool = command('/quit', socket, socketPool);
      console.log(socketPool);
    });

});

server.listen(port, ()=>{
    console.log("Alive on port", port);
});
