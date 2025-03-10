// import React, { useState, useEffect } from 'react';
// import { Plus, Edit2, Trash2, Save, Search, Filter, ArrowUpDown, X } from 'lucide-react';

// interface FeeCategory {
//   id: string;
//   name: string;
//   amount: number;
//   frequency: 'Monthly' | 'Quarterly' | 'Yearly';
// }

// interface ClassFeeStructure {
//   id: string;
//   className: string;
//   totalAnnualFee: number;
//   categories: FeeCategory[];
// }

// // Styled button component
// const Button = ({ 
//   children, 
//   variant = 'primary', 
//   size = 'md',
//   onClick,
//   className = ''
// }: {
//   children: React.ReactNode;
//   variant?: 'primary' | 'ghost' | 'outline';
//   size?: 'sm' | 'md' | 'lg';
//   onClick?: () => void;
//   className?: string;
// }) => {
//   const baseStyles = 'rounded-md font-medium focus:outline-none transition-colors flex items-center justify-center';
//   const variants = {
//     primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
//     outline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50',
//     ghost: 'text-gray-600 hover:bg-gray-100'
//   };
//   const sizes = {
//     sm: 'px-2 py-1 text-sm',
//     md: 'px-4 py-2',
//     lg: 'px-6 py-3 text-lg'
//   };

//   return (
//     <button 
//       className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
//       onClick={onClick}
//     >
//       {children}
//     </button>
//   );
// };

// // Input component
// const Input = ({ 
//   type = 'text',
//   value,
//   onChange,
//   placeholder,
//   icon,
//   className = ''
// }: {
//   type?: string;
//   value: string | number;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   placeholder?: string;
//   icon?: React.ReactNode;
//   className?: string;
// }) => (
//   <div className="relative">
//     {icon && (
//       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//         {icon}
//       </div>
//     )}
//     <input
//       type={type}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       className={`border border-gray-300 rounded-md ${icon ? 'pl-10' : 'px-3'} py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
//     />
//   </div>
// );

// // Badge component
// const Badge = ({ 
//   children, 
//   color = 'blue'
// }: {
//   children: React.ReactNode;
//   color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
// }) => {
//   const colors = {
//     blue: 'bg-blue-100 text-blue-800',
//     green: 'bg-green-100 text-green-800',
//     red: 'bg-red-100 text-red-800',
//     yellow: 'bg-yellow-100 text-yellow-800',
//     purple: 'bg-purple-100 text-purple-800',
//     gray: 'bg-gray-100 text-gray-800'
//   };

//   return (
//     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
//       {children}
//     </span>
//   );
// };

// // Default fee categories for selection
// const DEFAULT_CATEGORIES = [
//   'Tuition Fee',
//   'Transport Fee',
//   'Library Fee',
//   'Laboratory Fee',
//   'Sports Fee',
//   'Development Fee',
//   'Admission Fee',
//   'Examination Fee',
//   'Computer Fee',
//   'Maintenance Fee',
//   'Activity Fee'
// ];

