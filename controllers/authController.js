const crypto = require('crypto');
const {
  ADMIN_USERNAME,
  ADMIN_PASSWORD_HASH,
  sessions,
  generateToken,
} = require('../middleware/auth');

function login(req, res) {
  const { username, password } = req.body || {};
  const passHash = crypto.createHash('sha256').update(password || '').digest('hex');

  if (username === ADMIN_USERNAME && passHash === ADMIN_PASSWORD_HASH) {
    const token = generateToken();
    sessions.set(token, Date.now() + 8 * 60 * 60 * 1000);
    return res.json({ success: true, token });
  }

  return res.status(401).json({ success: false, message: 'Invalid username or password.' });
}

function logout(req, res) {
  const token = req.headers['x-admin-token'];
  if (token) sessions.delete(token);
  res.json({ success: true });
}

module.exports = { login, logout };
