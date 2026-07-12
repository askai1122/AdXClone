const crypto = require('crypto');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD_HASH = crypto.createHash('sha256').update('ADX@Secure#2025!').digest('hex');

const sessions = new Map();

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function isValidSession(token) {
  if (!token || !sessions.has(token)) return false;
  const expiry = sessions.get(token);
  if (Date.now() > expiry) {
    sessions.delete(token);
    return false;
  }
  return true;
}

function requireAuth(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query._token;
  if (isValidSession(token)) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

module.exports = {
  ADMIN_USERNAME,
  ADMIN_PASSWORD_HASH,
  sessions,
  generateToken,
  isValidSession,
  requireAuth,
};
