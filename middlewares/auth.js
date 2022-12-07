const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const jwtvalidate = () => {
  return (req, res, next) => {
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      let token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, SECRET_KEY, (err, decode) => {
        if (err) {
          res.status(400).json({ err: 1, meassage: "Invalid Token" });
        } else {
          next();
        }
      });
    } else {
      res.status(400).json({ err: 1, meassage: "Please provide Token" });
    }
  };
};

module.exports = jwtvalidate;