// // Expanded sample data
// const SAMPLE_FEE_STRUCTURES: ClassFeeStructure[] = [
//   {
//     id: '1',
//     className: 'Class 1',
//     totalAnnualFee: 0,
//     categories: [
//       { id: '1-1', name: 'Tuition Fee', amount: 2000, frequency: 'Monthly' },
//       { id: '1-2', name: 'Development Fee', amount: 5000, frequency: 'Yearly' },
//       { id: '1-3', name: 'Library Fee', amount: 1000, frequency: 'Yearly' },
//       { id: '1-4', name: 'Sports Fee', amount: 800, frequency: 'Quarterly' }
//     ]
//   },
//   {
//     id: '2',
//     className: 'Class 2',
//     totalAnnualFee: 0,
//     categories: [
//       { id: '2-1', name: 'Tuition Fee', amount: 2200, frequency: 'Monthly' },
//       { id: '2-2', name: 'Development Fee', amount: 5500, frequency: 'Yearly' },
//       { id: '2-3', name: 'Library Fee', amount: 1200, frequency: 'Yearly' },
//       { id: '2-4', name: 'Sports Fee', amount: 900, frequency: 'Quarterly' }
//     ]
//   },
//   {
//     id: '3',
//     className: 'Class 3',
//     totalAnnualFee: 0,
//     categories: [
//       { id: '3-1', name: 'Tuition Fee', amount: 2500, frequency: 'Monthly' },
//       { id: '3-2', name: 'Development Fee', amount: 6000, frequency: 'Yearly' },
//       { id: '3-3', name: 'Computer Fee', amount: 1500, frequency: 'Quarterly' },
//       { id: '3-4', name: 'Activity Fee', amount: 2000, frequency: 'Yearly' }
//     ]
//   },
//   {
//     id: '4',
//     className: 'Class 4',
//     totalAnnualFee: 0,
//     categories: [
//       { id: '4-1', name: 'Tuition Fee', amount: 2800, frequency: 'Monthly' },
//       { id: '4-2', name: 'Transport Fee', amount: 1500, frequency: 'Monthly' },
//       { id: '4-3', name: 'Library Fee', amount: 1500, frequency: 'Yearly' },
//       { id: '4-4', name: 'Examination Fee', amount: 3000, frequency: 'Yearly' }
//     ]
//   },
//   {
//     id: '5',
//     className: 'Class 5',
//     totalAnnualFee: 0,
//     categories: [
//       { id: '5-1', name: 'Tuition Fee', amount: 3000, frequency: 'Monthly' },
//       { id: '5-2', name: 'Computer Fee', amount: 1800, frequency: 'Quarterly' },
//       { id: '5-3', name: 'Development Fee', amount: 7000, frequency: 'Yearly' },
//       { id: '5-4', name: 'Sports Fee', amount: 1200, frequency: 'Quarterly' }
//     ]
//   },
//   {
//     id: '6',
//     className: 'Class 6',
//     totalAnnualFee: 0,
//     categories: [
//       { id: '6-1', name: 'Tuition Fee', amount: 3500, frequency: 'Monthly' },
//       { id: '6-2', name: 'Laboratory Fee', amount: 2000, frequency: 'Quarterly' },
//       { id: '6-3', name: 'Library Fee', amount: 2000, frequency: 'Yearly' },
//       { id: '6-4', name: 'Activity Fee', amount: 2500, frequency: 'Yearly' }
//     ]
//   },
//   {
//     id: '7',
//     className: 'Class 7',
//     totalAnnualFee: 0,
//     categories: [
//       { id: '7-1', name: 'Tuition Fee', amount: 3800, frequency: 'Monthly' },
//       { id: '7-2', name: 'Computer Fee', amount: 2200, frequency: 'Quarterly' },
//       { id: '7-3', name: 'Transport Fee', amount: 1800, frequency: 'Monthly' },
//       { id: '7-4', name: 'Maintenance Fee', amount: 3000, frequency: 'Yearly' }
//     ]
//   },
//   {
//     id: '8',
//     className: 'Class 8',
//     totalAnnualFee: 0,
//     categories: [
//       { id: '8-1', name: 'Tuition Fee', amount: 4000, frequency: 'Monthly' },
//       { id: '8-2', name: 'Laboratory Fee', amount: 2500, frequency: 'Quarterly' },
//       { id: '8-3', name: 'Sports Fee', amount: 1500, frequency: 'Quarterly' },
//       { id: '8-4', name: 'Examination Fee', amount: 4000, frequency: 'Yearly' }
//     ]
//   },
//   {
//     id: '9',
//     className: 'Class 9',
//     totalAnnualFee: 0,
//     categories: [
//       { id: '9-1', name: 'Tuition Fee', amount: 4500, frequency: 'Monthly' },
//       { id: '9-2', name: 'Development Fee', amount: 8000, frequency: 'Yearly' },
//       { id: '9-3', name: 'Computer Fee', amount: 2800, frequency: 'Quarterly' },
//       { id: '9-4', name: 'Library Fee', amount: 2500, frequency: 'Yearly' }
//     ]
//   },
//   {
//     id: '10',
//     className: 'Class 10',
//     totalAnnualFee: 0,
//     categories: [
//       { id: '10-1', name: 'Tuition Fee', amount: 5000, frequency: 'Monthly' },
//       { id: '10-2', name: 'Laboratory Fee', amount: 3000, frequency: 'Quarterly' },
//       { id: '10-3', name: 'Examination Fee', amount: 5000, frequency: 'Yearly' },
//       { id: '10-4', name: 'Activity Fee', amount: 3000, frequency: 'Yearly' }
//     ]
//   },
//   {
//     id: '11',
//     className: 'Class 11 (Science)',
//     totalAnnualFee: 0,
//     categories: [
//       { id: '11-1', name: 'Tuition Fee', amount: 6000, frequency: 'Monthly' },
//       { id: '11-2', name: 'Laboratory Fee', amount: 4000, frequency: 'Quarterly' },
//       { id: '11-3', name: 'Library Fee', amount: 3000, frequency: 'Yearly' },
//       { id: '11-4', name: 'Computer Fee', amount: 3500, frequency: 'Quarterly' }
//     ]
//   },
//   {
//     id: '12',
//     className: 'Class 11 (Commerce)',
//     totalAnnualFee: 0,
//     categories: [
//       { id: '12-1', name: 'Tuition Fee', amount: 5500, frequency: 'Monthly' },
//       { id: '12-2', name: 'Computer Fee', amount: 3000, frequency: 'Quarterly' },
//       { id: '12-3', name: 'Library Fee', amount: 3000, frequency: 'Yearly' },
//       { id: '12-4', name: 'Activity Fee', amount: 3000, frequency: 'Yearly' }
//     ]
//   },
//   {
//     id: '13',
//     className: 'Class 12 (Science)',
//     totalAnnualFee: 0,
//     categories: [
//       { id: '13-1', name: 'Tuition Fee', amount: 6500, frequency: 'Monthly' },
//       { id: '13-2', name: 'Laboratory Fee', amount: 4500, frequency: 'Quarterly' },
//       { id: '13-3', name: 'Examination Fee', amount: 6000, frequency: 'Yearly' },
//       { id: '13-4', name: 'Development Fee', amount: 10000, frequency: 'Yearly' }
//     ]
//   },
//   {
//     id: '14',
//     className: 'Class 12 (Commerce)',
//     totalAnnualFee: 0,
//     categories: [
//       { id: '14-1', name: 'Tuition Fee', amount: 6000, frequency: 'Monthly' },
//       { id: '14-2', name: 'Computer Fee', amount: 3500, frequency: 'Quarterly' },
//       { id: '14-3', name: 'Examination Fee', amount: 6000, frequency: 'Yearly' },
//       { id: '14-4', name: 'Development Fee', amount: 9000, frequency: 'Yearly' }
//     ]
//   }
// ];

