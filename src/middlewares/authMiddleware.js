import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(403).json({ message: "Access denied, token missing" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET); 
    next(); 
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


