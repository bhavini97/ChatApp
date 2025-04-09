const express = require('express')
const app = express();
const cors = require('cors');
const authRoutes = require('./router/authRoutes')


app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));

app.use('/auth',authRoutes);

app.listen(3000)