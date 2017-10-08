'use strict';
const _ = require('lodash');

const quit = module.exports = {};
quit.end = function(socket,cb){
  let clientPool = [socket];
  socket.on('end', function(socket){
    let plug = _.findIndex(clientPool,function(o){return o.clientPool == socket;});
    clientPool = clientPool.filter((value, index) => index === plug);
    cb(clientPool.length);
  });
};