// const FeeStructure = () => {
//   const [feeStructures, setFeeStructures] = useState<ClassFeeStructure[]>([]);
//   // const [editingStructureId, setEditingStructureId] = useState<string | null>(null);
//   const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
//   const [newClassName, setNewClassName] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterFrequency, setFilterFrequency] = useState<string>('');
//   const [filterCategory, setFilterCategory] = useState<string>('');
//   const [sortField, setSortField] = useState<string>('className');
//   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   // Replace the existing useEffect for loading data
//   useEffect(() => {
//     const savedStructures = localStorage.getItem('feeStructures');
//     if (savedStructures) {
//       setFeeStructures(JSON.parse(savedStructures));
//     } else {
//       // Initialize with sample data if no saved data exists
//       // Calculate and set the totalAnnualFee for each structure
//       const structuresWithTotal = SAMPLE_FEE_STRUCTURES.map(structure => ({
//         ...structure,
//         totalAnnualFee: calculateTotalAnnualFee(structure.categories)
//       }));
//       setFeeStructures(structuresWithTotal);
//     }
//   }, []);

//   // Save to localStorage whenever feeStructures changes
//   useEffect(() => {
//     localStorage.setItem('feeStructures', JSON.stringify(feeStructures));
//   }, [feeStructures]);

//   const handleAddStructure = () => {
//     if (!newClassName) return;
    
