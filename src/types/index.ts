export interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  experience: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      type: string;
      coordinates: [number, number];
    };
  };
  availability: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  consultationFee: number;
  image: string;
  about: string;
  education: string[];
  languages: string[];
  phone: string;
}

export interface Review {
  id: string;
  doctorId: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface SearchFilters {
  specialty: string;
  location: string;
  rating: number;
  maxDistance: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'patient' | 'doctor';
  dateOfBirth?: Date;
  gender?: 'Male' | 'Female' | 'Other';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    full: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory?: Array<{
    condition: string;
    diagnosedDate: Date;
    notes: string;
  }>;
  allergies?: string[];
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  disease?: string;
  // Doctor-specific fields
  specialization?: string;
  experience?: number;
  consultationFee?: number;
  education?: string[];
  languages?: string[];
  location?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}