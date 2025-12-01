const express = require('express');
const router = express.Router();
const { 
  bookAppointment, 
  getUserAppointments, 
  cancelAppointment, 
  getAvailableSlots 
} = require('../controllers/appointmentController');
const auth = require('../middleware/auth');

// All appointment routes require authentication
router.use(auth);

// POST /api/appointments - Book appointment
router.post('/', bookAppointment);

// GET /api/appointments - Get user appointments
router.get('/', getUserAppointments);

// GET /api/appointments/slots - Get available time slots
router.get('/slots', getAvailableSlots);

// PUT /api/appointments/:id/cancel - Cancel appointment
router.put('/:id/cancel', cancelAppointment);

module.exports = router;