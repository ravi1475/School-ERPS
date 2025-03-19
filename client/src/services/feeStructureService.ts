import { ClassFeeStructure, FeeCategory } from '../types/FeeStructureTypes';

const API_URL = 'http://localhost:5000/api'; // Base API URL

// Interface for API response
interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Get all fee structures
export const getFeeStructures = async (schoolId?: number): Promise<ClassFeeStructure[]> => {
  try {
    const queryParam = schoolId ? `?schoolId=${schoolId}` : '';
    const response = await fetch(`${API_URL}/fee-structures${queryParam}`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching fee structures:', error);
    throw error;
  }
};

// Get fee structure by ID
export const getFeeStructureById = async (id: string): Promise<ClassFeeStructure> => {
  try {
    const response = await fetch(`${API_URL}/fee-structures/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching fee structure ${id}:`, error);
    throw error;
  }
};

// Create fee structure
export const createFeeStructure = async (feeStructure: Partial<ClassFeeStructure>): Promise<ClassFeeStructure> => {
  try {
    // Ensure schoolId is set
    const payload = {
      ...feeStructure,
      schoolId: 1, // Default to school ID 1
    };

    const response = await fetch(`${API_URL}/fee-structures`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating fee structure:', error);
    throw error;
  }
};

// Update fee structure
export const updateFeeStructure = async (id: string, feeStructure: Partial<ClassFeeStructure>): Promise<ClassFeeStructure> => {
  try {
    // Ensure schoolId is set
    const payload = {
      ...feeStructure,
      schoolId: feeStructure.schoolId || 1, // Default to school ID 1 if not already set
    };

    const response = await fetch(`${API_URL}/fee-structures/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating fee structure ${id}:`, error);
    throw error;
  }
};

// Delete fee structure
export const deleteFeeStructure = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/fee-structures/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting fee structure ${id}:`, error);
    throw error;
  }
};

// Get all fee categories
export const getFeeCategories = async (): Promise<string[]> => {
  try {
    // Try the main endpoint first
    const response = await fetch(`${API_URL}/fee-categories`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate we got an array of strings
    if (Array.isArray(data)) {
      return data;
    } else {
      // If invalid data, try the check endpoint
      return await getFallbackCategories();
    }
  } catch (error) {
    // If error, try the check endpoint
    return await getFallbackCategories();
  }
};

// Fallback method to get categories from the check endpoint
const getFallbackCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/fee-categories/check`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.available_categories && Array.isArray(data.available_categories)) {
      return data.available_categories;
    } else {
      throw new Error("Invalid data from fallback endpoint");
    }
  } catch (error) {
    throw error;
  }
}; 