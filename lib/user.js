'use strict';

module.exports = Users;


function Users (u, s) {
  this.socket = s;
  this.id = u;
  this.nickname = u;
  this.sendMessage = (epoch, buffer) => {
    this.socket.write(`${epoch}: ${buffer}\n`);
  };

  this.setNickname = (buffer) => {
    this.nickname = buffer;
  };
  this.closeSocket = () => {
    this.socket.end();
  };

}