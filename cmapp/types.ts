
export type AppTheme = 'light' | 'dark' | 'sepia';
export type AppLanguage = 'en' | 'ar';
export type AppointmentStatus = 'Upcoming' | 'Completed' | 'Missed';
export type PersonStatus = 'Active' | 'Overdue' | 'Inactive';
export type Gender = 'Male' | 'Female';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface HistoryEntry {
  id: string;
  date: string;
  status: 'Attended' | 'Missed';
  notes?: string;
  appointmentId?: string; // Link to the agenda session for reversal
}

export interface Person {
  id: string;
  name: string;
  category: string;
  church: string;
  phone: string;
  gender: Gender;
  birthYear?: number;
  serviceGroup?: string;
  address?: string;
  notes?: string;
  nextAppointmentDate?: string;
  lastConfessionDate?: string;
  history: HistoryEntry[];
  isArchived: boolean;
  status?: PersonStatus;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  notes?: string;
  attendees: { personId: string; status: 'Pending' | 'Attended' | 'Missed' }[];
  status: AppointmentStatus;
  type?: 'Individual' | 'Group';
}

export interface AppState {
  version: string;
  people: Person[];
  appointments: Appointment[];
  settings: {
    theme: AppTheme;
    language: AppLanguage;
    reminderTime: string;
    notificationsEnabled: boolean;
    categories: string[];
  };
  ui: {
    toasts: Toast[];
  };
}
