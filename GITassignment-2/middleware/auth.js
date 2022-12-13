const jwt = require("jsonwebtoken");

const JWTauth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) return res.status(403).send("Access Forbidden");

    const verifyUser = jwt.verify(token, process.env.MY_JWT_SECRET);

    if (verifyUser) {
      const user = verifyUser.payload;
      res.user = user;
      next();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = JWTauth;
