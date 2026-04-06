require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'https://mindcare-gdxc5lw4y-sivasridivya05s-projects.vercel.app',
  'https://mindcare-fqvh1crim-sivasridivya05s-projects.vercel.app',
  'https://mindcare-app-umber.vercel.app'
];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

app.set('io', io);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/mood',      require('./routes/mood'));
app.use('/api/forum',     require('./routes/forum'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/sessions',  require('./routes/sessions'));
app.use('/api/messages',  require('./routes/messages'));
app.use('/api/habits',    require('./routes/habits'));
app.use('/api/therapist', require('./routes/therapist'));

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('new-post', (data) => io.emit('post-update', data));
  socket.on('disconnect', () => console.log('Client disconnected'));
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is busy`);
      process.exit(1);
    }
  });