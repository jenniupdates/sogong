const express = require("express");
const session = require("express-session");
const socket = require("socket.io");
const sharedSession = require("express-socket.io-session");

const RedisStore = require("connect-redis").default
const redis = require("redis");

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

// Redis session store
// let RedisStore = connectRedis(session);
const redisClient = redis.createClient({
  host: "127.0.0.1",
  port: 6379
});

// Verify redis client connection
redisClient.connect().catch(console.error);


// Session middleware
const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
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

var socketSessionDict = {}

// socketid : random number generated for mastermind game
var gameDict = {};

// Use shared session middleware for Socket.IO
io.use(sharedSession(sessionMiddleware, { autoSave: true }));

// Handle socket connections
io.on("connection", function (socket) {

  // Check if the socket has a user session
  if (socket.handshake.session && socket.handshake.session.user) {
    const user = socket.handshake.session.user;

    // Store the socket ID and user ID in the dictionary
    socketUserDict[socket.id] = user;

    console.log("User reconnected, userid: ", socket.handshake.session.user);

  } else {
    console.log("A new user is connected, socket id: ", socket.id);

    if (socket.handshake.session) {
      // Restore the previous session data
      socket.handshake.session.reload((err) => {
        if (!err && socketUserDict[socket.id]) {
          // Restore the user ID using the dictionary
          socket.handshake.session.user = socketUserDict[socket.id];
          socket.handshake.session.save();
        } else {
          // Generate a new user ID
          const userId = generateUserId();
          socket.handshake.session.user = userId;
          socket.handshake.session.save();
          socketUserDict[socket.id] = userId;
        }
      });
    } else {
      // Generate a new user ID
      const userId = generateUserId();
      socket.handshake.session.user = userId;
      socket.handshake.session.save();
      socketUserDict[socket.id] = userId;
    }
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
      console.log("User disconnected, socket id: ", socket.id);
    }

    // Remove the socket ID and user ID from the dictionary
    delete socketUserDict[socket.id];
  });
});

function generateUserId() {
  // Generate a random user ID
  return Math.random().toString(36).substr(2, 8);
}
