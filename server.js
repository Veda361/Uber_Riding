require("dotenv").config();

const http = require("http");

const app = require("./src/app");
const connectDB = require("./src/config/db");
const {socketHandler} = require("./src/sockets/socketHandler");

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});



app.set("io", io);
socketHandler(io);


server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});