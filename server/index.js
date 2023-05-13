const express = require("express");
const socket = require("socket.io");

// App setup
const PORT = 8080;
const app = express();

// sample route
app.get("/user", (req, res) => {
    res.send("<h1>Hello World</h1>");
})

function hasUniqueDigits(number) {
  let digits = new Set(number.toString().split('')); // Convert number to string and store its digits in a Set
  return digits.size === 3; // A number has unique digits if its Set has size 3
}

function getRandomNumber(socketid){
  let number;
  do {
    number = Math.floor(Math.random() * 900) + 100; // Generate a random 3-digit number
  } while (!hasUniqueDigits(number)); // Keep generating numbers until one with unique digits is found
  dict[socketid] = number;
}

var dict = {};

const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});

// Socket setup
const io = socket(server, { 
  cors: { origin: "*" },
});

io.on("connection", function (socket) {
  console.log("a new user is connected, userid: ", socket.id);
  getRandomNumber(socket.id);
  console.log(socket.id, " : " , dict[socket.id]);

  socket.on("message", (message) => {
    console.log(message);
    io.emit("message-server", `${socket.id.substr(0, 2)} said ${message}`);
    if (parseInt(message) === dict[socket.id]) {
      io.emit("message-server", `${socket.id.substr(0, 2)} won!`);
      
      io.close(() => {
        console.log("Socket.io server closed");
      });
      server.close(() => {
        console.log("Server closed");
      });
    }
  });

  // socket.on("header-test", (message) => {
  //   const TEST_HEADER = socket.handshake.headers["x-test-header"];
  //   console.log("TEST_HEADER: ", TEST_HEADER); // This is the header value
  //   console.log(message); // bla
  // });
});



// ------------------------------------------------------------------------------
// REGULAR HTTP SERVER

// const http = require('http').createServer();

// const io = require('socket.io')(http, {
//     cors: { origin: "*" }
// });

// io.on('connection', (socket) => {
//     console.log('a user connected');

//     socket.on('message', (message) =>     {
//         console.log(message);
//         io.emit('message', `${socket.id.substr(0,2)} said ${message}` );
//     });
// });

// http.listen(8080, () => console.log('listening on http://localhost:8080') );



// --------------------------------------------------------------------------------
// REGULAR WEBSOCKET

// const WebSocket = require('ws')
// const server = new WebSocket.Server({ port: '8080' })

// server.on('connection', socket => {

//   socket.on('message', message => {

//     socket.send(`Roger that! ${message}`);

//   });

// });
