'use strict';
module.exports = function(socket, nickname){
  this.socket = socket;
  this.nickname = nickname;
  this.id = Math.round(Math.random()*100);
  return this;
};
