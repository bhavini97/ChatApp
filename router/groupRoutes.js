const express = require("express");
const router = express.Router();
const path = require('path')
const grpCtrl = require('../controller/groupCtrl');
const middleware = require('../middleware/jwt')



router.get('/add-group',(req,res)=>{

   res.sendFile(path.join(__dirname,"..","public","group.html"))
});

router.post('/create',middleware,grpCtrl.createGroup);
router.get('/user-groups',middleware,grpCtrl.getUserGroups);
module.exports = router;