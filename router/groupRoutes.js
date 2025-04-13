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
router.get('/:id',(req,res)=>{
   res.sendFile(path.join(__dirname,"..","public","group-info.html"))
})
router.get('/:id/members',middleware,grpCtrl.getUserDetailsOfTheGroup);

router.put('/:groupId/make-admin/:userId',middleware,grpCtrl.makeUserAdmin);
router.delete('/:groupId/delete/:userId',middleware,grpCtrl.deleteUserFromGroup);

router.post('/:groupId/add-member',grpCtrl.addNewMember);
module.exports = router;