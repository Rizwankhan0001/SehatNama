import React from 'react';
import { MapPin } from 'lucide-react';
import { Doctor } from '../types';

interface LocationMapProps {
  doctors: Doctor[];
  userLocation?: { lat: number; lng: number } | null;
}

const LocationMap: React.FC<LocationMapProps> = ({ doctors, userLocation }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Locations</h3>
      
      {/* Placeholder for actual map integration */}
      <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center relative">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Interactive Map</p>
          <p className="text-sm text-gray-400">Integrate with Google Maps or Mapbox</p>
        </div>
        
        {/* Mock location pins */}
        {doctors.slice(0, 3).map((doctor, index) => (
          <div
            key={doctor._id}
            className={`absolute bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold`}
            style={{
              top: `${20 + index * 30}%`,
              left: `${30 + index * 20}%`
            }}
          >
            {index + 1}
          </div>
        ))}
        
        {userLocation && (
          <div
            className="absolute bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
            style={{ top: '50%', left: '50%' }}
          >
            You
          </div>
        )}
      </div>
      
      <div className="mt-4 space-y-2">
        {doctors.slice(0, 3).map((doctor, index) => (
          <div key={doctor._id} className="flex items-center text-sm">
            <div className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">
              {index + 1}
            </div>
            <div>
              <p className="font-medium">{doctor.name}</p>
              <p className="text-gray-600">{doctor.location.address}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationMap;