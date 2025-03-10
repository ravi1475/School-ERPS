import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Bus } from '../../types';

interface BusMapProps {
  buses: Bus[];
  selectedBus: Bus | null;
  onBusSelect: (bus: Bus) => void;
}

const BusMap: React.FC<BusMapProps> = ({ buses, selectedBus, onBusSelect }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (selectedBus && mapRef.current) {
      mapRef.current.setView(selectedBus.location, 15);
    }
  }, [selectedBus]);

  return (
    <MapContainer
      ref={mapRef}
      center={[28.7041, 77.1025]}
      zoom={13}
      className="h-[700px] rounded-lg shadow-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {buses.map((bus) => (
        <React.Fragment key={bus.id}>
          <Marker
            position={bus.location}
            eventHandlers={{ click: () => onBusSelect(bus) }}
          >
            <Popup>
              <BusPopupContent bus={bus} />
            </Popup>
          </Marker>
          {bus.route && (
            <Polyline
              positions={bus.route}
              color={bus.status === 'running' ? '#22c55e' : '#ef4444'}
            />
          )}
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

const BusPopupContent: React.FC<{ bus: Bus }> = ({ bus }) => (
  <div className="p-3">
    <h3 className="font-bold text-lg">Bus {bus.routeNumber}</h3>
    <div className="grid grid-cols-2 gap-2 mt-2">
      <div>
        <p className="text-sm font-semibold">Driver</p>
        <p className="text-sm">{bus.driverName}</p>
      </div>
      <div>
        <p className="text-sm font-semibold">Status</p>
        <p className="text-sm">{bus.status}</p>
      </div>
      <div>
        <p className="text-sm font-semibold">Speed</p>
        <p className="text-sm">{bus.speed} km/h</p>
      </div>
      <div>
        <p className="text-sm font-semibold">Fuel</p>
        <p className="text-sm">{bus.fuelLevel}%</p>
      </div>
    </div>
    <div className="mt-2">
      <p className="text-sm font-semibold">Next Stop</p>
      <p className="text-sm">{bus.nextStop}</p>
      <p className="text-sm text-gray-500">ETA: {bus.estimatedArrival}</p>
    </div>
  </div>
);

export default BusMap;