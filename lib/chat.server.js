'use strict';

const chat = module.exports = {};

chat.command = function(text){
  let base = text.split(' ');
  let command = base[0].split('/')[1];
  console.log(command);
  console.log(text + 1);
  return command;
};



chat.name = function(user, text){

  user.name = text.trim().split(' ').slice(1).join(' ');
  console.log(`${user.id} has changed name to ${user.name}`);
  user.socket.write(`Name successfuly changed to ${user.name}\r\n`);

};



chat.dm = function(user, text, clientPool){
  let recipient = text.trim().split(' ').slice(1, 2).join(' ');
  let directMessage = text.trim().split(' ').slice(2).join(' ');
  let target;

  clientPool.forEach(client => {
    if(client.name === recipient){
      target = client.socket;
      console.log(`DM from ${user.name} to ${recipient}`);
      target.write(user.name + `: ${directMessage}\r\n`);
    }
  });

  if(target === undefined){
    user.write(`User not found.\r\n`);
  }
};



chat.list = function(user, text, clientPool){
  console.log(text + 2);
  console.log(`${user.name} listed all current users.`);
  clientPool.forEach(client => {
    user.socket.write(`${client.name}\r\n`);
  });
};



chat.quit = function(user, text, clientPool){
  let index = clientPool.indexOf(user);
  clientPool.splice(index, 1);

  clientPool.forEach(client => {
    client.socket.write(user.name + ` has been disconnected.\r\n`);
  });

  console.log(user.name + ' has been disconnected.');
  user.socket.end();
};



chat.talk = function(user, text, clientPool){
  console.log(user.name + `: ${text}`);
  clientPool.forEach(client => {
    client.socket.write(`${user.name}: ${text}\r\n`);
  });
};
