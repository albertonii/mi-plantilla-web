// Tipos para el CMS y la aplicación
export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  photography: {
    total: number;
    available: number;
    sold: number;
  };
  projects: {
    total: number;
    completed: number;
    inProgress: number;
    planned: number;
  };
  sales: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  visits: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
}

export interface RecentActivity {
  id: string;
  type: 'photography' | 'project' | 'sale' | 'contact';
  action: string;
  title: string;
  time: string;
  data?: any;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'file' | 'date' | 'number' | 'url';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface ModalConfig {
  title: string;
  fields: FormField[];
  submitText: string;
  cancelText?: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FilterOptions {
  search?: string;
  status?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

// Tipos para formularios
export interface PhotographyForm {
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  date: string;
  tags: string[];
  status: 'available' | 'sold';
  image?: File;
}

export interface ProjectForm {
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  technologies: string[];
  role: string;
  status: 'completed' | 'in-progress' | 'planned';
  external_links?: {
    github?: string;
    live?: string;
    demo?: string;
  };
  image?: File;
}

export interface ProfileForm {
  name: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  avatar?: File;
}

export interface PasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// Tipos para configuración
export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  email: string;
  phone?: string;
  address?: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  features: {
    photography: boolean;
    projects: boolean;
    contact: boolean;
    cms: boolean;
  };
}

export interface AdminConfig {
  maxFileSize: number;
  allowedFileTypes: string[];
  maxPhotosPerPage: number;
  maxProjectsPerPage: number;
  enableNotifications: boolean;
  enableAnalytics: boolean;
}