//     // Format the class name to ensure it has "Class" prefix
//     const formattedClassName = newClassName.trim().match(/^\d+$/) 
//       ? `Class ${newClassName}`
//       : !newClassName.toLowerCase().startsWith('class') 
//         ? `Class ${newClassName}`
//         : newClassName;

//     const newStructure: ClassFeeStructure = {
//       id: Date.now().toString(),
//       className: formattedClassName,
//       totalAnnualFee: 0,
//       categories: []
//     };
    
//     setFeeStructures([...feeStructures, newStructure]);
//     setNewClassName('');
//   };

//   const handleDeleteStructure = (id: string) => {
//     setFeeStructures(feeStructures.filter(structure => structure.id !== id));
//   };

//   const handleAddCategory = (structureId: string) => {
//     const newCategory: FeeCategory = {
//       id: `${structureId}-${Date.now()}`,
//       name: DEFAULT_CATEGORIES[0],
//       amount: 0,
//       frequency: 'Monthly'
//     };

//     setFeeStructures(structures =>
//       structures.map(structure =>
//         structure.id === structureId
//           ? {
//               ...structure,
//               categories: [...structure.categories, newCategory],
//               totalAnnualFee: calculateTotalAnnualFee([...structure.categories, newCategory])
//             }
//           : structure
//       )
//     );
//   };

//   const handleUpdateCategory = (
//     structureId: string,
//     categoryId: string,
//     updates: Partial<FeeCategory>
//   ) => {
//     setFeeStructures(structures =>
//       structures.map(structure =>
//         structure.id === structureId
//           ? {
//               ...structure,
//               categories: structure.categories.map(category =>
//                 category.id === categoryId
//                   ? { ...category, ...updates }
//                   : category
//               ),
//               totalAnnualFee: calculateTotalAnnualFee(
//                 structure.categories.map(category =>
//                   category.id === categoryId
//                     ? { ...category, ...updates }
//                     : category
//                 )
//               )
//             }
//           : structure
//       )
//     );
//   };

//   const handleDeleteCategory = (structureId: string, categoryId: string) => {
//     setFeeStructures(structures =>
//       structures.map(structure =>
//         structure.id === structureId
//           ? {
//               ...structure,
//               categories: structure.categories.filter(
//                 category => category.id !== categoryId
//               ),
//               totalAnnualFee: calculateTotalAnnualFee(
//                 structure.categories.filter(
//                   category => category.id !== categoryId
//                 )
//               )
//             }
//           : structure
//       )
//     );
//   };

//   const calculateTotalAnnualFee = (categories: FeeCategory[]): number => {
//     return categories.reduce((total, category) => {
//       const multiplier = category.frequency === 'Monthly' 
//         ? 12 
//         : category.frequency === 'Quarterly' 
//           ? 4 
//           : 1;
//       return total + (category.amount * multiplier);
//     }, 0);
//   };

//   const toggleSort = (field: string) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   const filteredAndSortedStructures = feeStructures
//     .filter(structure => {
//       // Class name filter
//       const matchesSearch = structure.className.toLowerCase().includes(searchTerm.toLowerCase());
      
//       // Category filter
//       const matchesCategory = !filterCategory || structure.categories.some(cat => cat.name === filterCategory);
      
//       // Frequency filter
//       const matchesFrequency = !filterFrequency || structure.categories.some(cat => cat.frequency === filterFrequency);
      
//       return matchesSearch && matchesCategory && matchesFrequency;
//     })
//     .sort((a, b) => {
//       // Sorting logic
//       if (sortField === 'className') {
//         const aClassName = a.className.toLowerCase();
//         const bClassName = b.className.toLowerCase();
        
//         if (sortDirection === 'asc') {
//           return aClassName.localeCompare(bClassName);
//         } else {
//           return bClassName.localeCompare(aClassName);
//         }
//       } else if (sortField === 'totalAnnualFee') {
//         if (sortDirection === 'asc') {
//           return a.totalAnnualFee - b.totalAnnualFee;
//         } else {
//           return b.totalAnnualFee - a.totalAnnualFee;
//         }
//       }
//       return 0;
//     });

