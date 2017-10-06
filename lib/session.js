'use strict';

function Session(opts){
  this.username = opts.username;
  this.socket = opts.socket;
}

Session.socketPool = new Set();

Session.prototype.begin = function() {
  Session.socketPool.add(this);
};

Session.getSessionByUsername = function(username){
  let thisSession;
  console.log(username);
  Session.socketPool.forEach((sess) => {
    if (sess.username === username) {
      thisSession =  sess;
    }
  });
  return thisSession;
};

Session.prototype.end = function() {
  Session.socketPool.delete(this);
  this.socket.end();
};

module.exports = Session;
