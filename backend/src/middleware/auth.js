const jwt = require('jsonwebtoken');

function getCookie(req, name) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=').map(c => c.trim());
    if (key) acc[key] = value;
    return acc;
  }, {});
  return cookies[name] || null;
}

module.exports = function adminAuth(req, res, next) {
  let token = getCookie(req, 'admin_key') || req.headers['authorization'] || req.headers['x-admin-key'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  if (typeof token === 'string' && token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!process.env.ADMIN_EMAIL || decoded.email !== process.env.ADMIN_EMAIL.toLowerCase()) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token user' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};
