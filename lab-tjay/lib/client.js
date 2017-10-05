'use strict';

module.exports = function Client(socket, nickname) {
  this.socket = socket;
  this.nickname = nickname || `guest${Math.floor(Math.random() * 1000)}`;
};
