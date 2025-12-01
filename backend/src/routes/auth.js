const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, sendOTP, verifyOTP, getProfile, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('userType').optional().isIn(['patient', 'doctor']).withMessage('User type must be patient or doctor')
], register);

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required'),
  body('userType').optional().isIn(['patient', 'doctor']).withMessage('User type must be patient or doctor')
], login);

// POST /api/auth/send-otp
router.post('/send-otp', [
  body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('userType').optional().isIn(['patient', 'doctor']).withMessage('User type must be patient or doctor')
], sendOTP);

// POST /api/auth/verify-otp
router.post('/verify-otp', [
  body('phone').isMobilePhone({min:10,max:10}).withMessage('Please provide a valid phone number'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('userType').optional().isIn(['patient', 'doctor']).withMessage('User type must be patient or doctor')
], verifyOTP);

// GET /api/auth/profile
router.get('/profile', auth, getProfile);

// PUT /api/auth/profile
router.put('/profile', auth, updateProfile);

module.exports = router;