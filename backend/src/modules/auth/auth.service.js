const User = require('../../models/User');
const tokenService = require('./token.service');
const bcrypt = require('bcryptjs');

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password +refreshTokens +loginAttempts +lockUntil');
  
  if (!user) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  // Check if account is locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    const err = new Error('Account temporarily locked. Please try again later.');
    err.statusCode = 403;
    throw err;
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    // Increment login attempts
    user.loginAttempts += 1;
    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockUntil = Date.now() + LOCK_TIME;
    }
    await user.save();
    
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  // Reset login attempts on successful login
  user.loginAttempts = 0;
  user.lockUntil = null;
  user.lastLoginAt = new Date();

  const payload = { id: user._id, role: user.role, email: user.email };
  const accessToken = tokenService.generateAccessToken(payload);
  const refreshToken = tokenService.generateRefreshToken(payload);

  // Store hashed refresh token
  const hashedRefreshToken = tokenService.hashToken(refreshToken);
  user.refreshTokens.push(hashedRefreshToken);
  
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    }
  };
};

const refresh = async (oldRefreshToken) => {
  let decoded;
  try {
    decoded = tokenService.verifyRefreshToken(oldRefreshToken);
  } catch (err) {
    const error = new Error('Invalid refresh token');
    error.statusCode = 401;
    throw error;
  }

  const hashedOldToken = tokenService.hashToken(oldRefreshToken);
  const user = await User.findById(decoded.id).select('+refreshTokens');

  if (!user || !user.refreshTokens.includes(hashedOldToken)) {
    // Potential token reuse / theft
    if (user) {
      user.refreshTokens = []; // Clear all tokens for security
      await user.save();
    }
    const err = new Error('Token reuse detected or invalid token');
    err.statusCode = 401;
    throw err;
  }

  // Rotate token
  user.refreshTokens = user.refreshTokens.filter(t => t !== hashedOldToken);
  
  const payload = { id: user._id, role: user.role, email: user.email };
  const accessToken = tokenService.generateAccessToken(payload);
  const newRefreshToken = tokenService.generateRefreshToken(payload);
  
  user.refreshTokens.push(tokenService.hashToken(newRefreshToken));
  await user.save();

  return { accessToken, refreshToken: newRefreshToken };
};

const logout = async (userId, refreshToken) => {
  const hashedToken = tokenService.hashToken(refreshToken);
  await User.findByIdAndUpdate(userId, {
    $pull: { refreshTokens: hashedToken }
  });
};

const register = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    const err = new Error('Email already in use');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.create(userData);
  
  const payload = { id: user._id, role: user.role, email: user.email };
  const accessToken = tokenService.generateAccessToken(payload);
  const refreshToken = tokenService.generateRefreshToken(payload);

  user.refreshTokens.push(tokenService.hashToken(refreshToken));
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    }
  };
};

module.exports = { login, refresh, logout, register };
