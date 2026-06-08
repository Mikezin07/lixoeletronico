const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "devsecret";

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Token ausente" });
  const parts = header.split(" ");
  if (parts.length !== 2) return res.status(401).json({ message: "Token inválido" });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}

module.exports = authMiddleware;
