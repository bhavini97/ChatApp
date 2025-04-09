const express = require("express");
const router = express.Router();
const path = require('path')
const authCtrl = require('../controller/authCtrl')

router.get('/',(req,res)=>{

   res.sendFile(path.join(__dirname,"..","public","signUp.html"))
});

router.post('/signUp',authCtrl.addUser);

module.exports = router;