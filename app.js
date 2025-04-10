const express = require('express')
const app = express();
const cors = require('cors');
const authRoutes = require('./router/authRoutes')
const chatRoutes = require('./router/chatRoutes')
require('dotenv').config()


app.use(cors(
    {
        origin:`http://127.0.0.1:5500`,
        credentials:true
    }
));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));

app.use('/auth',authRoutes);
app.use('/chatRoom',chatRoutes)

app.listen(process.env.PORT)
