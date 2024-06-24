const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const auth = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.some(role => req.user.roles.includes(role))) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};

module.exports = auth;
