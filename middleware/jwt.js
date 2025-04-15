// middleware/jwt.js
const verifyToken = require("./verifyToken");

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization').split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    req.user = decoded; // attach decoded user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
