import React, { useState } from 'react';
import { useBusTracking } from './BusTrackingContext';
import { Plus, Edit, Trash2, Search, Calendar, Wrench, Clock, DollarSign, AlertTriangle } from 'lucide-react';

// Define the maintenance record interface using the context type
interface MaintenanceRecord {
  id: string;
  busId: string;
  date: string;
  type: 'regular' | 'repair' | 'inspection';
  description: string;
  cost: number;
  odometer: number;
  nextDueDate?: string;
  completedBy: string;
  status: 'scheduled' | 'in-progress' | 'completed';
}

const MaintenanceManagement: React.FC = () => {
  const {
    maintenanceRecords,
    buses,
    addMaintenanceRecord,
    updateMaintenanceRecord,
    deleteMaintenanceRecord,
    loading,
    error
  } = useBusTracking();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Filter records based on search query and status
  const filteredRecords = maintenanceRecords.filter(record => {
    const matchesSearch = 
      buses.find(b => b.id === record.busId)?.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus ? record.status === filterStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddRecord = async (formData: Omit<MaintenanceRecord, 'id'>) => {
    await addMaintenanceRecord(formData);
    setIsAddModalOpen(false);
  };

  const handleEditRecord = async (id: string, formData: Partial<MaintenanceRecord>) => {
    await updateMaintenanceRecord(id, formData);
    setIsEditModalOpen(false);
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      await deleteMaintenanceRecord(id);
    }
  };

  // Get bus details for a record
  const getBusDetails = (busId: string) => {
    return buses.find(bus => bus.id === busId);
  };

  // Get status badge styling
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get type badge styling
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'regular':
        return 'bg-indigo-100 text-indigo-800';
      case 'repair':
        return 'bg-red-100 text-red-800';
      case 'inspection':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate if maintenance is overdue
  const isOverdue = (record: MaintenanceRecord) => {
    if (record.status === 'completed') return false;
    
    const today = new Date();
    const dueDate = new Date(record.date);
    
    return today > dueDate;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Maintenance Management</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Maintenance
        </button>
      </div>
      
      {/* Search and filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search by bus number, description or type"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <select 
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
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
      
      {/* Overdue maintenance alerts */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Overdue Maintenance</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredRecords.filter(record => isOverdue(record)).length > 0 ? (
              filteredRecords.filter(record => isOverdue(record)).map(record => {
                const bus = getBusDetails(record.busId);
                return (
                  <div key={record.id} className="flex items-start p-4 bg-red-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {bus?.registrationNumber} - {record.description}
                      </h3>
                      <div className="mt-1 text-sm text-red-700">
                        <p>
                          Scheduled for {new Date(record.date).toLocaleDateString()}. 
                          {record.status === 'in-progress' ? ' Currently in progress.' : ' Not started yet.'}
                        </p>
                      </div>
                      <div className="mt-2">
                        <button 
                          onClick={() => {
                            setSelectedRecord(record);
                            setIsEditModalOpen(true);
                          }}
                          className="text-sm font-medium text-red-800 hover:text-red-900"
                        >
                          Update Status
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No overdue maintenance records.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Maintenance records list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Maintenance Records</h3>
        </div>
        {loading ? (
          <div className="text-center py-10">
            <div className="spinner"></div>
            <p className="mt-2 text-sm text-gray-500">Loading maintenance records...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500">No maintenance records found.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredRecords.map((record) => {
              const bus = getBusDetails(record.busId);
              
              return (
                <li key={record.id}>
                  <div className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-indigo-600">
                            {bus?.registrationNumber} - {record.description}
                          </div>
                          <div className="mt-1 flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadgeColor(record.type)}`}>
                              {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                            </span>
                            <span className="mx-2">•</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(record.status)}`}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1).replace('-', ' ')}
                            </span>
                            {isOverdue(record) && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Overdue
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                          <button 
                            onClick={() => {
                              setSelectedRecord(record);
                              setIsEditModalOpen(true);
                            }}
                            className="ml-3 text-gray-500 hover:text-indigo-600"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteRecord(record.id)}
                            className="ml-3 text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex space-x-6">
                          <p className="flex items-center text-sm text-gray-500">
                            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            Date: {new Date(record.date).toLocaleDateString()}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <Wrench className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            Completed by: {record.completedBy}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <div className="flex space-x-4">
                            <span className="flex items-center">
                              <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              Odometer: {record.odometer} km
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              Cost: ₹{record.cost.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      {record.nextDueDate && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Next maintenance due:</span> {new Date(record.nextDueDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      
      {/* Add Maintenance Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Schedule Maintenance</h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <MaintenanceForm buses={buses} onSubmit={handleAddRecord} onCancel={() => setIsAddModalOpen(false)} />
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Maintenance Modal */}
      {isEditModalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Update Maintenance Record</h3>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <MaintenanceForm 
                record={selectedRecord} 
                buses={buses} 
                onSubmit={(data) => handleEditRecord(selectedRecord.id, data)} 
                onCancel={() => setIsEditModalOpen(false)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface MaintenanceFormProps {
  record?: MaintenanceRecord;
  buses: any[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ record, buses, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    busId: record?.busId || '',
    date: record?.date || new Date().toISOString().split('T')[0],
    type: record?.type || 'regular',
    description: record?.description || '',
    cost: record?.cost || 0,
    odometer: record?.odometer || 0,
    nextDueDate: record?.nextDueDate || '',
    completedBy: record?.completedBy || '',
    status: record?.status || 'scheduled'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="busId" className="block text-sm font-medium text-gray-700">
          Bus
        </label>
        <select
          id="busId"
          name="busId"
          required
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.busId}
          onChange={handleChange}
        >
          <option value="">Select a bus</option>
          {buses.map(bus => (
            <option key={bus.id} value={bus.id}>
              {bus.registrationNumber} ({bus.make} {bus.model})
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          name="date"
          id="date"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.date}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Maintenance Type
        </label>
        <select
          id="type"
          name="type"
          required
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="regular">Regular</option>
          <option value="repair">Repair</option>
          <option value="inspection">Inspection</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the maintenance work"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
            Cost (₹)
          </label>
          <input
            type="number"
            name="cost"
            id="cost"
            min="0"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.cost}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="odometer" className="block text-sm font-medium text-gray-700">
            Odometer (km)
          </label>
          <input
            type="number"
            name="odometer"
            id="odometer"
            min="0"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.odometer}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="completedBy" className="block text-sm font-medium text-gray-700">
          Completed By
        </label>
        <input
          type="text"
          name="completedBy"
          id="completedBy"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.completedBy}
          onChange={handleChange}
          placeholder="Name of mechanic or service center"
        />
      </div>
      
      <div>
        <label htmlFor="nextDueDate" className="block text-sm font-medium text-gray-700">
          Next Maintenance Due (optional)
        </label>
        <input
          type="date"
          name="nextDueDate"
          id="nextDueDate"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.nextDueDate}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          name="status"
          required
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="scheduled">Scheduled</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {record ? 'Update Record' : 'Add Record'}
        </button>
      </div>
    </form>
  );
};

export default MaintenanceManagement; 