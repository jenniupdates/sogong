const express = require("express");
const session = require("express-session");

const socket = require("socket.io");
const sharedSession = require("express-socket.io-session");

// // redis
// const redis = require("redis");
// const connectRedis = require("connect-redis");
// const RedisStore = connectRedis(session);

// // Configure session middleware with Redis store
// const redisClient = redis.createClient({
//   host: 'localhost',
//   port: 6379
// });

// // Establish connection with redis client
// redisClient.on('error', function (err) {
//   console.log('Could not establish a connection with redis. ' + err);
// });
// redisClient.on('connect', function (err) {
//   console.log('Connected to redis successfully');
// });

// App setup
const PORT = 8080;
const app = express();

// Enable CORS middleware
app.use((req, res, next) => {
  // Set the appropriate CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-test-header");
  next();
});

const sessionMiddleware = session({
  // store: new RedisStore({ client: redisClient }),
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
});
app.use(sessionMiddleware);

// Socket setup
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "*", // Set the appropriate origin or '*' for any origin
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-test-header"],
  },
});

// Handle socket connections
io.use(sharedSession(sessionMiddleware, { autoSave: true }));

var dict = {};

io.on("connection", function (socket) {
  // Check if the socket has a user session
  if (socket.handshake.session && socket.handshake.session.user) {
    const user = socket.handshake.session.user;
    console.log("User reconnected, userid: ", socket.handshake.session.user);
  } else {
    console.log("A new user is connected, userid: ", socket.id);
    getRandomNumber(socket.id);
    console.log(socket.id, " : ", dict[socket.id]);
  }

  // Handle incoming messages
  socket.on("message", (message) => {
    console.log(message);
    socket.emit("message-server", `${socket.id.substr(0, 2)} said ${message}`);

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

  // Handle disconnections
  socket.on("disconnect", () => {
    if (socket.handshake.session && socket.handshake.session.user) {
      console.log("User disconnected, userid: ", socket.handshake.session.user);
    } else {
      console.log("User disconnected, userid: ", socket.id);
    }
  });
});


function hasUniqueDigits(number) {
  let digits = new Set(number.toString().split('')); // Convert number to string and store its digits in a Set
  return digits.size === 3; // A number has unique digits if its Set has size 3
}

function getRandomNumber(socketid) {
  let number;
  do {
      number = Math.floor(Math.random() * 900) + 100; // Generate a random 3-digit number
  } while (!hasUniqueDigits(number)); // Keep generating numbers until one with unique digits is found
  dict[socketid] = number;
}