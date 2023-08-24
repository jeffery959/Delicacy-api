import jwt from 'jsonwebtoken';
import User from '../Schema/UserSchema.js';
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

 
  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.SecretKey);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    // Attach the authenticated user to the request object for later use in other routes
    req.user = user;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export default authMiddleware;
