export interface FeeCategory {
  id: string;
  name: string;
  amount: number;
  frequency: 'Monthly' | 'Quarterly' | 'Yearly';
  description?: string;
}

export interface ClassFeeStructure {
  id: string;
  className: string;
  totalAnnualFee: number;
  categories: FeeCategory[];
  description?: string;
  schoolId?: number;
}

// Default fee categories for selection
export const DEFAULT_CATEGORIES = [
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

// Function to calculate the total annual fee
export const calculateTotalAnnualFee = (categories: FeeCategory[]): number => {
  return categories.reduce((total, category) => {
    const multiplier = category.frequency === 'Monthly' 
      ? 12 
      : category.frequency === 'Quarterly' 
        ? 4 
        : 1;
    return total + (category.amount * multiplier);
  }, 0);
}; 