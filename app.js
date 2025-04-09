const express = require('express')
const app = express();
const cors = require('cors');
const authRoutes = require('./router/authRoutes')
<<<<<<< HEAD
require('dotenv').config()
=======
>>>>>>> ce50632971f3148601644953e4e797b6ad7e9ef0


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

<<<<<<< HEAD
app.listen(process.env.PORT)
=======
app.listen(3000)
>>>>>>> ce50632971f3148601644953e4e797b6ad7e9ef0
