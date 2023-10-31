const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.IO Server');
});

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('input-change', (msg) => {
    // Handle the input-change event here
    console.log('Input changed:', msg);

    // Broadcast the updated input to all connected clients
    io.emit('update-input', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
