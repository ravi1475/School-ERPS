import React, { useState } from 'react';
import { useBusTracking, Bus } from './BusTrackingContext';
import { Plus, Edit, Trash2, Search, AlertTriangle } from 'lucide-react';

const BusFleetManagement: React.FC = () => {
  const { 
    buses, 
    drivers, 
    addBus, 
    updateBus, 
    deleteBus, 
    loading, 
    error 
  } = useBusTracking();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter buses based on search query
  const filteredBuses = buses.filter(bus => 
    bus.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddBus = async (formData: Omit<Bus, 'id'>) => {
    await addBus(formData);
    setIsAddModalOpen(false);
  };
  
  const handleEditBus = async (id: string, formData: Partial<Bus>) => {
    await updateBus(id, formData);
    setIsEditModalOpen(false);
  };
  
  const handleDeleteBus = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      await deleteBus(id);
    }
  };
  
  // Bus status badge styling
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Bus Fleet Management</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Bus
        </button>
      </div>
      
      {/* Search and filter bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search buses by registration, model, or status"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="ml-4">
            <select 
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              defaultValue=""
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
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
      
      {/* Bus list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="text-center py-10">
            <div className="spinner"></div>
            <p className="mt-2 text-sm text-gray-500">Loading buses...</p>
          </div>
        ) : filteredBuses.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500">No buses found. Add a new bus to get started.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredBuses.map((bus) => (
              <li key={bus.id}>
                <div className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="truncate">
                        <div className="flex text-sm">
                          <p className="font-medium text-indigo-600 truncate">{bus.registrationNumber}</p>
                          <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                            {bus.make} {bus.model}
                          </p>
                        </div>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{bus.capacity} seats</span>
                            <span className="mx-2">•</span>
                            <span>{bus.fuelType}</span>
                            <span className="mx-2">•</span>
                            <span>{bus.manufactureYear}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(bus.status)}`}>
                          {bus.status.charAt(0).toUpperCase() + bus.status.slice(1)}
                        </span>
                        <button 
                          onClick={() => {
                            setSelectedBus(bus);
                            setIsEditModalOpen(true);
                          }}
                          className="ml-3 text-gray-500 hover:text-indigo-600"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteBus(bus.id)}
                          className="ml-3 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {bus.assignedDriver && 
                            <>
                              <span className="font-medium">Driver:</span>
                              <span className="ml-1">
                                {drivers.find(d => d.id === bus.assignedDriver)?.name || 'Unknown'}
                              </span>
                            </>
                          }
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        {bus.lastLocation && (
                          <span>
                            Last tracked: {bus.lastLocation.lat.toFixed(4)}, {bus.lastLocation.lng.toFixed(4)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Bus form modals would be implemented here */}
      {/* For brevity, I've omitted the modal implementations which would contain forms for adding/editing buses */}
    </div>
  );
};

export default BusFleetManagement; 