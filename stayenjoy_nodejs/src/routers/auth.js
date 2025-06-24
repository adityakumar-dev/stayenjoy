const User = require('../models/user');
const { getJWTtokens } = require('../plugins/jwt_tokens');
const { comparePassword, hashPassword } = require('../plugins/passwordhash');
const Session = require('../models/session');

// Signup handler
const signup = async (request, reply) => {
  const {
    name, email, password, gender, phone,
    address, govt_id_number, id_type
  } = request.body;

  if (!name || !email || !password || !gender || !phone || !address) {
    return reply.code(400).send({ message: 'All fields are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return reply.code(400).send({ message: 'User already exists' });
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    gender,
    phone,
    address,
    role: 'user',
    govt_id_number,
    id_type
  });

  const tokens = getJWTtokens({ id: user._id, role: user.role });

  await Session.create({
    userId: user._id,
    deviceIp: request.ip,
    deviceInfo: request.headers['user-agent'],
    deviceType: request.headers['device-type'],
    deviceUUID: request.headers['device-uuid'],
    deviceOS: request.headers['device-os'],
    deviceBrowser: request.headers['device-browser'],
    deviceVersion: request.headers['device-version'],
  });

  reply
    .code(200)
    .header('Set-Cookie', `token=${tokens}; Path=/; HttpOnly; Secure; SameSite=Lax`)
    .send({ user });
};

// Sign-in handler
const signIn = async (request, reply) => {
  const { email, password } = request.body;
  const testUser = await User.findOne({ email });
  if (!testUser) {
    return reply.code(400).send({ message: 'User not found' });
  }

  const isMatch = await comparePassword(password, testUser.password);
  if (!isMatch) {
    return reply.code(400).send({ message: 'Invalid password' });
  }

  const tokens = getJWTtokens({ id: testUser._id, role: testUser.role });
  const deviceUUID = request.headers['device-uuid'];

  let session = await Session.findOne({ userId: testUser._id, deviceUUID });

  if (session && !session.allowedLogin) {
    return reply.code(403).send({ message: 'Device blocked' });
  }

  if (session) {
    // Update existing session
    await Session.updateOne(
      { _id: session._id },
      {
        deviceIp: request.ip,
        deviceInfo: request.headers['user-agent'],
        deviceType: request.headers['device-type'],
        deviceOS: request.headers['device-os'],
        deviceBrowser: request.headers['device-browser'],
        deviceVersion: request.headers['device-version'],
        lastLoginAt: new Date()
      }
    );
  } else {
    // Create new session
    await Session.create({
      userId: testUser._id,
      deviceIp: request.ip,
      deviceInfo: request.headers['user-agent'],
      deviceType: request.headers['device-type'],
      deviceUUID: deviceUUID,
      deviceOS: request.headers['device-os'],
      deviceBrowser: request.headers['device-browser'],
      deviceVersion: request.headers['device-version'],
    });
  }

  reply
    .code(200)
    .header('Set-Cookie', `token=${tokens}; Path=/; HttpOnly; Secure; SameSite=Lax`)
    .send({ user: testUser });
};

// Email check
const checkEmail = async (request, reply) => {
  const { email } = request.body;
  const testUser = await User.findOne({ email });
  if (testUser) {
    return reply.code(400).send({ message: 'User already exists' });
  }
  reply.code(200).send({ message: 'User does not exist' });
};

module.exports = {
  signup,
  signIn,
  checkEmail
};
