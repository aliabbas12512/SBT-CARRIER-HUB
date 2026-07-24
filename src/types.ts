export interface Job {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  requirements: string;
  salary?: string;
  whatsapp_number: string;
  email: string;
  phone: string;
  created_at: string;
  company_name?: string;
}

export type JobCategory =
  | 'Construction'
  | 'Driving'
  | 'Hospitality'
  | 'Retail'
  | 'Healthcare'
  | 'IT'
  | 'Security'
  | 'Cleaning'
  | 'Delivery'
  | 'Admin/Office'
  | 'Other';

export type JobLocation =
  | 'Riyadh'
  | 'Jeddah'
  | 'Dammam'
  | 'Mecca'
  | 'Medina'
  | 'Khobar'
  | 'Taif'
  | 'Abha'
  | 'Jubail'
  | 'Yanbu'
  | 'Other';

export interface FilterState {
  searchQuery: string;
  category: string;
  location: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
}

export interface BulkUploadResult {
  successCount: number;
  skippedCount: number;
  errors: Array<{ rowNumber: number; reason: string }>;
}
