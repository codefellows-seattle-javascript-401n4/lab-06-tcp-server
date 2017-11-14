'use strict';

module.exports = function Client(socket, handle) {
  this.socket = socket;
  this.handle = handle || `n00b:${Math.floor(Math.random() * 10000 + 420)}`;
};