//   const clearFilters = () => {
//     setSearchTerm('');
//     setFilterCategory('');
//     setFilterFrequency('');
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header section */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">
//               Fee Structure Management
//             </h1>
//             <p className="mt-2 text-sm text-gray-600">
//               Manage fee structures for different classes and their fee categories
//             </p>
//           </div>
//           <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row gap-4">
//             <div className="flex gap-2">
//               <Input
//                 type="text"
//                 placeholder="Enter class (e.g. 5 or Class 5)"
//                 value={newClassName}
//                 onChange={(e) => setNewClassName(e.target.value)}
//               />
//               <Button onClick={handleAddStructure}>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Add Class
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filter section */}
//         <div className="bg-white p-4 rounded-lg shadow mb-6">
//           <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
//             <div className="flex-1">
//               <Input
//                 type="text"
//                 placeholder="Search by class name..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 icon={<Search className="h-5 w-5 text-gray-400" />}
//                 className="w-full"
//               />
//             </div>
//             <div className="flex gap-2">
//               <Button 
//                 variant="outline" 
//                 onClick={() => setIsFilterOpen(!isFilterOpen)}
//               >
//                 <Filter className="mr-2 h-4 w-4" />
//                 Filters
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => toggleSort('totalAnnualFee')}
//               >
//                 <ArrowUpDown className="mr-2 h-4 w-4" />
//                 {sortField === 'totalAnnualFee' 
//                   ? `Annual Fee ${sortDirection === 'asc' ? '↑' : '↓'}` 
//                   : 'Annual Fee'}
//               </Button>
//             </div>
//           </div>
          
//           {/* Expanded filter options */}
//           {isFilterOpen && (
//             <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
//               <div className="flex flex-col md:flex-row gap-4">
//                 <div className="flex-1">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Fee Category</label>
//                   <select
//                     value={filterCategory}
//                     onChange={(e) => setFilterCategory(e.target.value)}
//                     className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option value="">All Categories</option>
//                     {DEFAULT_CATEGORIES.map((category) => (
//                       <option key={category} value={category}>{category}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="flex-1">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
//                   <select
//                     value={filterFrequency}
//                     onChange={(e) => setFilterFrequency(e.target.value)}
//                     className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option value="">All Frequencies</option>
//                     <option value="Monthly">Monthly</option>
//                     <option value="Quarterly">Quarterly</option>
//                     <option value="Yearly">Yearly</option>
//                   </select>
//                 </div>
//                 <div className="flex items-end">
//                   <Button 
//                     variant="ghost" 
//                     onClick={clearFilters}
//                     className="text-red-600 hover:bg-red-50"
//                   >
//                     <X className="mr-2 h-4 w-4" />
//                     Clear Filters
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Active filters display */}
//         {(filterCategory || filterFrequency || searchTerm) && (
//           <div className="flex items-center gap-2 mb-4">
//             <span className="text-sm text-gray-600">Active Filters:</span>
//             {searchTerm && (
//               <Badge color="blue">Search: {searchTerm}</Badge>
//             )}
//             {filterCategory && (
//               <Badge color="green">Category: {filterCategory}</Badge>
//             )}
//             {filterFrequency && (
//               <Badge color="purple">Frequency: {filterFrequency}</Badge>
//             )}
//           </div>
//         )}

//         {/* Results count */}
//         <div className="mb-4">
//           <p className="text-sm text-gray-600">
//             Showing {filteredAndSortedStructures.length} of {feeStructures.length} class fee structures
//           </p>
//         </div>

