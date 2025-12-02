import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Doctor } from '../types';

interface LocationMapProps {
  doctors: Doctor[];
  userLocation?: { lat: number; lng: number } | null;
}

const LocationMap: React.FC<LocationMapProps> = ({ doctors, userLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || doctors.length === 0) return;

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      const center = userLocation
        ? { lat: userLocation.lat, lng: userLocation.lng }
        : doctors[0]?.location.coordinates?.coordinates
        ? { lat: doctors[0].location.coordinates.coordinates[1], lng: doctors[0].location.coordinates.coordinates[0] }
        : { lat: 28.6139, lng: 77.2090 };

      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#e3f2fd' }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#ffffff' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#e8f5e9' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // User location marker with pulse animation
      if (userLocation) {
        const userMarker = new window.google.maps.Marker({
          position: { lat: userLocation.lat, lng: userLocation.lng },
          map,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#3B82F6" opacity="0.3"/>
                <circle cx="20" cy="20" r="12" fill="#3B82F6" opacity="0.6"/>
                <circle cx="20" cy="20" r="6" fill="#1D4ED8" stroke="white" stroke-width="2"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 20)
          },
          title: 'Your Location',
          zIndex: 1000
        });

        const userInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; font-family: system-ui, -apple-system, sans-serif;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <div style="width: 8px; height: 8px; background: #3B82F6; border-radius: 50%;"></div>
                <h3 style="font-weight: 600; font-size: 14px; margin: 0; color: #1e293b;">Your Location</h3>
              </div>
              <p style="font-size: 12px; color: #64748b; margin: 0;">You are here</p>
            </div>
          `
        });

        userMarker.addListener('click', () => {
          userInfoWindow.open(map, userMarker);
        });
      }

      // Doctor markers with custom icons
      doctors.forEach((doctor, index) => {
        if (doctor.location.coordinates?.coordinates) {
          const position = {
            lat: doctor.location.coordinates.coordinates[1],
            lng: doctor.location.coordinates.coordinates[0]
          };

          const marker = new window.google.maps.Marker({
            position,
            map,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 0C9.4 0 4 5.4 4 12c0 8 12 28 12 28s12-20 12-28c0-6.6-5.4-12-12-12z" fill="#EF4444"/>
                  <circle cx="16" cy="12" r="6" fill="white"/>
                  <text x="16" y="16" font-size="10" font-weight="bold" fill="#EF4444" text-anchor="middle">+</text>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 40),
              anchor: new window.google.maps.Point(16, 40)
            },
            title: `Dr. ${doctor.name}`,
            animation: window.google.maps.Animation.DROP
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 16px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
                <div style="display: flex; align-items: start; gap: 12px; margin-bottom: 12px;">
                  <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #3B82F6, #8B5CF6); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px; flex-shrink: 0;">
                    ${doctor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style="flex: 1;">
                    <h3 style="font-weight: 700; font-size: 16px; margin: 0 0 4px 0; color: #1e293b;">Dr. ${doctor.name}</h3>
                    <div style="display: inline-block; background: linear-gradient(135deg, #EEF2FF, #E0E7FF); color: #4F46E5; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; margin-bottom: 8px;">
                      ${doctor.specialty}
                    </div>
                  </div>
                </div>
                <div style="background: #F8FAFC; border-radius: 8px; padding: 10px; margin-bottom: 8px;">
                  <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                    <span style="font-size: 14px;">📍</span>
                    <p style="font-size: 12px; color: #475569; margin: 0; line-height: 1.4;">${doctor.location.address}</p>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 14px;">🏙️</span>
                    <p style="font-size: 12px; color: #475569; margin: 0;">${doctor.location.city}, ${doctor.location.state}</p>
                  </div>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                  <div style="display: flex; align-items: center; gap: 4px;">
                    <span style="color: #F59E0B; font-size: 14px;">⭐</span>
                    <span style="font-size: 13px; font-weight: 600; color: #1e293b;">${doctor.rating}</span>
                  </div>
                  <div style="width: 1px; height: 12px; background: #E2E8F0;"></div>
                  <div style="font-size: 12px; color: #64748b;">${doctor.experience}y exp</div>
                  <div style="width: 1px; height: 12px; background: #E2E8F0;"></div>
                  <div style="font-size: 13px; font-weight: 600; color: #10B981;">₹${doctor.consultationFee}</div>
                </div>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        }
      });

      // Fit bounds to show all markers
      if (doctors.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        if (userLocation) {
          bounds.extend({ lat: userLocation.lat, lng: userLocation.lng });
        }
        doctors.forEach(doctor => {
          if (doctor.location.coordinates?.coordinates) {
            bounds.extend({
              lat: doctor.location.coordinates.coordinates[1],
              lng: doctor.location.coordinates.coordinates[0]
            });
          }
        });
        map.fitBounds(bounds);
        
        // Adjust zoom if too close
        const listener = window.google.maps.event.addListener(map, 'idle', () => {
          if (map.getZoom() > 15) map.setZoom(15);
          window.google.maps.event.removeListener(listener);
        });
      }
    };

    loadGoogleMaps();
  }, [doctors, userLocation]);

  return (
    <div className="h-80 w-full rounded-lg overflow-hidden shadow-lg border border-gray-200" ref={mapRef}>
      {/* Map will be rendered here */}
    </div>
  );
};

export default LocationMap;