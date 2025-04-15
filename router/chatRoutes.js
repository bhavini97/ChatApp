const express = require("express");
const router = express.Router();
const path = require('path')
const middleware = require('../middleware/jwt')
const chatCtrl = require('../controller/chatRoom')
const multer = require('multer');
const upload = multer();

router.get('/',(req,res)=>{

   res.sendFile(path.join(__dirname,"..","public","chat.html"))
});

router.post('/',middleware,chatCtrl.addChatsToTable);
router.get('/chats',middleware,chatCtrl.getUserChat);
router.post('/uploads',middleware,upload.single("file"),chatCtrl.uploadFile);

module.exports = router;