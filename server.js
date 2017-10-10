'use strict';

const net = require('net');
const PORT = process.env.PORT || 3000;
const server = net.createServer();
// const quit = require('./lib/quit.js');
// const Socket = require('./lib/socketPool.js');
let socketPool = [];


server.on('connection', (socket) => {
  
  // Increments with client
  // let client = new Socket(socket);
  // socketPool.push(socket);
  // Id client
  socket.nickname = `client: ${Math.floor(Math.random() * 5000)}`;

  // send message to client and other users
  socket.write('Welcome to the Hawks telnet Chat.');

  console.log(`${socket.nickname} connected!`);

  socketPool = [...socketPool, socket];



  // Use /nickname <newNickname> to change client name

  socket.on('data', (buffer) => {
    let data = buffer.toString();
    if (data.startsWith('/nickname')){
      socket.nickname = data.trim().split('/nickname ').slice(1).join(' ') || socket.nickname;
      socket.write(`Your name has changed to ${socket.nickname}`);
      return;
    }
   
    // quit

    if (data.startsWith('/quit')) {
      socketPool.splice(socketPool.indexOf(socket), 1);
      socket.end(socket.nickname + ' left the chat.\n');
      if (socketPool.length === 0) {
        console.log('Everyone left the chat');
        socketPool.end();
        return;
      }
      console.log(`${socket.nickname} left the chat`);
      console.log(socketPool.length);
    }


    // list
    if(data.startsWith('/list')) {
      socketPool.forEach((item) => {

        console.log(item.nickname);
        socket.write(item.nickname + '\n');
      });
    }

    // dm
    if(data.startsWith('/dm')) {
      let nickname = '';
      socketPool.forEach( c => {
        if (c.nickname === nickname) {
          socket.write(`${socket.nickname}: ${data}`);
        }else {
          socket.write('There is no user by that nickname.\n');
        }
      });
    }
    
    socketPool.forEach((item) => {
      if(socket.nickname === item) return;
      item.write(`${socket.nickname}: ${data}`);
    });


  });

  socket.on('error', function (error) {
    console.log(`There is an error in the Chat World ${error.message}`); 
  });
});

server.listen(PORT, () => {
  console.log('Up and running on port', PORT);
});

