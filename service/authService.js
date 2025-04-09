const User = require("../models/user");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const { Op } = require('sequelize');

module.exports = {
  // add user to user table (if not exist)
  addSignUpUser: async (name, email, phone, password) => {
    const t = await db.transaction();

    try {
      // Encrypt password
      const hashedPassword = await bcrypt.hash(password, 10);

      // this will ensure that email and phone are unqiue for each user
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { phone }],
        },
      });

      if (existingUser) {
        throw new Error("User already exists with this email or phone");
      }

      const res = await User.create(
        {
          username: name,
          email: email,
          phone: phone,
          password: hashedPassword,
        },
        { transaction: t }
      );
      
      await t.commit();
      return res;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },
};
