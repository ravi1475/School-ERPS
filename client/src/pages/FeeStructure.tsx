import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, Search } from 'lucide-react';
import { 
  ClassFeeStructure, 
  FeeCategory, 
  DEFAULT_CATEGORIES,
  calculateTotalAnnualFee 
} from '../types/FeeStructureTypes';
import { 
  Button, 
  Input, 
  Badge, 
  LoadingSpinner, 
  ErrorMessage,
  FilterSection
} from '../components/fee/FeeStructureComponents';
import * as feeStructureService from '../services/feeStructureService';

// Expanded sample data for fallback
const SAMPLE_FEE_STRUCTURES: ClassFeeStructure[] = [
  {
    id: '1',
    className: 'Class 1',
    totalAnnualFee: 0,
    categories: [
      { id: '1-1', name: 'Tuition Fee', amount: 2000, frequency: 'Monthly' },
      { id: '1-2', name: 'Development Fee', amount: 5000, frequency: 'Yearly' },
      { id: '1-3', name: 'Library Fee', amount: 1000, frequency: 'Yearly' },
      { id: '1-4', name: 'Sports Fee', amount: 800, frequency: 'Quarterly' }
    ]
  },
  {
    id: '2',
    className: 'Class 2',
    totalAnnualFee: 0,
    categories: [
      { id: '2-1', name: 'Tuition Fee', amount: 2200, frequency: 'Monthly' },
      { id: '2-2', name: 'Development Fee', amount: 5500, frequency: 'Yearly' },
      { id: '2-3', name: 'Library Fee', amount: 1200, frequency: 'Yearly' },
      { id: '2-4', name: 'Sports Fee', amount: 900, frequency: 'Quarterly' }
    ]
  },
  {
    id: '3',
    className: 'Class 3',
    totalAnnualFee: 0,
    categories: [
      { id: '3-1', name: 'Tuition Fee', amount: 2500, frequency: 'Monthly' },
      { id: '3-2', name: 'Development Fee', amount: 6000, frequency: 'Yearly' },
      { id: '3-3', name: 'Computer Fee', amount: 1500, frequency: 'Quarterly' },
      { id: '3-4', name: 'Activity Fee', amount: 2000, frequency: 'Yearly' }
    ]
  },
  {
    id: '4',
    className: 'Class 4',
    totalAnnualFee: 0,
    categories: [
      { id: '4-1', name: 'Tuition Fee', amount: 2800, frequency: 'Monthly' },
      { id: '4-2', name: 'Transport Fee', amount: 1500, frequency: 'Monthly' },
      { id: '4-3', name: 'Library Fee', amount: 1500, frequency: 'Yearly' },
      { id: '4-4', name: 'Examination Fee', amount: 3000, frequency: 'Yearly' }
    ]
  },
  {
    id: '5',
    className: 'Class 5',
    totalAnnualFee: 0,
    categories: [
      { id: '5-1', name: 'Tuition Fee', amount: 3000, frequency: 'Monthly' },
      { id: '5-2', name: 'Computer Fee', amount: 1800, frequency: 'Quarterly' },
      { id: '5-3', name: 'Development Fee', amount: 7000, frequency: 'Yearly' },
      { id: '5-4', name: 'Sports Fee', amount: 1200, frequency: 'Quarterly' }
    ]
  },
  {
    id: '6',
    className: 'Class 6',
    totalAnnualFee: 0,
    categories: [
      { id: '6-1', name: 'Tuition Fee', amount: 3500, frequency: 'Monthly' },
      { id: '6-2', name: 'Laboratory Fee', amount: 2000, frequency: 'Quarterly' },
      { id: '6-3', name: 'Library Fee', amount: 2000, frequency: 'Yearly' },
      { id: '6-4', name: 'Activity Fee', amount: 2500, frequency: 'Yearly' }
    ]
  },
  {
    id: '7',
    className: 'Class 7',
    totalAnnualFee: 0,
    categories: [
      { id: '7-1', name: 'Tuition Fee', amount: 3800, frequency: 'Monthly' },
      { id: '7-2', name: 'Computer Fee', amount: 2200, frequency: 'Quarterly' },
      { id: '7-3', name: 'Transport Fee', amount: 1800, frequency: 'Monthly' },
      { id: '7-4', name: 'Maintenance Fee', amount: 3000, frequency: 'Yearly' }
    ]
  },
  {
    id: '8',
    className: 'Class 8',
    totalAnnualFee: 0,
    categories: [
      { id: '8-1', name: 'Tuition Fee', amount: 4000, frequency: 'Monthly' },
      { id: '8-2', name: 'Laboratory Fee', amount: 2500, frequency: 'Quarterly' },
      { id: '8-3', name: 'Sports Fee', amount: 1500, frequency: 'Quarterly' },
      { id: '8-4', name: 'Examination Fee', amount: 4000, frequency: 'Yearly' }
    ]
  },
  {
    id: '9',
    className: 'Class 9',
    totalAnnualFee: 0,
    categories: [
      { id: '9-1', name: 'Tuition Fee', amount: 4500, frequency: 'Monthly' },
      { id: '9-2', name: 'Development Fee', amount: 8000, frequency: 'Yearly' },
      { id: '9-3', name: 'Computer Fee', amount: 2800, frequency: 'Quarterly' },
      { id: '9-4', name: 'Library Fee', amount: 2500, frequency: 'Yearly' }
    ]
  },
  {
    id: '10',
    className: 'Class 10',
    totalAnnualFee: 0,
    categories: [
      { id: '10-1', name: 'Tuition Fee', amount: 5000, frequency: 'Monthly' },
      { id: '10-2', name: 'Laboratory Fee', amount: 3000, frequency: 'Quarterly' },
      { id: '10-3', name: 'Examination Fee', amount: 5000, frequency: 'Yearly' },
      { id: '10-4', name: 'Activity Fee', amount: 3000, frequency: 'Yearly' }
    ]
  },
  {
    id: '11',
    className: 'Class 11 (Science)',
    totalAnnualFee: 0,
    categories: [
      { id: '11-1', name: 'Tuition Fee', amount: 6000, frequency: 'Monthly' },
      { id: '11-2', name: 'Laboratory Fee', amount: 4000, frequency: 'Quarterly' },
      { id: '11-3', name: 'Library Fee', amount: 3000, frequency: 'Yearly' },
      { id: '11-4', name: 'Computer Fee', amount: 3500, frequency: 'Quarterly' }
    ]
  },
  {
    id: '12',
    className: 'Class 11 (Commerce)',
    totalAnnualFee: 0,
    categories: [
      { id: '12-1', name: 'Tuition Fee', amount: 5500, frequency: 'Monthly' },
      { id: '12-2', name: 'Computer Fee', amount: 3000, frequency: 'Quarterly' },
      { id: '12-3', name: 'Library Fee', amount: 3000, frequency: 'Yearly' },
      { id: '12-4', name: 'Activity Fee', amount: 3000, frequency: 'Yearly' }
    ]
  },
  {
    id: '13',
    className: 'Class 12 (Science)',
    totalAnnualFee: 0,
    categories: [
      { id: '13-1', name: 'Tuition Fee', amount: 6500, frequency: 'Monthly' },
      { id: '13-2', name: 'Laboratory Fee', amount: 4500, frequency: 'Quarterly' },
      { id: '13-3', name: 'Examination Fee', amount: 6000, frequency: 'Yearly' },
      { id: '13-4', name: 'Development Fee', amount: 10000, frequency: 'Yearly' }
    ]
  },
  {
    id: '14',
    className: 'Class 12 (Commerce)',
    totalAnnualFee: 0,
    categories: [
      { id: '14-1', name: 'Tuition Fee', amount: 6000, frequency: 'Monthly' },
      { id: '14-2', name: 'Computer Fee', amount: 3500, frequency: 'Quarterly' },
      { id: '14-3', name: 'Examination Fee', amount: 6000, frequency: 'Yearly' },
      { id: '14-4', name: 'Development Fee', amount: 9000, frequency: 'Yearly' }
    ]
  }
];

