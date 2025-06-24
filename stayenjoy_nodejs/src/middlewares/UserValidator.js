const { verifyJWTToken } = require('../plugins/jwt_tokens');
const Session = require('../models/session');

const userValidate = async (req, res, next) => {
  try {
    const headers = req.headers;
    const authHeader = headers.authorization;
    const deviceUUID = headers['deviceuuid']; // lowercase & safe key access

    if (!authHeader || !deviceUUID) {
      return res.code(400).send({ message: 'Authorization and deviceUUID headers are required' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
      return res.code(400).send({ message: 'Invalid authorization header format' });
    }

    const decoded = verifyJWTToken(token);
    if (!decoded || !decoded.id) {
      return res.code(401).send({ message: 'Invalid token, please login again' });
    }

    const session = await Session.findOne({
      userId: decoded.id,
      deviceUUID: deviceUUID
    });

    if (!session || !session.allowedLogin) {
      return res.code(403).send({ message: 'Session not allowed or device blocked' });
    }

    req.user = decoded;
    req.session = session;
    next();

  } catch (err) {
    console.error('Auth Middleware Error:', err);
    return res.code(500).send({ message: 'Authentication failed' });
  }
};

module.exports = userValidate;
