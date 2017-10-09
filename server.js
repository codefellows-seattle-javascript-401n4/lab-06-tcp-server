'use strict';

const net = require('net');
const client = require('./lib/client.js');
const message = require('./lib/message.js');
const server = net.createServer();
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

server.on('connection', (socket) => {

  let newUser = client.addUser(socket);
  let welcome = message.welcome(newUser);
  welcome.forEach((line) => { socket.write(line); });

  socket.on('data', (buffer) => {

    if(message.isCommand(buffer)) {
      let data = message.processCmd(buffer, socket);
      confirm(data, socket);
    } else {
      let msgData = message.processMsg(buffer, socket);
      send(msgData, socket);
    }
  });
});

let confirm = (data, socket) => {

  if(data[1] === 'remove'){
    socket.write(`Goodbye!\n`);
    socket.end();
    writeToAll(data[0]);
  } else if(typeof data[2] === 'object') {
    let recip = data[2];
    socket.write(data[0]);
    recip.write(data[1]);
  } else {
    socket.write(data);
  }
};

let writeToAll = (text, self) => {

  for(let key in client.users) {
    if (client.users.hasOwnProperty(key) && key !== 'length' && client.users[key] !== self) {
      client.users[key].write(text);
    }
  }
};

let send = (data, socket) => {

  if(client.users.length <= 1) socket.write(data[2]);
  else {
    socket.write(data[1]);
    writeToAll(data[0], socket);

  }
};
