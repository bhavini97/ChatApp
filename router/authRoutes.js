const express = require("express");
const router = express.Router();
const path = require('path')
const authCtrl = require('../controller/authCtrl')
const ForgetPasswordCtrl = require('../controller/forgetPassword')

router.get('/',(req,res)=>{

   res.sendFile(path.join(__dirname,"..","public","signUp.html"))
});

router.post('/signUp',authCtrl.addUser);

router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,"..","public","login.html"))
})

router.post('/login',authCtrl.loginUser);

// forget passwords
router.post('/password/forgotpassword',ForgetPasswordCtrl.sendEmail);
router.get('/resetpassword/:id',ForgetPasswordCtrl.getResetForm);
router.post('/updatepassword/:id',ForgetPasswordCtrl.updatePassword);

module.exports = router;