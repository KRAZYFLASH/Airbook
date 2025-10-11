// Global type definitions for Airbook project
import React from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
  isVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface FlightSearchData {
  trip: "one-way" | "round-trip";
  from: string;
  to: string;
  departDate: string;
  returnDate?: string;
  passengers: number;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  from: Airport;
  to: Airport;
  departTime: string;
  arriveTime: string;
  duration: string;
  price: number;
  currency: string;
  availableSeats: number;
}

export interface BookingData {
  flight: Flight;
  passengers: PassengerData[];
  totalPrice: number;
  currency: string;
}

export interface PassengerData {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Props interfaces for components
export interface NavbarProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
}

export interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "tel" | "date";
  disabled?: boolean;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

// Utility types
export type LoadingState = "idle" | "loading" | "success" | "error";

export type Theme = "light" | "dark" | "system";

export type Language = "en" | "id";

export type Currency = "USD" | "IDR" | "EUR" | "SGD";
