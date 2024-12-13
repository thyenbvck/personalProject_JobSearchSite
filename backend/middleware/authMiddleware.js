import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// Middleware xác thực token
export const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(400).json({ message: 'Invalid Token.' });
  }
};
