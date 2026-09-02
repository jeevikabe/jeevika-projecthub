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
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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

mongoose.connect('mongodb://127.0.0.1:27017/pm_tool')
  .then(() => server.listen(3000, () => console.log('🚀 Server running on http://localhost:3000')));