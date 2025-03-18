import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { StudentFormData } from '../components/StudentForm/StudentFormTypes';
import { STUDENT_API } from '../config/api';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface StudentListResponse {
  success: boolean;
  data: StudentFormData[];
  pagination: Pagination;
}

interface UseStudentManagementReturn {
  students: StudentFormData[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  deleteStudent: (id: string) => Promise<void>;
  fetchStudents: (page?: number, limit?: number) => Promise<void>;
  refreshStudents: () => Promise<void>;
}

export const useStudentManagement = (schoolId = '1'): UseStudentManagementReturn => {
  const [students, setStudents] = useState<StudentFormData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchStudents = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get<StudentListResponse>(
        `${STUDENT_API.GET_ALL}?page=${page}&limit=${limit}&schoolId=${schoolId}`
      );
      
      if (response.data.success) {
        setStudents(response.data.data);
        setPagination(response.data.pagination);
      } else {
        throw new Error('Failed to fetch students');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  const refreshStudents = useCallback(() => {
    return fetchStudents(pagination.page, pagination.limit);
  }, [fetchStudents, pagination.page, pagination.limit]);

  const deleteStudent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.delete(STUDENT_API.DELETE(id));
      
      if (response.data.success) {
        // After successful deletion, refresh the student list
        await refreshStudents();
        return;
      } else {
        throw new Error('Failed to delete student');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the student');
      console.error('Error deleting student:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshStudents]);

  // Initial fetch
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    loading,
    error,
    pagination,
    deleteStudent,
    fetchStudents,
    refreshStudents
  };
}; 