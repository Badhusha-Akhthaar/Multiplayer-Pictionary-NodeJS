const express = require("express");
const socketIO = require("socket.io");
const http = require("http");
const path = require('path')
const port = process.env.PORT || 3000;
let app = new express();
app.use(express.static(path.join(__dirname,'app')))
let server = http.createServer(app);
let io = socketIO(server);

let _allRooms = [];

io.on('connection',(socket)=>{
    console.log("++Incoming connection");

    socket.on("joinroom",async (roomID,username) => {
        socket.join(roomID);
        console.log(`Socket ${socket.id} joined in room ${roomID}`)
        _allRooms[roomID].users.push(username);
    });
    socket.on("init-vectors",(roomID,callback)=>{
        callback(_allRooms[roomID].vectors);
    })
    socket.on("createroom",async (roomID,username) => {
        if(_allRooms[roomID] != undefined || _allRooms[roomID] != null ){
            socket.emit("existingroom");
        }
        else {
            socket.join(roomID);
            _allRooms[roomID] = {"roomid":roomID,"users":[username],"vectors":[]};
        }
        
    });

    socket.on("drawing-event",(roomID,paths)=>{
        _allRooms[roomID].vectors.push(paths);
        socket.to(roomID).emit("path-received",paths);
    })
});

app.get("/game",(req,res)=>{
    res.sendFile('game.html', { root: path.join(__dirname, 'app') })
})
server.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`);
});