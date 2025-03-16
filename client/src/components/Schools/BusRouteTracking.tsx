import React, { useState, useEffect } from 'react';
import { useBusTracking } from './BusTrackingContext';
import BusMap from './busmap';
import { Plus, Edit, Trash2, Search, MapPin, Clock, Users, Eye, AlertTriangle } from 'lucide-react';

// Define a type for the extended bus data needed for the map
interface BusMapData {
  id: string;
  location: [number, number]; // Latitude and longitude
  route?: Array<[number, number]>; // Route as array of [lat, lng] points
  routeNumber: string;
  driverName?: string;
  speed?: number;
  fuelLevel?: number;
  nextStop?: string;
  estimatedArrival?: string;
  status: 'active' | 'maintenance' | 'inactive';
}

// Define interfaces for route-related data
interface RouteStop {
  id: string;
  name: string;
  location: string;
  sequence: number;
  estimatedTime: string;
  studentsCount: number;
}

interface RouteSchedule {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  weekdays: string[];
}

interface Route {
  id: string;
  name: string;
  startLocation: string;
  endLocation: string;
  distanceKm: number;
  estimatedDuration: number;
  assignedBus?: string;
  stops: RouteStop[];
  schedule: RouteSchedule[];
}

const BusRouteTracking: React.FC = () => {
  const {
    routes,
    buses,
    students,
    addRoute,
    updateRoute,
    deleteRoute,
    getStudentsByRoute,
    loading,
    error
  } = useBusTracking();

  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [busMapData, setBusMapData] = useState<BusMapData[]>([]);
  const [selectedBusForMap, setSelectedBusForMap] = useState<BusMapData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewStopsModalOpen, setIsViewStopsModalOpen] = useState(false);
  const [isMapViewVisible, setIsMapViewVisible] = useState(false);

  // Prepare bus data for the map
  useEffect(() => {
    // Convert buses with location data to the format needed for the map
    const mapData: BusMapData[] = buses
      .filter(bus => bus.lastLocation) // Only include buses with location data
      .map(bus => {
        const busRoute = routes.find(r => r.id === bus.assignedRoute);
        const busDriver = bus.assignedDriver ? { name: 'Driver Name' } : undefined; // In a real app, you'd get the actual driver details
        
        // Create a simple route path for demonstration
        // In a real app, this would come from your backend with actual GPS coordinates
        let routePath: Array<[number, number]> | undefined = undefined;
        
        if (busRoute) {
          // Create a simple route path based on start and end locations
          // This is just for demonstration - real routes would have actual GPS coordinates
          const startLat = bus.lastLocation?.lat || 0;
          const startLng = bus.lastLocation?.lng || 0;
          
          // Simulate a route path with a few points
          routePath = [
            [startLat, startLng],
            [startLat + 0.01, startLng + 0.01],
            [startLat + 0.02, startLng + 0.02],
            [startLat + 0.03, startLng + 0.015],
          ];
        }
        
        return {
          id: bus.id,
          location: [bus.lastLocation?.lat || 0, bus.lastLocation?.lng || 0],
          route: routePath,
          routeNumber: busRoute?.name || 'Unassigned',
          driverName: busDriver?.name,
          speed: Math.floor(Math.random() * 60), // Simulated speed
          fuelLevel: Math.floor(Math.random() * 100), // Simulated fuel level
          nextStop: busRoute?.stops[0]?.name,
          estimatedArrival: '10 minutes',
          status: bus.status
        };
      });
    
    setBusMapData(mapData);
  }, [buses, routes]);

  // Filter routes based on search query
  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.endLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRoute = async (formData: Omit<Route, 'id'>) => {
    await addRoute(formData);
    setIsAddModalOpen(false);
  };

  const handleEditRoute = async (id: string, formData: Partial<Route>) => {
    await updateRoute(id, formData);
    setIsEditModalOpen(false);
  };

  const handleDeleteRoute = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      await deleteRoute(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Routes & Tracking</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsMapViewVisible(!isMapViewVisible)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <MapPin className="h-4 w-4 mr-2" />
            {isMapViewVisible ? 'Hide Map' : 'Show Map'}
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Route
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search routes by name or location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Bus Tracking Map */}
      {isMapViewVisible && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Live Bus Tracking</h3>
            <div className="flex space-x-2">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={selectedBusForMap?.id || ''}
                onChange={(e) => {
                  const busId = e.target.value;
                  const bus = busMapData.find(b => b.id === busId);
                  setSelectedBusForMap(bus || null);
                }}
              >
                <option value="">All Buses</option>
                {busMapData.map(bus => (
                  <option key={bus.id} value={bus.id}>
                    {bus.routeNumber} - {bus.status === 'active' ? 'Active' : bus.status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="h-[500px] rounded-md overflow-hidden">
            <BusMap 
              buses={busMapData} 
              selectedBus={selectedBusForMap} 
              onBusSelect={setSelectedBusForMap} 
            />
          </div>
          <div className="flex justify-between mt-4">
            <div className="flex space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-600">Active</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm text-gray-600">Inactive</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm text-gray-600">Maintenance</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Click on a bus marker to view details
            </div>
          </div>
        </div>
      )}

      {/* Routes list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="text-center py-10">
            <div className="spinner"></div>
            <p className="mt-2 text-sm text-gray-500">Loading routes...</p>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500">No routes found. Add a new route to get started.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredRoutes.map((route) => {
              const assignedBus = buses.find(b => b.id === route.assignedBus);
              const routeStudents = getStudentsByRoute(route.id);
              const activeBus = busMapData.find(b => b.routeNumber === route.name && b.status === 'active');
              
              return (
                <li key={route.id}>
                  <div className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="truncate">
                          <div className="flex text-sm">
                            <p className="font-medium text-indigo-600 truncate">{route.name}</p>
                          </div>
                          <div className="mt-2 flex">
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <span>{route.startLocation} to {route.endLocation}</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                          {activeBus && (
                            <button
                              onClick={() => {
                                setSelectedBusForMap(activeBus);
                                setIsMapViewVisible(true);
                              }}
                              className="ml-3 px-2 py-1 text-xs font-medium rounded bg-green-50 text-green-700 hover:bg-green-100"
                            >
                              <Eye className="h-3 w-3 mr-1 inline" />
                              Track
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedRoute(route);
                              setIsViewStopsModalOpen(true);
                            }}
                            className="ml-3 px-2 py-1 text-xs font-medium rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                          >
                            View Stops
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRoute(route);
                              setIsEditModalOpen(true);
                            }}
                            className="ml-3 text-gray-500 hover:text-indigo-600"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoute(route.id)}
                            className="ml-3 text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex space-x-6">
                          <p className="flex items-center text-sm text-gray-500">
                            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {route.estimatedDuration} mins ({route.distanceKm} km)
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {routeStudents.length} students
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          {assignedBus ? (
                            <span>
                              Assigned Bus: <span className="font-medium">{assignedBus.registrationNumber}</span>
                            </span>
                          ) : (
                            <span className="text-yellow-600">No bus assigned</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Route Stops Modal */}
      {selectedRoute && isViewStopsModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Route Stops - {selectedRoute.name}</h3>
                <button 
                  onClick={() => setIsViewStopsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sequence
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stop Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Est. Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedRoute.stops.sort((a: RouteStop, b: RouteStop) => a.sequence - b.sequence).map((stop: RouteStop) => (
                    <tr key={stop.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stop.sequence}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stop.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stop.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stop.estimatedTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stop.studentsCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <h4 className="text-md font-medium text-gray-900 mb-3">Schedule</h4>
              <div className="space-y-3">
                {selectedRoute.schedule.map((schedule: RouteSchedule) => (
                  <div key={schedule.id} className="bg-gray-50 p-3 rounded-md">
                    <div className="font-medium">{schedule.title}</div>
                    <div className="text-sm text-gray-500">
                      Time: {schedule.startTime} - {schedule.endTime}
                    </div>
                    <div className="text-sm text-gray-500">
                      Days: {schedule.weekdays.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Route Modal - Implementation omitted for brevity */}
      {/* Edit Route Modal - Implementation omitted for brevity */}
    </div>
  );
};

export default BusRouteTracking; 