//         {/* Fee Structures Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {filteredAndSortedStructures.map((structure) => (
//             <div key={structure.id} className="bg-white shadow rounded-lg overflow-hidden">
//               <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-indigo-50">
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900">
//                     {structure.className}
//                   </h2>
//                   <p className="text-sm text-gray-500">
//                     Total Annual Fee: <span className="font-medium text-indigo-700">₹{structure.totalAnnualFee.toLocaleString()}</span>
//                   </p>
//                 </div>
//                 <div className="flex space-x-2">
//                   <Button 
//                     variant="ghost" 
//                     size="sm"
//                     onClick={() => handleDeleteStructure(structure.id)}
//                     className="text-red-600 hover:bg-red-50"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="px-6 py-4">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead>
//                     <tr>
//                       <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
//                       <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
//                       <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Frequency</th>
//                       <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {structure.categories.map((category) => (
//                       <tr key={category.id} className="hover:bg-gray-50">
//                         <td className="whitespace-nowrap px-3 py-4 text-sm">
//                           {editingCategoryId === category.id ? (
//                             <select
//                               className="border rounded p-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                               value={category.name}
//                               onChange={(e) =>
//                                 handleUpdateCategory(structure.id, category.id, {
//                                   name: e.target.value
//                                 })
//                               }
//                             >
//                               {DEFAULT_CATEGORIES.map((cat) => (
//                                 <option key={cat} value={cat}>
//                                   {cat}
//                                 </option>
//                               ))}
//                             </select>
//                           ) : (
//                             <span className="font-medium">{category.name}</span>
//                           )}
//                         </td>
//                         <td className="whitespace-nowrap px-3 py-4 text-sm">
//                           {editingCategoryId === category.id ? (
//                             <Input
//                               type="number"
//                               value={category.amount}
//                               onChange={(e) =>
//                                 handleUpdateCategory(structure.id, category.id, {
//                                   amount: Number(e.target.value)
//                                 })
//                               }
//                             />
//                           ) : (
//                             <span className="text-green-700 font-medium">₹{category.amount.toLocaleString()}</span>
//                           )}
//                         </td>
//                         <td className="whitespace-nowrap px-3 py-4 text-sm">
//                           {editingCategoryId === category.id ? (
//                             <select
//                               className="border rounded p-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                               value={category.frequency}
//                               onChange={(e) =>
//                                 handleUpdateCategory(structure.id, category.id, {
//                                   frequency: e.target.value as 'Monthly' | 'Quarterly' | 'Yearly'
//                                 })
//                               }
//                             >
//                               <option value="Monthly">Monthly</option>
//                               <option value="Quarterly">Quarterly</option>
//                               <option value="Yearly">Yearly</option>
//                             </select>
//                           ) : (
//                             <Badge 
//                               color={
//                                 category.frequency === 'Monthly' 
//                                   ? 'blue' 
//                                   : category.frequency === 'Quarterly' 
//                                     ? 'purple' 
//                                     : 'green'
//                               }
//                             >
//                               {category.frequency}
//                             </Badge>
//                           )}
//                         </td>
//                         <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
//                           <div className="flex justify-end gap-2">
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() =>
//                                 editingCategoryId === category.id
//                                   ? setEditingCategoryId(null)
//                                   : setEditingCategoryId(category.id)
//                               }
//                               className="text-indigo-600 hover:bg-indigo-50"
//                             >
//                               {editingCategoryId === category.id ? (
//                                 <Save className="h-4 w-4" />
//                               ) : (
//                                 <Edit2 className="h-4 w-4" />
//                               )}
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                                 onClick={() => handleDeleteCategory(structure.id, category.id)}
//                               className="text-red-600 hover:bg-red-50"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                     <tr>
//                       <td colSpan={4} className="px-3 py-4">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="text-indigo-600 hover:bg-indigo-50 w-full flex justify-center"
//                           onClick={() => handleAddCategory(structure.id)}
//                         >
//                           <Plus className="mr-2 h-4 w-4" />
//                           Add Fee Category
//                         </Button>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
              
//               {/* Summary section */}
//               <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
//                 <h3 className="text-sm font-medium text-gray-700 mb-2">Fee Summary</h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   {['Monthly', 'Quarterly', 'Yearly'].map((freq) => {
//                     const categories = structure.categories.filter(c => c.frequency === freq);
//                     if (categories.length === 0) return null;
                    
//                     const totalAmount = categories.reduce((sum, cat) => sum + cat.amount, 0);
//                     const annualAmount = freq === 'Monthly' ? totalAmount * 12 : freq === 'Quarterly' ? totalAmount * 4 : totalAmount;
                    
