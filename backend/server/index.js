const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');
const Rooms = require("./Utils/Rooms");
const io = require('socket.io')(server, { origins: '*:*'});

// instantiate a new rooms object to store all clients in the room
const rooms = new Rooms();

// io.origins(["http://localhost:3000"]);
app.use(cors());

io.on("connection", (socket) => {
  let roomId = 0;
  let userName = "";
  let userId = 1;

  //joining in a room
  socket.on("joinroom", function ({ name, room }) {
    if (!name) return;

    roomId = room;
    userName = name;
    userId = socket.id;

    socket.join(room);
    const oldUser = rooms.getUser(roomId);
    rooms.addUserToRoom(socket.id, name, room);
    const users = rooms.getAllUsers(room);

    // send all the users to only the new User who joined and id of the current user
    socket.emit("addusers", { id: socket.id, users });
    // inform everyone (excluding the new User) , that a user has been added
    // also send the id of an already existing user to the client so only that one
    // will emit the code to update for the new user
    socket.broadcast
      .to(roomId)
      .emit("userjoined", { newUser: { [socket.id]: name }, oldUser });
  });

  socket.on("message", (message) => {
    // Send the code in text editor to all the sockets
    socket.to(roomId).emit("message", message);
  });

  socket.on("chatmessage", (data) => {
    // send the chat message to all the users
    socket.to(roomId).emit("chatmessage", data);
  });

  socket.on("disconnect", function () {
    if (!userName) return;

    const returnId = rooms.deleteUser(roomId, socket.id);
    if (returnId)
      socket.broadcast
        .to(roomId)
        .emit("userleft", { id: returnId, name: userName });
  });
});

app.get("/", (req, res) => {
  res.send({ response: "Server is up and Running." }).status(200);
});

server.listen(process.env.PORT || 4000, function () {
  console.log("server is working");
});
