'use strict';
const session = require('../lib/session.js');

/*
User Module handels all connections.
Assumes one connection per IP address
If a user signs out they are disconnected but still stored in membory.
*/

function User(opts){
  this.id = opts.id;
  this.username = opts.username;
  this.socket = opts.socket;
  this.connected = true;
  this.lastLoggedOn = Date.now();
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
      \n\x1b[36mWelcome to the new technology of live chat!\x1b[0m Just type something to start chatting to everyone here!\n
      To change your name type /nickname [newname].\n
      To see other people here type /listUsers.\n
      To learn other commands you can do type /listCommands.\n`);
  }
  let newSession = new session({socket: this.socket, username: this.username});
  newSession.begin();
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
  let thisSession = session.getSessionByUsername(this.username);
  thisSession.end();
};

module.exports = User;
