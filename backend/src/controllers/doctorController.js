const Doctor = require('../models/Doctor');
const Review = require('../models/Review');

// Get all doctors with filters
const getDoctors = async (req, res) => {
  try {
    const { 
      specialty, 
      city, 
      state, 
      search, 
      lat, 
      lng, 
      radius = 50, 
      sortBy = 'rating',
      page = 1,
      limit = 10
    } = req.query;

    let query = { isActive: true };
    
    // Filter by specialty
    if (specialty && specialty !== 'All Specialties') {
      query.specialty = specialty;
    }
    
    // Filter by location
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    if (state) {
      query['location.state'] = new RegExp(state, 'i');
    }
    
    // Search by name or specialty
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { specialty: new RegExp(search, 'i') },
        { about: new RegExp(search, 'i') }
      ];
    }
    
    // Location-based search
    if (lat && lng) {
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }
    
    // Sorting
    let sortOptions = {};
    switch (sortBy) {
      case 'rating':
        sortOptions = { rating: -1, reviewCount: -1 };
        break;
      case 'experience':
        sortOptions = { experience: -1 };
        break;
      case 'fee':
        sortOptions = { consultationFee: 1 };
        break;
      case 'name':
        sortOptions = { name: 1 };
        break;
      default:
        sortOptions = { rating: -1 };
    }
    
    const skip = (page - 1) * limit;
    
    const doctors = await Doctor.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Doctor.countDocuments(query);
    
    res.json({
      success: true,
      data: doctors,
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
      message: 'Error fetching doctors',
      error: error.message
    });
  }
};

// Get single doctor
const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    // Get reviews for this doctor
    const reviews = await Review.find({ doctor: doctor._id })
      .populate('patient', 'name')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({
      success: true,
      data: {
        doctor,
        reviews
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor',
      error: error.message
    });
  }
};

// Get specialties
const getSpecialties = async (req, res) => {
  try {
    const specialties = await Doctor.distinct('specialty');
    res.json({
      success: true,
      data: ['All Specialties', ...specialties]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching specialties',
      error: error.message
    });
  }
};

module.exports = {
  getDoctors,
  getDoctor,
  getSpecialties
};