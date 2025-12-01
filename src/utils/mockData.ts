import { Doctor, Review } from '../types';

export const mockDoctors: Doctor[] = [
  {
    _id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    rating: 4.8,
    reviewCount: 127,
    experience: 12,
    location: {
      address: '123 Medical Center Dr',
      city: 'New York, NY',
      state: 'NY',
      zipCode: '10001',
      coordinates: {
        type: 'Point',
        coordinates: [-74.0060, 40.7128]
      }
    },
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00' }
    ],
    consultationFee: 200,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
    about: 'Experienced cardiologist specializing in preventive cardiology and heart disease management.',
    education: ['MD from Harvard Medical School', 'Residency at Johns Hopkins'],
    languages: ['English', 'Spanish'],
    phone: '+1-555-0101'
  },
  {
    _id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Dermatologist',
    rating: 4.9,
    reviewCount: 89,
    experience: 8,
    location: {
      address: '456 Health Plaza',
      city: 'Los Angeles, CA',
      state: 'CA',
      zipCode: '90210',
      coordinates: {
        type: 'Point',
        coordinates: [-118.2437, 34.0522]
      }
    },
    availability: [
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'Saturday', startTime: '09:00', endTime: '15:00' }
    ],
    consultationFee: 150,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    about: 'Board-certified dermatologist with expertise in medical and cosmetic dermatology.',
    education: ['MD from Stanford University', 'Dermatology Residency at UCSF'],
    languages: ['English', 'Mandarin'],
    phone: '+1-555-0102'
  },
  {
    _id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrician',
    rating: 4.7,
    reviewCount: 156,
    experience: 15,
    location: {
      address: '789 Children\'s Way',
      city: 'Chicago, IL',
      state: 'IL',
      zipCode: '60601',
      coordinates: {
        type: 'Point',
        coordinates: [-87.6298, 41.8781]
      }
    },
    availability: [
      { day: 'Monday', startTime: '08:00', endTime: '16:00' },
      { day: 'Tuesday', startTime: '08:00', endTime: '16:00' },
      { day: 'Wednesday', startTime: '08:00', endTime: '16:00' },
      { day: 'Thursday', startTime: '08:00', endTime: '16:00' },
      { day: 'Friday', startTime: '08:00', endTime: '16:00' }
    ],
    consultationFee: 120,
    image: 'https://images.unsplash.com/photo-1594824475317-8b7b0c8b8b8b?w=300&h=300&fit=crop&crop=face',
    about: 'Compassionate pediatrician dedicated to providing comprehensive care for children.',
    education: ['MD from University of Chicago', 'Pediatrics Residency at Boston Children\'s'],
    languages: ['English', 'Spanish', 'Portuguese'],
    phone: '+1-555-0103'
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    doctorId: '1',
    patientName: 'John D.',
    rating: 5,
    comment: 'Excellent doctor! Very thorough and caring.',
    date: '2024-01-15'
  },
  {
    id: '2',
    doctorId: '1',
    patientName: 'Maria S.',
    rating: 4,
    comment: 'Great experience, would recommend.',
    date: '2024-01-10'
  }
];

export const specialties = [
  'All Specialties',
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Neurologist',
  'Orthopedic',
  'Psychiatrist',
  'General Physician'
];