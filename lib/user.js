'use strict';

// const socket = module.exports = exports = {};

module.exports = Users;

// const chatroom = require('../lib/chatroom.js');
// const socketPool = [];

function Users (u, s) {
  this.socket = s;
  this.username = u;
  this.nickname = u;
  this.sendMessage = (buffer) => {
    this.socket.write(buffer);
  };
    //changes nickname, return "close connection", return array of username and message for the user

  this.nickname = (buffer) => {
    this.nickname = nickname
    console.log(nickname);
  };
  this.closeSocket = () => {
    this.socket.end();
  };
  // /quit
  // if ( text.startsWith("/quit")) {
  // }

}


// Users.prototype.sendMessage = function(message) {
//   // this.socket.write(message.toString());
//   console.log(this);
// };
//
// Users.prototype.nickname = (newNickname) => {
//   this.nickname = newNickname;
// }
