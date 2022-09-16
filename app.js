const express = require("express");
const socket  = require("socket.io");

const app = express();// initialize and server ready

// let port = 5000;
let port = process.env.PORT || 5000;

app.use(express.static("public"));

let server= app.listen(port,()=>{
    console.log("Listening to port "+port);
})

let io = socket(server);
io.on("connection",(socket)=>{
    console.log("made socket connections");

    //recieved data from front end
    socket.on("beginPath",(data)=>{
     //tranfer data to all connected computers

     io.sockets.emit("beginPath",data);
    })

    socket.on("drawStroke",(data)=>{
     //tranfer data to all connected computers

     io.sockets.emit("drawStroke",data);
    })

    socket.on("redoUndo",(data)=>{
     //tranfer data to all connected computers

     io.sockets.emit("redoUndo",data);
    })

    socket.on("clear",(data)=>{
     //tranfer data to all connected computers

     io.sockets.emit("clear",data);
    })
    
});