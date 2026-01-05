import { Factory, Truck, Store, ShoppingCart, type LucideIcon } from 'lucide-react';

// User role types matching backend
export enum UserRole {
  MANUFACTURER = 'MANUFACTURER',
  DISTRIBUTOR = 'DISTRIBUTOR',
  RETAILER = 'RETAILER',
  CUSTOMER = 'CUSTOMER'
}

// Registration form data interface
export interface RegistrationData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  
  // Role and Company Information
  role: UserRole;
  company: string;
  jobTitle?: string;
  department?: string;
  
  // Business Address
  address?: string;
  
  // Blockchain Identity
  walletAddress: string;
  
  // Preferences
  timezone?: string;
  locale?: string;
}

export interface RoleConfig {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  features: string[];
}

// Role configuration for different user types
export const roleConfigs: Record<UserRole, RoleConfig> = {
  [UserRole.MANUFACTURER]: {
    title: 'Manufacturer Registration',
    description: 'Create, track, and manage your products throughout the supply chain',
    icon: Factory,
    color: 'bg-blue-500',
    features: [
      'Create and register products on blockchain',
      'Track products from manufacturing to sale',
      'Manage product metadata and specifications',
      'Monitor supply chain analytics',
      'Quality assurance tracking'
    ]
  },
  [UserRole.DISTRIBUTOR]: {
    title: 'Distributor Registration', 
    description: 'Manage product distribution and logistics across the supply chain',
    icon: Truck,
    color: 'bg-green-500',
    features: [
      'Receive products from manufacturers',
      'Update product locations and status',
      'Manage inventory across warehouses',
      'Coordinate with retailers',
      'Track shipping and delivery'
    ]
  },
  [UserRole.RETAILER]: {
    title: 'Retailer Registration',
    description: 'Sell products and provide final customer experience',
    icon: Store,
    color: 'bg-purple-500',
    features: [
      'Receive products from distributors',
      'Manage retail inventory',
      'Complete final sales transactions',
      'Customer interaction tracking',
      'Sales analytics and reporting'
    ]
  },
  [UserRole.CUSTOMER]: {
    title: 'Customer Registration',
    description: 'Track and verify your purchased products',
    icon: ShoppingCart,
    color: 'bg-orange-500',
    features: [
      'Verify product authenticity',
      'View complete product history',
      'Track product journey',
      'Quality and safety information',
      'Direct manufacturer communication'
    ]
  }
};
