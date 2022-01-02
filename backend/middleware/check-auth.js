const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("CheckAuth is called!!!!!!!!!!!!!!")
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("Token is",token);
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    console.log("Decoded token is",decodedToken);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