//                     return (
//                       <div key={freq} className="bg-white p-3 rounded border border-gray-200">
//                         <p className="text-xs text-gray-500">{freq} Total</p>
//                         <p className="text-sm font-medium">₹{totalAmount.toLocaleString()}</p>
//                         <p className="text-xs text-gray-500 mt-1">Annual Equivalent</p>
//                         <p className="text-sm font-medium">₹{annualAmount.toLocaleString()}</p>
//                       </div>
//                     );
//                   })}
                  
//                   <div className="bg-indigo-50 p-3 rounded border border-indigo-200">
//                     <p className="text-xs text-indigo-700">Total Annual Fee</p>
//                     <p className="text-lg font-bold text-indigo-700">₹{structure.totalAnnualFee.toLocaleString()}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
        
//         {/* Empty state */}
//         {filteredAndSortedStructures.length === 0 && (
//           <div className="bg-white p-8 rounded-lg shadow text-center">
//             <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
//               <Filter className="h-6 w-6 text-gray-400" />
//             </div>
//             <h3 className="mt-4 text-lg font-medium text-gray-900">No fee structures found</h3>
//             <p className="mt-2 text-sm text-gray-500">
//               {feeStructures.length > 0 
//                 ? "Try adjusting your filters or search terms to see results."
//                 : "Add a new class fee structure to get started."}
//             </p>
//             <div className="mt-6">
//               <Button 
//                 onClick={clearFilters}
//                 variant="outline"
//               >
//                 Clear All Filters
//               </Button>
//             </div>
//           </div>
//         )}
        
//         {/* Pagination (simple implementation) */}
//         {filteredAndSortedStructures.length > 0 && (
//           <div className="mt-8 flex justify-between items-center">
//             <p className="text-sm text-gray-600">
//               Showing {filteredAndSortedStructures.length} of {feeStructures.length} fee structures
//             </p>
//             <div className="flex gap-2">
//               <Button variant="outline" size="sm" onClick={() => {}} className="opacity-50 cursor-not-allowed">
//                 Previous
//               </Button>
//               <Button variant="outline" size="sm" onClick={() => {}} className="opacity-50 cursor-not-allowed">
//                 Next
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FeeStructure;

































import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, Search, Filter, ArrowUpDown, X } from 'lucide-react';

interface FeeCategory {
  id: string;
  name: string;
  amount: number;
  frequency: 'Monthly' | 'Quarterly' | 'Yearly';
}

interface ClassFeeStructure {
  id: string;
  className: string;
  totalAnnualFee: number;
  categories: FeeCategory[];
}

