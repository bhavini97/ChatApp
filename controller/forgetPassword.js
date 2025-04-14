// When a user requests password reset, this file store it in the database and email a reset link.

const passwordService = require("../service/passwordService");
const path = require('path');

module.exports = {

  // to send reset email 
  sendEmail: async (req, res) => {
  try {
    const response = await passwordService.sendResetEmail(req.body.email);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
},

// to get new password form
getResetForm: async (req, res) => {
  try {
    const formHtml = await passwordService.getResetForm(req.params.id);
    res.sendFile(path.join(__dirname,"..","public","forgetPassword.html"));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
},

// update in database
updatePassword: async (req, res) => {
  try {
    const response = await passwordService.updatePassword(req.params.id, req.body.newPassword);
    res.json({ message: response.message });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
},
};