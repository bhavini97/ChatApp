const express = require('express')
const app = express();
const cors = require('cors');
const authRoutes = require('./router/authRoutes')
const chatRoutes = require('./router/chatRoutes');
const groupRoutes = require('./router/groupRoutes');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const verifyToken = require('./middleware/verifyToken');
const saveMessage = require('./service/chatService');
require('dotenv').config()


// app.use(cors(
//     {
//         origin:`http://127.0.0.1:5500`,
//         credentials:true
//     }
// ));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://127.0.0.1:5500',
    credentials: true,
  },
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','landingPage.html'))
})
app.use('/auth',authRoutes);
app.use('/chatRoom',chatRoutes)
app.use('/groups',groupRoutes);



// Socket.IO handling
io.on('connection', (socket) => {
  const token = socket.handshake.query.token;  // Get token from the socket handshake
  
  if (!token) {
    socket.emit('error', 'No token provided');
    return;
  }

  //  verify the token for socket connection
  const decoded = verifyToken(token);
  if (!decoded) {
    socket.emit('error', 'Invalid token');
    return;
  }
    
    const userId = decoded.userId; 
    const username = decoded.name;

    console.log(`User ${userId} connected`);

    // Event: User joins a group
    socket.on('joinGroup', (groupId) => {
      socket.join(`group-${groupId}`); 
      console.log(`User ${userId} joined group ${groupId}`);
    });

    // Event: User sends a message
    socket.on('sendMessage', async (groupId, message) => {
      console.log(`User ${userId} sent message to group ${groupId}: ${message}`);
  
      // Save message in database and broadcast
      const savedMessage = await saveMessage.addChatsToTable(message, userId, groupId, username);
  
      const messageData = {
        id: savedMessage.id,
        messages: message,
        username: username,
        sender_id: userId,
        groupId: parseInt(groupId),
      };
  
      // Broadcast to all users in the group
      io.to(`group-${groupId}`).emit('receiveMessage', messageData);
    });
  
    // Handle user disconnecting
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
    socket.on('leaveGroup', (groupId) => {
      socket.leave(`group-${groupId}`);
    });
  });

  
  // Start server
  server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });