require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: 'http://localhost:5173' } });

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'));

// Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/mood',      require('./routes/mood'));
app.use('/api/forum',     require('./routes/forum'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/sessions',  require('./routes/sessions'));
app.use('/api/messages',  require('./routes/messages'));
app.use('/api/habits',    require('./routes/habits'));
app.use('/api/therapist', require('./routes/therapist'));

io.on('connection', (socket) => {
  socket.on('new-post', (data) => io.emit('post-update', data));
});

httpServer.listen(5000, () => console.log('Server running on port 5000'));