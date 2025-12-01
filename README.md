# SehatNama - Healthcare Platform

Find and book appointments with doctors across India.

## Features

- Search doctors by specialty, location, or name
- Location-based search with distance calculation
- Book, view, and cancel appointments
- User authentication and profiles
- Doctor ratings and reviews

## Tech Stack

**Frontend:** React 18, TypeScript, Tailwind CSS  
**Backend:** Node.js, Express, MongoDB, JWT

## Installation

1. **Clone repository**
```bash
git clone https://github.com/Rizwankhan0001/SehatNama.git
cd SehatNama
```

2. **Install dependencies**
```bash
npm install
cd backend && npm install
```

3. **Setup environment**
Create `.env` in backend folder:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prescure_health
JWT_SECRET=your_secret_key
```

4. **Start MongoDB**
```bash
mongod
```

5. **Seed database**
```bash
npm run seed
```

6. **Run application**
```bash
npm run start:all
```

Access at: http://localhost:3000

## API Endpoints

**Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/profile`  
**Doctors:** `/api/doctors`, `/api/doctors/:id`  
**Appointments:** `/api/appointments`, `/api/appointments/:id/cancel`

## License

MIT
