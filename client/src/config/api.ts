/**
 * API Configuration
 * This file contains the configuration for API endpoints.
 */

// Function to determine the correct API base URL
const getApiBaseUrl = () => {
  // Use environment variable if available
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback to localhost with the correct port from backend
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : `${window.location.protocol}//${window.location.hostname}/api`;
};

// Base API URL
export const API_BASE_URL = getApiBaseUrl();

// Student API endpoints
export const STUDENT_API = {
  BASE: `${API_BASE_URL}/students`,
  GET_ALL: `${API_BASE_URL}/students`,
  GET_BY_ID: (id: number | string) => `${API_BASE_URL}/students/${id}`,
  CREATE: `${API_BASE_URL}/students`,
  UPDATE: (id: number | string) => `${API_BASE_URL}/students/${id}`,
  DELETE: (id: number | string) => `${API_BASE_URL}/students/${id}`,
};

/**
 * Helper function to handle API responses
 * @param response - Fetch API response
 * @returns Parsed JSON response
 * @throws Error with error message from response
 */
export const handleApiResponse = async (response: Response) => {
  // Log response for debugging
  console.log(`API Response from ${response.url}:`, response.status);
  
  let data;
  try {
    // Try to parse as JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      console.warn('Non-JSON response received:', text);
      data = { 
        success: false, 
        message: 'Server returned a non-JSON response', 
        error: text.substring(0, 100) + (text.length > 100 ? '...' : '') 
      };
    }
  } catch (error) {
    console.error('Error parsing response:', error);
    throw new Error(`Failed to parse server response: ${response.statusText}`);
  }
  
  if (!response.ok) {
    const errorMessage = 
      data?.message || 
      data?.error || 
      (data?.errors && Array.isArray(data.errors) ? 
        data.errors.map((e: any) => e.msg).join(", ") :
        `Server error (${response.status}): ${response.statusText}`);
    
    console.error('API Error:', errorMessage);
    
    // Special handling for common error cases
    if (response.status === 500) {
      throw new Error(`Server error (500): Please check your server logs for details. ${errorMessage}`);
    } else if (response.status === 400) {
      throw new Error(`Bad request: ${errorMessage}`);
    } else if (response.status === 401) {
      throw new Error(`Authentication error: ${errorMessage}`);
    } else if (response.status === 403) {
      throw new Error(`Forbidden: ${errorMessage}`);
    } else if (response.status === 404) {
      throw new Error(`Not found: ${errorMessage}`);
    }
    
    throw new Error(errorMessage);
  }
  
  return data;
};

export default {
  API_BASE_URL,
  STUDENT_API,
  handleApiResponse
}; 