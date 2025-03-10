import React, { useState, useEffect } from 'react';
import BusMap from './BusMap';
import FilterPanel from './FilterPanel';
import { Bus, BusFilter } from '../../types';

const BusTracking: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [filters, setFilters] = useState<BusFilter>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated real-time updates
    const fetchBusData = () => {
      // Simulate API call
      const mockBuses: Bus[] = [
        {
          id: 1,
          routeNumber: 'R001',
          driverName: 'John Doe',
          location: [28.7041, 77.1025],
          status: 'running',
          lastUpdated: new Date().toISOString(),
          speed: 45,
          fuelLevel: 75,
          capacity: 40,
          occupancy: 32,
          nextStop: 'Central Station',
          estimatedArrival: '10:30 AM',
          route: [[28.7041, 77.1025], [28.7051, 77.1035], [28.7061, 77.1045]]
        },
        // Add more mock buses
      ];

      setBuses(mockBuses);
      setLoading(false);
    };

    fetchBusData();
    const interval = setInterval(fetchBusData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredBuses = React.useMemo(() => {
    return buses.filter(bus => {
      if (filters.status && bus.status !== filters.status) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return bus.routeNumber.toLowerCase().includes(search) ||
               bus.driverName.toLowerCase().includes(search);
      }
      return true;
    });
  }, [buses, filters]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <FilterPanel filters={filters} onFilterChange={setFilters} />
          <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Statistics</h2>
            <div className="space-y-2">
              <p>Total Buses: {buses.length}</p>
              <p>Active Buses: {buses.filter(b => b.status === 'running').length}</p>
              <p>In Maintenance: {buses.filter(b => b.status === 'maintenance').length}</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-3">
          <BusMap
            buses={filteredBuses}
            selectedBus={selectedBus}
            onBusSelect={setSelectedBus}
          />
        </div>
      </div>
    </div>
  );
};

export default BusTracking;