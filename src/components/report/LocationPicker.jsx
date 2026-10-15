import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Crosshair, AlertCircle } from 'lucide-react';

// Custom SVG map pin for high-res retina display
const createPinIcon = (color = '#2563eb') => {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div style="position: relative; width: 32px; height: 32px; transform: translate(-50%, -100%);">
        <svg viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="1.5" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); width: 32px; height: 32px;">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5" fill="#ffffff"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [0, 0]
  });
};

// Component to handle map clicks and move pin
function LocationMarker({ position, setPosition, setLocationName }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      // Approximate reverse geocode simulation or simple coordinate representation
      setLocationName((prev) => (prev ? prev : `Near Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`));
    }
  });

  return position ? <Marker position={position} icon={createPinIcon('#2563eb')} /> : null;
}

// Controller to fly to position when updated
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 14);
    }
  }, [center, map]);
  return null;
}

export function LocationPicker({
  locationName,
  setLocationName,
  latitude,
  setLatitude,
  longitude,
  setLongitude
}) {
  const defaultCenter = [37.7749, -122.4194]; // Downtown reference
  const currentPos = latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : defaultCenter;
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState('');

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setGeoError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        if (!locationName) {
          setLocationName(`Current GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        }
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setGeoError('Could not retrieve location. Please click the map or type address manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSetPosition = ([lat, lng]) => {
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
  };

  return (
    <div className="space-y-3">
      {/* Address / Location Name Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Location Name or Address *</span>
          </span>
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting...' : 'Use My Location'}</span>
          </button>
        </label>
        <input
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          placeholder="e.g. 5th Avenue & Pine Street, in front of Metro Gate 2"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
          required
        />
        {geoError && (
          <p className="mt-1 text-[11px] text-amber-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>{geoError}</span>
          </p>
        )}
      </div>

      {/* Interactive Map Picker */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span className="font-medium flex items-center gap-1">
            <Crosshair className="w-3.5 h-3.5 text-slate-400" />
            <span>Click map to place exact pin (optional coordinates):</span>
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            {latitude && longitude ? `${Number(latitude).toFixed(4)}, ${Number(longitude).toFixed(4)}` : 'Pin not set'}
          </span>
        </div>

        <div className="h-48 w-full rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner">
          <MapContainer
            center={currentPos}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ChangeView center={currentPos} />
            <LocationMarker
              position={latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : null}
              setPosition={handleSetPosition}
              setLocationName={setLocationName}
            />
          </MapContainer>
        </div>
      </div>

      {/* Lat / Long Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={latitude || ''}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="37.7749"
            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono bg-slate-50 text-slate-700"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={longitude || ''}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="-122.4194"
            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono bg-slate-50 text-slate-700"
          />
        </div>
      </div>
    </div>
  );
}
