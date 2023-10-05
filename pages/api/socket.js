import { Server } from 'socket.io';

export default async function SocketHandler(req, res) {
  if (req.method === 'GET') {
    // Assuming you have an HTTP server instance, you can attach Socket.IO to it like this:
    const http = require('http');
const { Server } = require('socket.io');

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.IO Server');
});

// Initialize Socket.IO with the HTTP server
const io = new Server(server);

// Set up event handlers for the socket connection
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Add event handlers for socket communication here

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start listening on a port
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Socket.IO server is running on http://localhost:${PORT}`);
});

   


    res.status(200).end();
  } else {
    res.status(405).end(); // Method not allowed
  }
}

