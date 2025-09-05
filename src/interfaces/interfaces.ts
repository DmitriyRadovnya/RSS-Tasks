import type { ReactNode } from 'react';

export interface IFormData {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: 'Male' | 'Female';
  avatar: string;
  terms: boolean;
  country: string;
}

export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}
