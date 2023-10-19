// const http = require('http');
// const WebSocket = require('ws');

// const server = http.createServer((req, res) => {
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end('WebSocket server is running.');
// });

// const wss = new WebSocket.Server({ noServer: true });

// wss.on('connection', (ws) => {
//   console.log("hiii")
//   ws.on('open', (ws) => {
//     console.log(hiii)
//   })
//   ws.on('message', (message) => {
//     wss.clients.forEach((client) => {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//   });
// });

// server.on('upgrade', (request, socket, head) => {
//   wss.handleUpgrade(request, socket, head, (ws) => {
//     wss.emit('connection', ws, request);
//   });
// });

// server.listen(3000, () => {
//   console.log('WebSocket server is running on port 8080');
// });
