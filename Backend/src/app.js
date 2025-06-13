import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import {createServer} from 'http';
import {Server } from 'socket.io';

const app = express();
const server = createServer(app);

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  const userId = socket.handshake.query.userId;
  if(userId !== undefined) 
     userSocketMap[userId] = socket.id;

  io.emit("Onlineusers", Object.keys(userSocketMap));
  
  socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("Onlineusers", Object.keys(userSocketMap));
  });
})


import userRoutes from './Routes/user.routes.js';
import chatRoutes from './Routes/chat.routes.js';
import messageRoutes from './Routes/message.routes.js';

app.use("/api/v1/user",userRoutes);
app.use("/api/v1/chat",chatRoutes);
app.use("/api/v1/chat/message",messageRoutes);

export default server