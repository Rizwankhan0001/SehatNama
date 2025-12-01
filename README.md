# SehatNama - Full-Stack Healthcare Platform

A comprehensive healthcare platform for finding and booking appointments with doctors, featuring location-based search, doctor ratings, and real-time appointment booking.

## 🚀 Features

### ✨ Core Features
- **Real-time Doctor Search**: Search doctors by name, specialty, or location
- **Location-Based Search**: Find doctors near you using geolocation
- **Doctor Ratings & Reviews**: View and submit ratings and reviews
- **Appointment Booking**: Book, view, and cancel appointments
- **User Authentication**: Secure login and registration
- **Responsive Design**: Works on all devices

### 🔍 Advanced Search
- Filter by specialty, location, rating
- Sort by rating, distance, experience, or consultation fee
- Real-time search with pagination
- Location-based distance calculation

### 📱 User Features
- User profiles with medical history
- Appointment management
- Health records tracking
- Emergency contact information

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Fetch API** for HTTP requests

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

### Quick Start

1. **Clone and install:**
```bash
git clone <repository-url>
cd SehatNama
```

2. **Run installation script:**
```bash
# On Windows
install.bat

# Or manually:
npm install
cd backend && npm install
```

3. **Start MongoDB:**
Make sure MongoDB is running on `localhost:27017`

4. **Seed the database:**
```bash
npm run seed
```

5. **Start the application:**
```bash
# Start both frontend and backend
npm run start:all

# Or start separately:
npm run start:backend  # Backend on port 5000
npm run start:frontend # Frontend on port 3000
```

6. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 🗄 Database Schema

### Collections
- **Users**: Patient information and authentication
- **Doctors**: Doctor profiles, specialties, and availability
- **Appointments**: Booking information and status
- **Reviews**: Patient reviews and ratings

### Sample Data
The seed script creates:
- 5 sample doctors across different specialties
- 1 test user (email: john.doe@example.com, password: password123)

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Doctors
- `GET /api/doctors` - Search doctors with filters
- `GET /api/doctors/:id` - Get doctor details
- `GET /api/doctors/specialties` - Get all specialties

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - Get user appointments
- `GET /api/appointments/slots` - Get available time slots
- `PUT /api/appointments/:id/cancel` - Cancel appointment

## 🌟 Key Features Implementation

### Location-Based Search
```javascript
// Frontend geolocation
navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords;
  // Send to API for distance-based sorting
});

// Backend MongoDB geospatial query
query['location.coordinates'] = {
  $near: {
    $geometry: { type: 'Point', coordinates: [lng, lat] },
    $maxDistance: radius * 1000
  }
};
```

### Real-time Search
- Debounced search input
- API-based filtering and sorting
- Pagination support
- Loading states

### Authentication Flow
- JWT-based authentication
- Secure password hashing
- Protected routes
- Token storage in localStorage

## 📱 Usage

### For Patients
1. **Sign up/Login** to create an account
2. **Search doctors** by specialty, location, or name
3. **View doctor profiles** with ratings and reviews
4. **Book appointments** by selecting available time slots
5. **Manage appointments** - view, reschedule, or cancel

### Search Functionality
- Use the search bar to find doctors by name or condition
- Select specialty from dropdown
- Enter location or use "Use my location" button
- Results are automatically sorted by relevance and distance

## 🔒 Security Features
- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Environment variable configuration

## 🚀 Deployment

### Environment Variables
Create `.env` file in backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prescure_health
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=production
```

### Production Build
```bash
npm run build
```

## 🤝 Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License
This project is licensed under the MIT License.

## 🆘 Support
For support, email support@sehetnama.com or create an issue in the repository.