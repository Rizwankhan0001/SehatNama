const indianDoctors = [
  // Mumbai
  {
    name: 'Dr. Rajesh Sharma',
    email: 'rajesh.sharma@prescure.com',
    specialty: 'Cardiologist',
    experience: 15,
    rating: 4.8,
    reviewCount: 234,
    location: {
      address: 'Breach Candy Hospital, Bhulabhai Desai Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400026',
      coordinates: { type: 'Point', coordinates: [72.8777, 19.0760] }
    },
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00' }
    ],
    consultationFee: 1500,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    about: 'Senior Cardiologist with expertise in interventional cardiology and heart transplants.',
    education: ['MBBS from KEM Hospital Mumbai', 'MD Cardiology from AIIMS Delhi'],
    languages: ['Hindi', 'English', 'Marathi'],
    phone: '+91-9876543210'
  },
  
  // Delhi
  {
    name: 'Dr. Priya Gupta',
    email: 'priya.gupta@prescure.com',
    specialty: 'Dermatologist',
    experience: 12,
    rating: 4.9,
    reviewCount: 189,
    location: {
      address: 'Max Super Speciality Hospital, Saket',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110017',
      coordinates: { type: 'Point', coordinates: [77.2090, 28.6139] }
    },
    availability: [
      { day: 'Tuesday', startTime: '10:00', endTime: '18:00' },
      { day: 'Thursday', startTime: '10:00', endTime: '18:00' },
      { day: 'Saturday', startTime: '10:00', endTime: '16:00' }
    ],
    consultationFee: 1200,
    image: 'https://images.unsplash.com/photo-1594824475317-8b7b0c8b8b8b?w=300&h=300&fit=crop&crop=face',
    about: 'Specialist in cosmetic dermatology and skin cancer treatment.',
    education: ['MBBS from MAMC Delhi', 'MD Dermatology from PGIMER Chandigarh'],
    languages: ['Hindi', 'English', 'Punjabi'],
    phone: '+91-9876543211'
  },

  // Bangalore
  {
    name: 'Dr. Suresh Kumar',
    email: 'suresh.kumar@prescure.com',
    specialty: 'Neurologist',
    experience: 18,
    rating: 4.7,
    reviewCount: 156,
    location: {
      address: 'Manipal Hospital, HAL Airport Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560017',
      coordinates: { type: 'Point', coordinates: [77.5946, 12.9716] }
    },
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00' }
    ],
    consultationFee: 1800,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
    about: 'Expert in treating epilepsy, stroke, and neurodegenerative diseases.',
    education: ['MBBS from Mysore Medical College', 'DM Neurology from NIMHANS Bangalore'],
    languages: ['English', 'Hindi', 'Kannada', 'Tamil'],
    phone: '+91-9876543212'
  },

  // Chennai
  {
    name: 'Dr. Meera Iyer',
    email: 'meera.iyer@prescure.com',
    specialty: 'Pediatrician',
    experience: 14,
    rating: 4.8,
    reviewCount: 298,
    location: {
      address: 'Apollo Hospitals, Greams Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600006',
      coordinates: { type: 'Point', coordinates: [80.2707, 13.0827] }
    },
    availability: [
      { day: 'Monday', startTime: '08:00', endTime: '16:00' },
      { day: 'Tuesday', startTime: '08:00', endTime: '16:00' },
      { day: 'Thursday', startTime: '08:00', endTime: '16:00' },
      { day: 'Saturday', startTime: '08:00', endTime: '14:00' }
    ],
    consultationFee: 1000,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
    about: 'Pediatric specialist with focus on child development and vaccination.',
    education: ['MBBS from Madras Medical College', 'MD Pediatrics from CMC Vellore'],
    languages: ['Tamil', 'English', 'Hindi', 'Telugu'],
    phone: '+91-9876543213'
  },

  // Hyderabad
  {
    name: 'Dr. Vikram Reddy',
    email: 'vikram.reddy@prescure.com',
    specialty: 'Orthopedic',
    experience: 16,
    rating: 4.6,
    reviewCount: 167,
    location: {
      address: 'KIMS Hospitals, Kondapur',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500084',
      coordinates: { type: 'Point', coordinates: [78.4867, 17.3850] }
    },
    availability: [
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'Saturday', startTime: '09:00', endTime: '15:00' }
    ],
    consultationFee: 1400,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    about: 'Orthopedic surgeon specializing in joint replacement and sports injuries.',
    education: ['MBBS from Osmania Medical College', 'MS Orthopedics from NIMS Hyderabad'],
    languages: ['Telugu', 'English', 'Hindi'],
    phone: '+91-9876543214'
  },

  // Pune
  {
    name: 'Dr. Anjali Patil',
    email: 'anjali.patil@prescure.com',
    specialty: 'General Physician',
    experience: 10,
    rating: 4.5,
    reviewCount: 145,
    location: {
      address: 'Ruby Hall Clinic, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      zipCode: '411001',
      coordinates: { type: 'Point', coordinates: [73.8567, 18.5204] }
    },
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '18:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '18:00' },
      { day: 'Friday', startTime: '09:00', endTime: '18:00' }
    ],
    consultationFee: 800,
    image: 'https://images.unsplash.com/photo-1594824475317-8b7b0c8b8b8b?w=300&h=300&fit=crop&crop=face',
    about: 'General physician with expertise in preventive medicine and health checkups.',
    education: ['MBBS from BJ Medical College Pune', 'MD Internal Medicine from KEM Hospital Mumbai'],
    languages: ['Marathi', 'Hindi', 'English'],
    phone: '+91-9876543215'
  },

  // Kolkata
  {
    name: 'Dr. Amit Banerjee',
    email: 'amit.banerjee@prescure.com',
    specialty: 'Cardiologist',
    experience: 20,
    rating: 4.9,
    reviewCount: 312,
    location: {
      address: 'Fortis Hospital, Anandapur',
      city: 'Kolkata',
      state: 'West Bengal',
      zipCode: '700107',
      coordinates: { type: 'Point', coordinates: [88.3639, 22.5726] }
    },
    availability: [
      { day: 'Monday', startTime: '10:00', endTime: '18:00' },
      { day: 'Thursday', startTime: '10:00', endTime: '18:00' },
      { day: 'Saturday', startTime: '10:00', endTime: '16:00' }
    ],
    consultationFee: 1600,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
    about: 'Senior cardiologist with expertise in cardiac surgery and interventional procedures.',
    education: ['MBBS from Medical College Kolkata', 'DM Cardiology from IPGMER Kolkata'],
    languages: ['Bengali', 'Hindi', 'English'],
    phone: '+91-9876543216'
  },

  // Ahmedabad
  {
    name: 'Dr. Kiran Shah',
    email: 'kiran.shah@prescure.com',
    specialty: 'Psychiatrist',
    experience: 13,
    rating: 4.7,
    reviewCount: 89,
    location: {
      address: 'Sterling Hospital, Gurukul Road',
      city: 'Ahmedabad',
      state: 'Gujarat',
      zipCode: '380052',
      coordinates: { type: 'Point', coordinates: [72.5714, 23.0225] }
    },
    availability: [
      { day: 'Tuesday', startTime: '11:00', endTime: '19:00' },
      { day: 'Thursday', startTime: '11:00', endTime: '19:00' },
      { day: 'Saturday', startTime: '11:00', endTime: '17:00' }
    ],
    consultationFee: 1300,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
    about: 'Psychiatrist specializing in anxiety, depression, and behavioral disorders.',
    education: ['MBBS from BJ Medical College Ahmedabad', 'MD Psychiatry from AIIMS Delhi'],
    languages: ['Gujarati', 'Hindi', 'English'],
    phone: '+91-9876543217'
  },

  // Jaipur
  {
    name: 'Dr. Ravi Agarwal',
    email: 'ravi.agarwal@prescure.com',
    specialty: 'Dermatologist',
    experience: 11,
    rating: 4.6,
    reviewCount: 134,
    location: {
      address: 'Fortis Escorts Hospital, Malviya Nagar',
      city: 'Jaipur',
      state: 'Rajasthan',
      zipCode: '302017',
      coordinates: { type: 'Point', coordinates: [75.7873, 26.9124] }
    },
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00' }
    ],
    consultationFee: 1100,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    about: 'Dermatologist with expertise in skin allergies and cosmetic treatments.',
    education: ['MBBS from SMS Medical College Jaipur', 'MD Dermatology from AIIMS Delhi'],
    languages: ['Hindi', 'English', 'Rajasthani'],
    phone: '+91-9876543218'
  },

  // Lucknow
  {
    name: 'Dr. Sunita Verma',
    email: 'sunita.verma@prescure.com',
    specialty: 'Pediatrician',
    experience: 17,
    rating: 4.8,
    reviewCount: 201,
    location: {
      address: 'Sahara Hospital, Viraj Khand',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      zipCode: '226010',
      coordinates: { type: 'Point', coordinates: [80.9462, 26.8467] }
    },
    availability: [
      { day: 'Monday', startTime: '08:00', endTime: '16:00' },
      { day: 'Tuesday', startTime: '08:00', endTime: '16:00' },
      { day: 'Thursday', startTime: '08:00', endTime: '16:00' },
      { day: 'Saturday', startTime: '08:00', endTime: '14:00' }
    ],
    consultationFee: 900,
    image: 'https://images.unsplash.com/photo-1594824475317-8b7b0c8b8b8b?w=300&h=300&fit=crop&crop=face',
    about: 'Pediatrician with special interest in neonatal care and child nutrition.',
    education: ['MBBS from KGMU Lucknow', 'MD Pediatrics from SGPGIMS Lucknow'],
    languages: ['Hindi', 'English', 'Urdu'],
    phone: '+91-9876543219'
  },

  // Chandigarh
  {
    name: 'Dr. Harpreet Singh',
    email: 'harpreet.singh@prescure.com',
    specialty: 'Orthopedic',
    experience: 14,
    rating: 4.7,
    reviewCount: 178,
    location: {
      address: 'PGI Hospital, Sector 12',
      city: 'Chandigarh',
      state: 'Punjab',
      zipCode: '160012',
      coordinates: { type: 'Point', coordinates: [76.7794, 30.7333] }
    },
    availability: [
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'Saturday', startTime: '09:00', endTime: '15:00' }
    ],
    consultationFee: 1250,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
    about: 'Orthopedic surgeon specializing in spine surgery and trauma care.',
    education: ['MBBS from GMC Chandigarh', 'MS Orthopedics from PGI Chandigarh'],
    languages: ['Punjabi', 'Hindi', 'English'],
    phone: '+91-9876543220'
  },

  // Bhopal
  {
    name: 'Dr. Deepak Tiwari',
    email: 'deepak.tiwari@prescure.com',
    specialty: 'General Physician',
    experience: 12,
    rating: 4.5,
    reviewCount: 156,
    location: {
      address: 'Bansal Hospital, Bawadiya Kalan',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462038',
      coordinates: { type: 'Point', coordinates: [77.4126, 23.2599] }
    },
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '18:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '18:00' },
      { day: 'Friday', startTime: '09:00', endTime: '18:00' }
    ],
    consultationFee: 700,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    about: 'General physician with expertise in diabetes management and preventive care.',
    education: ['MBBS from Gandhi Medical College Bhopal', 'MD Internal Medicine from AIIMS Bhopal'],
    languages: ['Hindi', 'English'],
    phone: '+91-9876543221'
  },

  // Indore
  {
    name: 'Dr. Kavita Jain',
    email: 'kavita.jain@prescure.com',
    specialty: 'Dermatologist',
    experience: 9,
    rating: 4.6,
    reviewCount: 112,
    location: {
      address: 'Choithram Hospital, Manik Bagh Road',
      city: 'Indore',
      state: 'Madhya Pradesh',
      zipCode: '452014',
      coordinates: { type: 'Point', coordinates: [75.8577, 22.7196] }
    },
    availability: [
      { day: 'Tuesday', startTime: '10:00', endTime: '18:00' },
      { day: 'Thursday', startTime: '10:00', endTime: '18:00' },
      { day: 'Saturday', startTime: '10:00', endTime: '16:00' }
    ],
    consultationFee: 1000,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
    about: 'Dermatologist specializing in acne treatment and anti-aging procedures.',
    education: ['MBBS from MGM Medical College Indore', 'MD Dermatology from AIIMS Delhi'],
    languages: ['Hindi', 'English'],
    phone: '+91-9876543222'
  },

  // Nagpur
  {
    name: 'Dr. Rahul Deshmukh',
    email: 'rahul.deshmukh@prescure.com',
    specialty: 'Neurologist',
    experience: 15,
    rating: 4.8,
    reviewCount: 189,
    location: {
      address: 'Kingsway Hospitals, Kingsway',
      city: 'Nagpur',
      state: 'Maharashtra',
      zipCode: '440001',
      coordinates: { type: 'Point', coordinates: [79.0882, 21.1458] }
    },
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00' }
    ],
    consultationFee: 1500,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
    about: 'Neurologist with expertise in movement disorders and epilepsy treatment.',
    education: ['MBBS from GMC Nagpur', 'DM Neurology from AIIMS Delhi'],
    languages: ['Marathi', 'Hindi', 'English'],
    phone: '+91-9876543223'
  },

  // Surat
  {
    name: 'Dr. Nisha Patel',
    email: 'nisha.patel@prescure.com',
    specialty: 'Pediatrician',
    experience: 11,
    rating: 4.7,
    reviewCount: 167,
    location: {
      address: 'Kiran Hospital, Majura Gate',
      city: 'Surat',
      state: 'Gujarat',
      zipCode: '395002',
      coordinates: { type: 'Point', coordinates: [72.8311, 21.1702] }
    },
    availability: [
      { day: 'Monday', startTime: '08:00', endTime: '16:00' },
      { day: 'Tuesday', startTime: '08:00', endTime: '16:00' },
      { day: 'Thursday', startTime: '08:00', endTime: '16:00' },
      { day: 'Saturday', startTime: '08:00', endTime: '14:00' }
    ],
    consultationFee: 850,
    image: 'https://images.unsplash.com/photo-1594824475317-8b7b0c8b8b8b?w=300&h=300&fit=crop&crop=face',
    about: 'Pediatrician with focus on child immunization and growth monitoring.',
    education: ['MBBS from GMERS Medical College Surat', 'MD Pediatrics from BJ Medical College Ahmedabad'],
    languages: ['Gujarati', 'Hindi', 'English'],
    phone: '+91-9876543224'
  }
];

module.exports = indianDoctors;