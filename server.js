// const express = require('express');
// const http = require('http');
// const mongoose = require('mongoose');
// const { Server } = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// app.use(express.json());
// app.use(express.static('public'));

// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/projects', require('./routes/projects'));
// app.use('/api/tasks', require('./routes/tasks')(io));

// io.on('connection', (socket) => {
//   socket.on('join-project', (projectId) => {
//     socket.join(projectId);
//   });
// });

// mongoose.connect('mongodb://127.0.0.1:27017/pm_tool')
//   .then(() => server.listen(3000, () => console.log('🚀 Server running on http://localhost:3000')));



const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks')(io));

io.on('connection', (socket) => {
  socket.on('join-project', (projectId) => {
    socket.join(projectId);
  });
});

// Priority to Render environment variable, fallback to local database for local dev
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pm_tool';
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB Connection Error:', err));