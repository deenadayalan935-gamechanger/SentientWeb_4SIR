import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import startSimulation from './simulation/telemetryEngine.js';
import { initSocketHandler } from './socket/socketHandler.js';
import threatRoutes from './routes/threatRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'SentientWeb Server Online',
    timestamp: new Date()
  });
});

app.use('/api/threats', threatRoutes);
app.use('/api/auth', authRoutes);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

initSocketHandler(io);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log('SentientWeb Server running on port ' + PORT);
    console.log('WebSocket server active');
    console.log('MongoDB connected');
    startSimulation(io);
  });
});