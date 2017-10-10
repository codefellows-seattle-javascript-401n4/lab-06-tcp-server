const quit = module.exports = {};
quit.end = function(socket) {
  let socketPool = [socket];
  socket.on('end', function () {
    socketPool.splice(socketPool.indexOf(socket), 1);
    socket.end(socket.nickname +  ' left the chat.\n');
  });
};