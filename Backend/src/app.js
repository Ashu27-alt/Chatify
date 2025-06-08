import express from 'express';
import { createServer } from 'node:http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {Server} from 'socket.io'

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


import userRoutes from './Routes/user.routes.js';
import chatRoutes from './Routes/chat.routes.js';

app.use("/api/v1/user",userRoutes);
app.use("/api/v1/chat",chatRoutes);

export default server