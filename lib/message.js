'use strict';

const client = require('./client.js');

const message = module.exports = {};

const commands = [ '/nickname', '/quit', '/pm', '/list' ];

message.welcome = (id) => {

  console.log('Connected!');

  let welcomeMsg =

    [`\n******** WELCOME TO DA FABULOUS CHAT ROOM ********\n`,
      `**                                              **\n`,
      `**              User Guide                      **\n`,
      `**                                              **\n`,
      `**   Set name:  Type /nickname <new-name>       **\n`,
      `**   View current users: Type /list             **\n`,
      `**   Send PM: Type /pm <to-username> <text>     **\n`,
      `**   Quit: Type /quit                           **\n`,
      `**                                              **\n`,
      `**************************************************\n\n`,
      `Hello User${id}>  `];

  return welcomeMsg;
};

message.isCommand = (msg) => {

  let text = msg.toString().trim().split(' ').splice(0, 1).join(' ');
  return (commands.indexOf(text.toLowerCase()) !== -1) ? true : false;

};

message.processCmd = (buffer, socket) => {

  let text = buffer.toString().trim().split(' ').splice(0, 1).join(' ');

  if(text.toLowerCase().startsWith('/nickname')) {

    let name = buffer.toString().trim().split(' ').slice(1).join(' ');
    if(name === '') return `Please enter /nickname <new-name>\n`;
    let id = client.setName(name, socket);
    return `Hi ${client.users[id].username}!\n`;

  }

  if(text.toLowerCase().startsWith('/quit')) {

    let user = client.removeUser(socket);
    return [`${user} has left the chat\n`, 'remove'];

  }

  if(text.toLowerCase().startsWith('/list')) {

    let users = client.getUserList();
    let list = users.join(', ');
    return(`Users currently in the chatroom:\n${list}\n`);

  }

  if(text.toLowerCase().startsWith('/pm')) {

    let temp = buffer.toString().trim().split(' ');
    let recip = temp[1];
    let msg = buffer.toString().trim().split(' ').slice(2).join(' ');
    if((msg === '') || (recip === '')) { return `Please enter: /pm <to-username> <text>\n`; }
    let receiver = client.getPMUser(socket, recip);
    if(receiver === 'self') return `You cannot send a pm to yourself.\n`;
    return receiver === undefined ? `Sorry, can't find that user!\n` : [`You said to ${receiver.username}: ${msg}\n`, `${socket.username} says: ${msg}\n`, receiver];

  }
};

message.processMsg = (buffer, socket) => {

  let text = buffer.toString().trim();
  return [`${socket.username} says: ${text}\n`, `You said: ${text}\n`, `Sorry, it looks like this chatroom is currently empty...\n `];

};