// Styled button component
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  className = ''
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}) => {
  const baseStyles = 'rounded-md font-medium focus:outline-none transition-colors flex items-center justify-center';
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    outline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    ghost: 'text-gray-600 hover:bg-gray-100'
  };
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Input component
const Input = ({ 
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  className = ''
}: {
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}) => (
  <div className="relative">
    {icon && (
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border border-gray-300 rounded-md ${icon ? 'pl-10' : 'px-3'} py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    />
  </div>
);

// Badge component
const Badge = ({ 
  children, 
  color = 'blue'
}: {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
}) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    gray: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
};

// Default fee categories for selection
const DEFAULT_CATEGORIES = [
  'Tuition Fee',
  'Transport Fee',
  'Library Fee',
  'Laboratory Fee',
  'Sports Fee',
  'Development Fee',
  'Admission Fee',
  'Examination Fee',
  'Computer Fee',
  'Maintenance Fee',
  'Activity Fee'
];

// Expanded sample data
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
    fetch("http://localhost:5000/api/fee-categories")
      .then((res) => res.json())
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
    fetch("http://localhost:5000/api/fee-structures")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          // Calculate totalAnnualFee for each structure
          const structuresWithTotal = data.map((structure: ClassFeeStructure) => ({
            ...structure,
            totalAnnualFee: calculateTotalAnnualFee(structure.categories)
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

  // Function to add a new fee structure via API
  const addFeeStructureToAPI = async (feeData: ClassFeeStructure) => {
    try {
      const response = await fetch("http://localhost:5000/api/fee-structures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feeData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to add fee structure");
      }
      
      const data = await response.json();
      console.log("Added fee structure:", data);
      
      // Fetch updated fee structures after adding new one
      fetchFeeStructures();
      
      return data;
    } catch (err) {
      console.error("Error adding fee structure:", err);
      // Still add to local state even if API fails
      setFeeStructures(prev => [...prev, feeData]);
      return null;
    }
  };

  // Function to update a fee structure via API
  const updateFeeStructureInAPI = async (feeData: ClassFeeStructure) => {
    try {
      const response = await fetch(`http://localhost:5000/api/fee-structures/${feeData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feeData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update fee structure");
      }
      
      const data = await response.json();
      console.log("Updated fee structure:", data);
      return data;
    } catch (err) {
      console.error("Error updating fee structure:", err);
      return null;
    }
  };

  // Function to delete a fee structure via API
  const deleteFeeStructureFromAPI = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/fee-structures/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete fee structure");
      }
      
      console.log("Deleted fee structure:", id);
      return true;
    } catch (err) {
      console.error("Error deleting fee structure:", err);
      return false;
    }
  };

  // Function to fetch updated fee structures
  const fetchFeeStructures = () => {
    fetch("http://localhost:5000/api/fee-structures")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const structuresWithTotal = data.map((structure: ClassFeeStructure) => ({
            ...structure,
            totalAnnualFee: calculateTotalAnnualFee(structure.categories)
          }));
          setFeeStructures(structuresWithTotal);
        }
      })
      .catch((err) => {
        console.error("Error refreshing fee structures:", err);
      });
  };

  const handleAddStructure = async () => {
    if (!newClassName) return;
    
    // Format the class name to ensure it has "Class" prefix
    const formattedClassName = newClassName.trim().match(/^\d+$/) 
      ? `Class ${newClassName}`
      : !newClassName.toLowerCase().startsWith('class') 
        ? `Class ${newClassName}`
        : newClassName;

    const newStructure: ClassFeeStructure = {
      id: Date.now().toString(),
      className: formattedClassName,
      totalAnnualFee: 0,
      categories: []
    };
    
    // Try to add to API first
    const result = await addFeeStructureToAPI(newStructure);
    
    // If API addition fails, the structure is already added to local state in the function
    // If API addition succeeds, the structures are fetched again
    
    setNewClassName('');
  };

  const handleDeleteStructure = async (id: string) => {
    // Try to delete from API first
    const success = await deleteFeeStructureFromAPI(id);
    
    // Always update local state regardless of API success
    setFeeStructures(feeStructures.filter(structure => structure.id !== id));
  };

  const handleAddCategory = (structureId: string) => {
    const newCategory: FeeCategory = {
      id: `${structureId}-${Date.now()}`,
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
      updateFeeStructureInAPI(updatedStructure).catch(err => {
        console.error("Failed to sync category addition with API:", err);
      });
    }
  };

  const handleUpdateCategory = (
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
      updateFeeStructureInAPI(updatedStructure).catch(err => {
        console.error("Failed to sync category update with API:", err);
      });
    }
  };

  const handleDeleteCategory = (structureId: string, categoryId: string) => {
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
      updateFeeStructureInAPI(updatedStructure).catch(err => {
        console.error("Failed to sync category deletion with API:", err);
      });
    }
  };

  const calculateTotalAnnualFee = (categories: FeeCategory[]): number => {
    return categories.reduce((total, category) => {
      const multiplier = category.frequency === 'Monthly' 
        ? 12 
        : category.frequency === 'Quarterly' 
          ? 4 
          : 1;
      return total + (category.amount * multiplier);
    }, 0);
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
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading fee structures...</p>
        </div>
      </div>
    );
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
            {error && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}
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
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by class name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="h-5 w-5 text-gray-400" />}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button
                variant="outline"
                onClick={() => toggleSort('totalAnnualFee')}
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {sortField === 'totalAnnualFee' 
                  ? `Annual Fee ${sortDirection === 'asc' ? '↑' : '↓'}` 
                  : 'Annual Fee'}
              </Button>
            </div>
          </div>
          
          {/* Expanded filter options */}
          {isFilterOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select
                    value={filterFrequency}
                    onChange={(e) => setFilterFrequency(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Frequencies</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="ghost" 
                    onClick={clearFilters}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                  </div>
              </div>
            </div>
          )}
        </div>

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
