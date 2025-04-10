const express = require("express");
const router = express.Router();
const path = require('path')
const middleware = require('../middleware/jwt')
const chatCtrl = require('../controller/chatRoom')

router.get('/',(req,res)=>{

   res.sendFile(path.join(__dirname,"..","public","chat.html"))
});

router.post('/',middleware,chatCtrl.addChatsToTable);

module.exports = router;