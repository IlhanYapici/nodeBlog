const jwt = require("jsonwebtoken");
const SECRET = "hkgHFOU794vdJbHKhonfh";

const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      lastname: user.lastname,
      firstname: user.firstname,
      isAdmin: user.isAdmin
    },
    SECRET,
    {
      expiresIn: "1h",
      algorithm: "HS256",
    }
  );
};

const verifyToken = (token) => {
  try {
    const payload = jwt.verify(token, SECRET);
    return payload;
  } catch (e) {
    return null;
  }
};

module.exports = {
  createToken,
  verifyToken,
};