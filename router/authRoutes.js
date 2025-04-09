const express = require("express");
const router = express.Router();
const path = require('path')
const authCtrl = require('../controller/authCtrl')

router.get('/',(req,res)=>{

   res.sendFile(path.join(__dirname,"..","public","signUp.html"))
});

router.post('/signUp',authCtrl.addUser);

router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,"..","public","login.html"))
})

<<<<<<< HEAD
router.post('/login',authCtrl.loginUser);

=======
>>>>>>> ce50632971f3148601644953e4e797b6ad7e9ef0
module.exports = router;