const FeeStructure = () => {
  const [feeStructures, setFeeStructures] = useState<ClassFeeStructure[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newClassName, setNewClassName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFrequency, setFilterFrequency] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [sortField, setSortField] = useState<string>('className');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch fee categories from API
  useEffect(() => {
    feeStructureService.getFeeCategories()
      .then((data) => {
        setCategories(data.length > 0 ? data : DEFAULT_CATEGORIES);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        // Fallback to default categories if API fails
        setCategories(DEFAULT_CATEGORIES);
      });
  }, []);

  // Fetch fee structures from API
  useEffect(() => {
    setIsLoading(true);
    feeStructureService.getFeeStructures()
      .then((data) => {
        if (data && Array.isArray(data)) {
          // Calculate totalAnnualFee for each structure if not set from backend
          const structuresWithTotal = data.map((structure: ClassFeeStructure) => ({
            ...structure,
            totalAnnualFee: structure.totalAnnualFee || calculateTotalAnnualFee(structure.categories)
          }));
          setFeeStructures(structuresWithTotal);
        } else {
          // Fallback to local storage or sample data
          loadLocalData();
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching fee structures:", err);
        setError("Failed to load fee structures from the server. Using local data instead.");
        // Fallback to local storage or sample data
        loadLocalData();
        setIsLoading(false);
      });
  }, []);

  // Function to load data from localStorage or use sample data as fallback
  const loadLocalData = () => {
    const savedStructures = localStorage.getItem('feeStructures');
    if (savedStructures) {
      setFeeStructures(JSON.parse(savedStructures));
    } else {
      // Initialize with sample data if no saved data exists
      // Calculate and set the totalAnnualFee for each structure
      const structuresWithTotal = SAMPLE_FEE_STRUCTURES.map(structure => ({
        ...structure,
        totalAnnualFee: calculateTotalAnnualFee(structure.categories)
      }));
      setFeeStructures(structuresWithTotal);
    }
  };

  // Save to localStorage whenever feeStructures changes
  useEffect(() => {
    localStorage.setItem('feeStructures', JSON.stringify(feeStructures));
  }, [feeStructures]);

  const handleAddStructure = async () => {
    if (!newClassName) return;
    
    // Format the class name to ensure it has "Class" prefix
    const formattedClassName = newClassName.trim().match(/^\d+$/) 
      ? `Class ${newClassName}`
      : !newClassName.toLowerCase().startsWith('class') 
        ? `Class ${newClassName}`
        : newClassName;

    const newStructure: ClassFeeStructure = {
      id: Date.now().toString(), // Temporary ID, will be replaced by backend
      className: formattedClassName,
      totalAnnualFee: 0,
      categories: []
    };
    
    try {
      // Try to add to API first
      const result = await feeStructureService.createFeeStructure(newStructure);
      
      // If successful, add to state (or refetch all structures)
      setFeeStructures(prev => [...prev, result]);
      setNewClassName('');
    } catch (err) {
      console.error("Error adding fee structure:", err);
      // Still add to local state even if API fails
      setFeeStructures(prev => [...prev, newStructure]);
      setNewClassName('');
    }
  };

  const handleDeleteStructure = async (id: string) => {
    try {
      // Try to delete from API first
      await feeStructureService.deleteFeeStructure(id);
      
      // Always update local state
      setFeeStructures(feeStructures.filter(structure => structure.id !== id));
    } catch (err) {
      console.error("Error deleting fee structure:", err);
      // Still update local state if API fails
      setFeeStructures(feeStructures.filter(structure => structure.id !== id));
    }
  };

  const handleAddCategory = async (structureId: string) => {
    const newCategory: FeeCategory = {
      id: `${structureId}-${Date.now()}`, // Temporary ID
      name: categories[0] || DEFAULT_CATEGORIES[0],
      amount: 0,
      frequency: 'Monthly'
    };

    const updatedStructures = feeStructures.map(structure =>
      structure.id === structureId
        ? {
            ...structure,
            categories: [...structure.categories, newCategory],
            totalAnnualFee: calculateTotalAnnualFee([...structure.categories, newCategory])
          }
        : structure
    );
    
    setFeeStructures(updatedStructures);
    
    // Find the updated structure to sync with API
    const updatedStructure = updatedStructures.find(s => s.id === structureId);
    if (updatedStructure) {
      try {
        await feeStructureService.updateFeeStructure(structureId, updatedStructure);
      } catch (err) {
        console.error("Failed to sync category addition with API:", err);
      }
    }
  };

  const handleUpdateCategory = async (
    structureId: string,
    categoryId: string,
    updates: Partial<FeeCategory>
  ) => {
    const updatedStructures = feeStructures.map(structure =>
      structure.id === structureId
        ? {
            ...structure,
            categories: structure.categories.map(category =>
              category.id === categoryId
                ? { ...category, ...updates }
                : category
            ),
            totalAnnualFee: calculateTotalAnnualFee(
              structure.categories.map(category =>
                category.id === categoryId
                  ? { ...category, ...updates }
                  : category
              )
            )
          }
        : structure
    );
    
    setFeeStructures(updatedStructures);
    
    // Find the updated structure to sync with API
    const updatedStructure = updatedStructures.find(s => s.id === structureId);
    if (updatedStructure) {
      try {
        await feeStructureService.updateFeeStructure(structureId, updatedStructure);
      } catch (err) {
        console.error("Failed to sync category update with API:", err);
      }
    }
  };

  const handleDeleteCategory = async (structureId: string, categoryId: string) => {
    const updatedStructures = feeStructures.map(structure =>
      structure.id === structureId
        ? {
            ...structure,
            categories: structure.categories.filter(
              category => category.id !== categoryId
            ),
            totalAnnualFee: calculateTotalAnnualFee(
              structure.categories.filter(
                category => category.id !== categoryId
              )
            )
          }
        : structure
    );
    
    setFeeStructures(updatedStructures);
    
    // Find the updated structure to sync with API
    const updatedStructure = updatedStructures.find(s => s.id === structureId);
    if (updatedStructure) {
      try {
        await feeStructureService.updateFeeStructure(structureId, updatedStructure);
      } catch (err) {
        console.error("Failed to sync category deletion with API:", err);
      }
    }
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedStructures = feeStructures
    .filter(structure => {
      // Class name filter
      const matchesSearch = structure.className.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = !filterCategory || structure.categories.some(cat => cat.name === filterCategory);
      
      // Frequency filter
      const matchesFrequency = !filterFrequency || structure.categories.some(cat => cat.frequency === filterFrequency);
      
      return matchesSearch && matchesCategory && matchesFrequency;
    })
    .sort((a, b) => {
      // Sorting logic
      if (sortField === 'className') {
        const aClassName = a.className.toLowerCase();
        const bClassName = b.className.toLowerCase();
        
        if (sortDirection === 'asc') {
          return aClassName.localeCompare(bClassName);
        } else {
          return bClassName.localeCompare(aClassName);
        }
      } else if (sortField === 'totalAnnualFee') {
        if (sortDirection === 'asc') {
          return a.totalAnnualFee - b.totalAnnualFee;
        } else {
          return b.totalAnnualFee - a.totalAnnualFee;
        }
      }
      return 0;
    });

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterFrequency('');
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading fee structures..." />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Fee Structure Management
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage fee structures for different classes and their fee categories
            </p>
            {error && <ErrorMessage message={error} />}
          </div>
          <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter class (e.g. 5 or Class 5)"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
              />
              <Button onClick={handleAddStructure}>
                <Plus className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter section */}
        <FilterSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterFrequency={filterFrequency}
          setFilterFrequency={setFilterFrequency}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          categories={categories}
          clearFilters={clearFilters}
          toggleSort={toggleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />

        {/* Fee Structures List */}
        {filteredAndSortedStructures.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No fee structures found. Please add a new class or clear your filters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedStructures.map((structure) => (
              <div key={structure.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{structure.className}</h2>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStructure(structure.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <span className="block text-sm text-indigo-600 mb-1">Total Annual Fee</span>
                      <span className="text-xl font-bold text-indigo-800">₹{structure.totalAnnualFee.toLocaleString()}</span>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <span className="block text-sm text-blue-600 mb-1">Categories</span>
                      <span className="text-xl font-bold text-blue-800">{structure.categories.length}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="mb-4 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">Fee Categories</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleAddCategory(structure.id)}
                      >
                        <Plus className="mr-1 h-3 w-3" /> Add Fee
                      </Button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount (₹)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Frequency
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Annual Amount (₹)
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {structure.categories.map((category) => {
                            const isEditing = editingCategoryId === category.id;
                            const annualAmount = category.amount * 
                              (category.frequency === 'Monthly' ? 12 : 
                               category.frequency === 'Quarterly' ? 4 : 1);
                            
                            return (
                              <tr key={category.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {isEditing ? (
                                    <select
                                      value={category.name}
                                      onChange={(e) => 
                                        handleUpdateCategory(structure.id, category.id, { name: e.target.value })
                                      }
                                      className="border rounded-md p-1 w-full"
                                    >
                                      {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    <div className="text-sm font-medium text-gray-900">
                                      {category.name}
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      min="0"
                                      value={category.amount}
                                      onChange={(e) => 
                                        handleUpdateCategory(structure.id, category.id, { amount: Number(e.target.value) })
                                      }
                                      className="border rounded-md p-1 w-24"
                                    />
                                  ) : (
                                    <div className="text-sm text-gray-900">
                                      {category.amount.toLocaleString()}
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {isEditing ? (
                                    <select
                                      value={category.frequency}
                                      onChange={(e) => 
                                        handleUpdateCategory(
                                          structure.id, 
                                          category.id, 
                                          { frequency: e.target.value as 'Monthly' | 'Quarterly' | 'Yearly' }
                                        )
                                      }
                                      className="border rounded-md p-1 w-full"
                                    >
                                      <option value="Monthly">Monthly</option>
                                      <option value="Quarterly">Quarterly</option>
                                      <option value="Yearly">Yearly</option>
                                    </select>
                                  ) : (
                                    <Badge color={
                                      category.frequency === 'Monthly' ? 'blue' :
                                      category.frequency === 'Quarterly' ? 'purple' : 'green'
                                    }>
                                      {category.frequency}
                                    </Badge>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 font-medium">
                                    {annualAmount.toLocaleString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  {isEditing ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingCategoryId(null)}
                                    >
                                      <Save className="h-4 w-4" />
                                    </Button>
                                  ) : (
                                    <div className="flex justify-end space-x-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditingCategoryId(category.id)}
                                      >
                                        <Edit2 className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteCategory(structure.id, category.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                          
                          {structure.categories.length === 0 && (
                            <tr>
                              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                No fee categories added yet. Click "Add Fee" to add a category.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeStructure;
