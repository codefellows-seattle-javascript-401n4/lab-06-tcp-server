'use strict';
const session = require('../lib/session.js');

function User(opts){
  this.id = opts.id;
  this.username = opts.username;
  this.socket = opts.socket;
  this.connected = true;
}

User.allUsers = {};

User.prototype.listUsers = function(){
  let thisPerson = this;
  Object.keys(User.allUsers).forEach(username => {
    if (User.allUsers[username].connected) {
      thisPerson.socket.write(`${username}\n`);
    }
  });
};

User.prototype.getUserByIP = function(){
  let thisPerson = this;
  let returning = false;
  Object.keys(User.allUsers).forEach(username => {
    if (User.allUsers[username].id === thisPerson.id) {
      thisPerson.username = username;
      returning = true;
    }
  });
  return returning;
};

User.prototype.addUser = function(){
  let returning = this.getUserByIP();
  User.allUsers[this.username] = this;
  if (returning) {
    this.socket.write(`Welcome back ${this.username}\n`);
  } else {
    this.socket.write(`
      \n\x1b[36mWelcome to the new techology of live chat!\x1b[0m Just type something to start chatting to everyone here!\n
      To change your name type /nickname [newname].\n
      To see other people here type /listUsers.\n
      To learn other commands you can do type /listCommands.\n`);
  }
};

User.prototype.changeUserName = function(newUserName){
  delete User.allUsers[this.username];
  let thisSession = session.getSessionByUsername(this.username);
  thisSession.username = newUserName;
  this.username = newUserName;
  User.allUsers[this.username] = this;
};

User.prototype.signOff = function(){
  this.connected = false;
  console.log(User.allUsers[this.username].connected);
  let thisSession = session.getSessionByUsername(this.username);
  thisSession.end();
};

module.exports = User;
