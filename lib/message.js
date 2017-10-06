'use strict';

const session = require('../lib/session.js');
const user = require('../lib/user.js');
const commands = ['/quit', '/listCommands', '/listUsers', '/nickname'];

function Message(text, socket, username){
  this.fulltext = text;
  this.socket = socket;
  this.username = username;
  this.type = 'broadcast';
  if (text.startsWith('/')) {
    this.action = text.split(' ')[0].trim();
    this.toDo = text.split(' ').slice(1).join(' ').trim();
    this.type = 'action';
  }
  if (text.startsWith('@')) {
    this.toPerson = text.split(' ')[0].replace(/@/g, '').trim();
    this.directMessage = text.split(' ').slice(1).join(' ').trim();
    this.type = 'dm';
  }
}

function messageFormat(name, message) {
  return `\x1b[36m${name}\x1b[0m \x1b[2m(${new Date().toLocaleTimeString()})\x1b[0m: ${message}`;
}

Message.prototype.actionHandler = function(action, toDo){
  let thisUser = user.allUsers[this.username];
  if (!thisUser) {
    this.socket.write(`sorry, ${this.username} you don't seem to be a user, it's probably our fault`);
    return;
  }
  switch (action) {
  case '/quit':
    thisUser.signOff();
    break;
  case '/listUsers':
    thisUser.listUsers();
    break;
  case '/listCommands':
    commands.forEach(command => {
      this.socket.write(`${command}\n`);
    });
    break;
  case '/nickname':
    thisUser.changeUserName(toDo);
    break;
  default:
    this.socket.write(`sorry, ${action} is not one of our commands, for a full list of commands type /listCommands`);
  }
};

Message.prototype.sendDirectMessage = function() {
  let target = user.allUsers[this.toPerson];
  if (target) {
    target.socket.write(messageFormat(this.username, this.directMessage));
  } else {
    this.socket.write(`${this.toPerson} is not here right now, try /listUsers to see everyone in the chat`);
  }
};

Message.prototype.typeHandler = function(){
  let message = this;
  switch (message.type) {
  case 'action':
    this.actionHandler(this.action, this.toDo);
    break;
  case 'dm':
    message.sendDirectMessage();
    break;
  default:
    message.sendAll();
  }
};

Message.prototype.sendAll = function() {
  //broadcast
  let message = this;
  session.socketPool.forEach(function(sessionObj){
    if (sessionObj.username === message.username) {
      sessionObj.socket.write(messageFormat('You', message.fulltext));
    } else {
      sessionObj.socket.write(messageFormat(message.username, message.fulltext));
    }
  });
};

module.exports = Message;
