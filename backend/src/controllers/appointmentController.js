const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Book appointment
const bookAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      timeSlot,
      reason,
      symptoms
    } = req.body;

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if time slot is available
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      'timeSlot.startTime': timeSlot.startTime,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Time slot is not available'
      });
    }

    // Create appointment
    const appointment = new Appointment({
      patient: req.user.userId,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      reason,
      symptoms: symptoms || [],
      consultationFee: doctor.consultationFee
    });

    await appointment.save();

    // Populate appointment data
    await appointment.populate([
      { path: 'doctor', select: 'name specialty location consultationFee' },
      { path: 'patient', select: 'name email phone' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error booking appointment',
      error: error.message
    });
  }
};

// Get user appointments
const getUserAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = { patient: req.user.userId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(query)
      .populate('doctor', 'name specialty location image consultationFee')
      .sort({ appointmentDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user.userId
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if appointment can be cancelled (at least 24 hours before)
    const appointmentTime = new Date(appointment.appointmentDate);
    const now = new Date();
    const timeDiff = appointmentTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    if (hoursDiff < 24) {
      return res.status(400).json({
        success: false,
        message: 'Appointments can only be cancelled at least 24 hours in advance'
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment',
      error: error.message
    });
  }
};

// Get available time slots
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID and date are required'
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Get day of week
    const appointmentDate = new Date(date);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[appointmentDate.getDay()];

    // Check if doctor is available on this day
    const availability = doctor.availability.find(avail => avail.day === dayName);
    if (!availability) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Generate time slots (30-minute intervals)
    const slots = [];
    const startTime = availability.startTime;
    const endTime = availability.endTime;
    
    // Simple time slot generation (you can make this more sophisticated)
    const timeSlots = [
      { startTime: '09:00', endTime: '09:30' },
      { startTime: '09:30', endTime: '10:00' },
      { startTime: '10:00', endTime: '10:30' },
      { startTime: '10:30', endTime: '11:00' },
      { startTime: '11:00', endTime: '11:30' },
      { startTime: '11:30', endTime: '12:00' },
      { startTime: '14:00', endTime: '14:30' },
      { startTime: '14:30', endTime: '15:00' },
      { startTime: '15:00', endTime: '15:30' },
      { startTime: '15:30', endTime: '16:00' },
      { startTime: '16:00', endTime: '16:30' },
      { startTime: '16:30', endTime: '17:00' }
    ];

    // Check which slots are already booked
    const bookedAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: appointmentDate,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    const bookedSlots = bookedAppointments.map(apt => apt.timeSlot.startTime);
    const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot.startTime));

    res.json({
      success: true,
      data: availableSlots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching available slots',
      error: error.message
    });
  }
};

module.exports = {
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
  getAvailableSlots
};