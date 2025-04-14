const express = require('express')
const app = express();
const cors = require('cors');
const authRoutes = require('./router/authRoutes')
const chatRoutes = require('./router/chatRoutes');
const groupRoutes = require('./router/groupRoutes');
const path = require('path');

require('dotenv').config()


app.use(cors(
    {
        origin:`http://127.0.0.1:5500`,
        credentials:true
    }
));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','landingPage.html'))
})
app.use('/auth',authRoutes);
app.use('/chatRoom',chatRoutes)
app.use('/groups',groupRoutes);

app.listen(process.env.PORT)
