import { Server } from 'socket.io'

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io
    io.on('connection', socket => {
        socket.on('message', async (message, conversationId) => {
            console.log("message", message)
            console.log("ConversationId", conversationId)
            socket.broadcast.emit('message', message, conversationId)
        })
    })
  }
  res.end()
}

export default SocketHandler