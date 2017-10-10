const Socket = module.exports = function (id, nickname, socket) {
  this.id = `client: ${Math.floor(Math.random() * 5000)}`;
  this.nickname = nickname;
  this.socket = socket;
};