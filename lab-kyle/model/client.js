'use strict';

const uuidv4 = require('uuid/v4');

module.exports = function(socket){
  this.socket = socket;
  this.nickname = `User_${Math.random() * 10000}`;
  this._id = uuidv4();
};
