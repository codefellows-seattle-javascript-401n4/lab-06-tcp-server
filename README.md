_server.js_

*confirm()* Takes in data strings (styled chat responses) plus an optional socket object, in case of a PM

*writeToAll()* Takes in a data string and optional socket object (if needed to weed out current user for response)

*send()* Takes in two data strings and socket object. One data string is in case user is the only one in chat room.

_message.js_

*isCommand()* Takes in a user input (string), and returns a boolean (true if text is command)

*processCmd()* Take in a buffer and socket, and performs action based on one of four possible commands. Return strings and in one case returns an object (for a PM).

*processMsg()* Takes in a buffer and socket and returns two strings.


_client.js_

*client.setName()* Takes in nickname for user, and sets in the client.users[id].username property. If no name is set, name defaults to UserN where N is the next user number added to system. Returns user index (int)

*client.addUser()* Take in a socket obj, increments length and assigns default username. Returns id (int)

*client.getPMUser()* Takes in two sockets, a sender and recipient's username, looks up username in users obj and returns recipient's socket.

*client.removeUser()* Takes in a socket, deletes it from the Users obj, and returns a username (string)

*client.getUserList()* Takes in a socket, and return an array of usernames (string)

*getID()* Takes in a socket value, uses Object method to return corresponding id (key) (int).
