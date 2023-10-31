import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with the actual origin of your client
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable cookies and credentials if needed
};

export default async function SocketHandler(req, res) {
  if (req.method === 'GET') {
    // Create an HTTP server
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Socket.IO Server');
    });

    // Initialize Socket.IO with the HTTP server and apply CORS
    const io = new Server(server, {
      cors: corsOptions,
    });

    // ... Rest of your socket.io code ...

    // Start listening on a port
    const PORT = 3001;
    server.listen(PORT, () => {
      console.log(`Socket.IO server is running on http://localhost:${PORT}`);
    });

    res.status(200).end();
  } else {
    res.status(405).end(); // Method not allowed
  }
}
