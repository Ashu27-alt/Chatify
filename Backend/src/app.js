import express from 'express';
import { createServer } from 'node:http';
import cookieParser from 'cookie-parser';
import cookies from 'cookie-parser'
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const server = createServer(app);

app.use(cookieParser());
app.use(cookies());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


import userRoutes from './Routes/user.routes.js';
import chatRoutes from './Routes/chat.routes.js';
import messageRoutes from './Routes/message.routes.js';

app.use("/api/v1/user",userRoutes);
app.use("/api/v1/chat",chatRoutes);
app.use("/api/v1/chat/message",messageRoutes);

export default server