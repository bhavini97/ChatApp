const express = require('express')
const app = express();
const cors = require('cors');
const authRoutes = require('./router/authRoutes')
const chatRoutes = require('./router/chatRoutes');
const groupRoutes = require('./router/groupRoutes');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const jwtMiddleware = require('./middleware/jwt');
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
    methods: ['GET', 'POST'],
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


// Use JWT middleware for HTTP routes
app.use(jwtMiddleware);  // This middleware will automatically attach the user info to the req object

// Socket.IO handling
io.on('connection', (socket) => {
  const token = socket.handshake.query.token;  // Get token from the socket handshake
  
  if (!token) {
    socket.emit('error', 'No token provided');
    return;
  }

  // Use your existing JWT middleware to verify the token for socket connection
  jwtMiddleware({ headers: { authorization: `Bearer ${token}` } }, {}, (err) => {
    if (err) {
      socket.emit('error', 'Invalid token');
      return;
    }

    // Assuming that the decoded user info is available in the req.user object (from your JWT middleware)
    const userId = socket.userId;  // Assuming `socket.userId` is set by your middleware

    console.log(`User ${userId} connected`);

    // Event: User joins a group
    socket.on('joinGroup', (groupId) => {
      socket.join(groupId);
      console.log(`User ${userId} joined group ${groupId}`);
    });

    // Event: User sends a message
    socket.on('sendMessage', (groupId, message) => {
      console.log(`User ${userId} sent message to group ${groupId}: ${message}`);
      io.to(groupId).emit('receiveMessage', { userId, message });
    });

    // Disconnect event
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
  });
});
server.listen(process.env.PORT)
