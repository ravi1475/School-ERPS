

import { IssuedCertificate, StudentDetails } from './types';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchStudentData = async (admissionNumber: string): Promise<StudentDetails> => {
  const response = await fetch(`${API_BASE_URL}/students/${admissionNumber}`);
  if (!response.ok) throw new Error('Student not found');
  return await response.json();
};

export const fetchIssuedCertificates = async (): Promise<IssuedCertificate[]> => {
  const response = await fetch(`${API_BASE_URL}/certificates`);
  if (!response.ok) throw new Error('Failed to fetch certificates');
  return await response.json();
};

export const createCertificate = async (certificate: IssuedCertificate): Promise<IssuedCertificate> => {
  const response = await fetch(`${API_BASE_URL}/certificates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(certificate)
  });
  if (!response.ok) throw new Error('Failed to create certificate');
  return await response.json();
};

export const updateCertificate = async (certificate: IssuedCertificate): Promise<IssuedCertificate> => {
  const response = await fetch(`${API_BASE_URL}/certificates/${certificate.admissionNumber}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(certificate)
  });
  if (!response.ok) throw new Error('Failed to update certificate');
  return await response.json();
};

export const deleteCertificate = async (admissionNumber: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/certificates/${admissionNumber}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete certificate');
};