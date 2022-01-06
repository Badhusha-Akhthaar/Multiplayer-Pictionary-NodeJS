const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const path = require("path");
const port = process.env.PORT || 3000;
let app = new express();
app.use(express.static(path.join(__dirname, "app")));
let server = http.createServer(app);
let io = socketIO(server);

let _allRooms = [];

io.on("connection", (socket) => {
  console.log("++Incoming connection");

  socket.on("joinroom", async (roomID, username, callback) => {
    socket.join(roomID);
    if (_allRooms[roomID].users.includes(username)) {
      callback(true);
    } else {
      console.log(`Socket ${socket.id} joined`);
      _allRooms[roomID].users.push(username);
      _allRooms[roomID].sockets.push({"username":username,"socketid":socket.id});
      socket.to(roomID).emit("notify-others", username);
    }
  });
  socket.on("init-vectors", (roomID, callback) => {
    if(_allRooms != null || _allRooms != undefined || _allRooms[roomID] != null || _allRooms[roomID] != undefined ){
      callback(_allRooms[roomID].vectors);
    }
    
  });
  socket.on("createroom", async (roomID, username) => {
    if (_allRooms[roomID] != undefined || _allRooms[roomID] != null) {
      socket.emit("existingroom");
    } else {
      socket.join(roomID);
      _allRooms[roomID] = { roomid: roomID, users: [username], vectors: [], sockets: [{username: username,socketid: socket.id}] };
    }
  });

  socket.on("drawing-event", (roomID, paths) => {
    _allRooms[roomID].vectors.push(paths);
    socket.to(roomID).emit("path-received", paths);
  });

  
  socket.on("disconnect", () => {
      for(room in _allRooms){
          for(_socket in _allRooms[room].sockets){
              if(_allRooms[room].sockets[_socket].socketid === socket.id){
                  console.log(`Socket ${socket.id} left the room ${room}`);
                  socket.to(room).emit("left-room",_allRooms[room].sockets[_socket].username);
              }
          }
      }
  });
});

app.get("/game", (req, res) => {
  res.sendFile("game.html", { root: path.join(__dirname, "app") });
});
server.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
