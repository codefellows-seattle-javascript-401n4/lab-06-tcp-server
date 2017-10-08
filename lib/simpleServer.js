'use strict';

const Client = module.exports = function(socket){
  this.id = `id: ${Math.floor(Math.random() *3000)}`;
  this.socket = socket;
  this.nickname = `user: ${Math.floor(Math.random() * 3000)} `;
};
