const express = require('express');
const router = express.Router();
const { getDoctors, getDoctor, getSpecialties } = require('../controllers/doctorController');

// GET /api/doctors - Get all doctors with filters
router.get('/', getDoctors);

// GET /api/doctors/specialties - Get all specialties
router.get('/specialties', getSpecialties);

// GET /api/doctors/:id - Get single doctor
router.get('/:id', getDoctor);

module.exports = router;