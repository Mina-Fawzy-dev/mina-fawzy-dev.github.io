
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Person, Appointment, AppState, AppTheme, AppLanguage, Toast, HistoryEntry } from './types';

interface StoreContextType {
  state: AppState;
  setTheme: (theme: AppTheme) => void;
  setLanguage: (lang: AppLanguage) => void;
  updateSettings: (updates: Partial<AppState['settings']>) => void;
  addPerson: (person: Omit<Person, 'id' | 'history' | 'isArchived'>) => void;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  archivePeople: (ids: string[]) => void;
  restorePeople: (ids: string[]) => void;
  deletePermanently: (ids: string[]) => void;
  addAppointment: (app: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  finalizeAppointment: (id: string) => void;
  unfinalizeAppointment: (id: string) => void;
  updateAppointmentAttendance: (appId: string, personId: string, status: 'Attended' | 'Missed') => void;
  deleteAppointment: (id: string) => void;
  importData: (data: AppState) => void;
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  addCategory: (name: string) => boolean;
  removeCategory: (name: string) => void;
  renameCategory: (oldName: string, newName: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

const INITIAL_DATA: AppState = {
  version: "1.0.7",
  people: [],
  appointments: [],
  settings: {
    theme: 'light',
    language: 'en',
    reminderTime: '09:00',
    notificationsEnabled: false,
    categories: ['Child', 'Youth', 'Adult', 'Elderly']
  },
  ui: {
    toasts: []
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('confession_manager_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_DATA, ...parsed };
      } catch (e) {
        return INITIAL_DATA;
      }
    }
    return INITIAL_DATA;
  });

  useEffect(() => {
    try {
      localStorage.setItem('confession_manager_v1', JSON.stringify(state));
    } catch (e) {
      console.error("Storage Error:", e);
    }
  }, [state]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = generateId();
    setState(prev => ({
      ...prev,
      ui: { ...prev.ui, toasts: [...prev.ui.toasts, { id, message, type }] }
    }));
    setTimeout(() => removeToast(id), 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      ui: { ...prev.ui, toasts: prev.ui.toasts.filter(t => t.id !== id) }
    }));
  }, []);

  const safeUpdate = (fn: (prev: AppState) => AppState, successMsg?: string) => {
    setState(prev => {
      try {
        const next = fn(prev);
        if (successMsg) {
          setTimeout(() => addToast(successMsg, 'success'), 0);
        }
        return next;
      } catch (err) {
        console.error("Store Update Error:", err);
        setTimeout(() => addToast("Update failed: data mismatch", 'error'), 0);
        return prev;
      }
    });
  };

  const setTheme = (theme: AppTheme) => safeUpdate(prev => ({ ...prev, settings: { ...prev.settings, theme } }));
  const setLanguage = (language: AppLanguage) => safeUpdate(prev => ({ ...prev, settings: { ...prev.settings, language } }));
  const updateSettings = (updates: Partial<AppState['settings']>) => safeUpdate(prev => ({ ...prev, settings: { ...prev.settings, ...updates } }));

  const addCategory = (name: string) => {
    const clean = name.trim();
    if (!clean || state.settings.categories.includes(clean)) return false;
    safeUpdate(prev => ({
      ...prev,
      settings: { ...prev.settings, categories: [...prev.settings.categories, clean] }
    }), `Category "${clean}" added`);
    return true;
  };

  const removeCategory = (name: string) => {
    safeUpdate(prev => ({
      ...prev,
      settings: { ...prev.settings, categories: prev.settings.categories.filter(c => c !== name) }
    }), `Category removed`);
  };

  const renameCategory = (oldName: string, newName: string) => {
    const clean = newName.trim();
    if (!clean || state.settings.categories.includes(clean) || oldName === clean) return;
    safeUpdate(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        categories: prev.settings.categories.map(c => c === oldName ? clean : c)
      },
      people: prev.people.map(p => p.category === oldName ? { ...p, category: clean } : p)
    }), `Category renamed to "${clean}"`);
  };

  const addPerson = (person: Omit<Person, 'id' | 'history' | 'isArchived'>) => {
    const id = generateId();
    const history: HistoryEntry[] = person.lastConfessionDate ? [{
      id: generateId(),
      date: person.lastConfessionDate,
      status: 'Attended',
      notes: 'Initial record'
    }] : [];

    safeUpdate(prev => ({
      ...prev,
      people: [...prev.people, { ...person, id, history, isArchived: false, status: 'Active' }]
    }), `${person.name} added`);
  };

  const updatePerson = (id: string, updates: Partial<Person>) => {
    safeUpdate(prev => ({
      ...prev,
      people: prev.people.map(p => p.id === id ? { ...p, ...updates } : p)
    }), "Changes saved");
  };

  const archivePeople = (ids: string[]) => {
    safeUpdate(prev => ({
      ...prev,
      people: prev.people.map(p => ids.includes(p.id) ? { ...p, isArchived: true } : p)
    }), `${ids.length} moved to trash`);
  };

  const restorePeople = (ids: string[]) => {
    safeUpdate(prev => ({
      ...prev,
      people: prev.people.map(p => ids.includes(p.id) ? { ...p, isArchived: false } : p)
    }), "Restored to directory");
  };

  const deletePermanently = (ids: string[]) => {
    safeUpdate(prev => ({
      ...prev,
      people: prev.people.filter(p => !ids.includes(p.id)),
      appointments: prev.appointments.map(app => ({
        ...app,
        attendees: app.attendees.filter(att => !ids.includes(att.personId))
      }))
    }), "Permanently deleted");
  };

  const addAppointment = (app: Omit<Appointment, 'id'>) => {
    safeUpdate(prev => ({
      ...prev,
      appointments: [...prev.appointments, { ...app, id: generateId() }]
    }), "Session scheduled");
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    safeUpdate(prev => ({
      ...prev,
      appointments: prev.appointments.map(app => app.id === id ? { ...app, ...updates } : app)
    }), "Appointment updated");
  };

  const updateAppointmentAttendance = (appId: string, personId: string, status: 'Attended' | 'Missed') => {
    setState(prev => ({
      ...prev,
      appointments: prev.appointments.map(app => 
        app.id === appId ? {
          ...app,
          attendees: app.attendees.map(att => att.personId === personId ? { ...att, status } : att)
        } : app
      )
    }));
  };

  const finalizeAppointment = (id: string) => {
    safeUpdate(prev => {
      const app = prev.appointments.find(a => a.id === id);
      if (!app) return prev;

      const updatedPeople = prev.people.map(person => {
        const attendance = app.attendees.find(att => att.personId === person.id);
        if (!attendance || attendance.status === 'Pending') return person;
        
        const newEntry: HistoryEntry = {
          id: generateId(),
          date: app.date,
          status: attendance.status as 'Attended' | 'Missed',
          notes: app.notes,
          appointmentId: app.id 
        };

        const newHistory = [...person.history, newEntry];
        const lastAtt = [...newHistory]
          .filter(h => h.status === 'Attended')
          .sort((a, b) => b.date.localeCompare(a.date))[0];

        return {
          ...person,
          history: newHistory,
          lastConfessionDate: lastAtt ? lastAtt.date : person.lastConfessionDate
        };
      });

      return {
        ...prev,
        people: updatedPeople,
        appointments: prev.appointments.map(a => a.id === id ? { ...a, status: 'Completed' } : a)
      };
    }, "Session finalized");
  };

  const unfinalizeAppointment = (id: string) => {
    safeUpdate(prev => {
      const app = prev.appointments.find(a => a.id === id);
      if (!app) throw new Error("Appointment not found");

      const updatedPeople = prev.people.map(person => {
        const newHistory = person.history.filter(h => h.appointmentId !== id);
        const lastAtt = [...newHistory]
          .filter(h => h.status === 'Attended')
          .sort((a, b) => b.date.localeCompare(a.date))[0];

        return {
          ...person,
          history: newHistory,
          lastConfessionDate: lastAtt ? lastAtt.date : undefined
        };
      });

      return {
        ...prev,
        people: updatedPeople,
        appointments: prev.appointments.map(a => a.id === id ? { ...a, status: 'Upcoming' } : a)
      };
    }, "Session reverted");
  };

  const deleteAppointment = (id: string) => {
    safeUpdate(prev => {
      const app = prev.appointments.find(a => a.id === id);
      if (!app) throw new Error("Appointment not found");

      // Remove from people history if it was completed
      const updatedPeople = app.status === 'Completed' ? prev.people.map(person => {
        const newHistory = person.history.filter(h => h.appointmentId !== id);
        const lastAtt = [...newHistory]
          .filter(h => h.status === 'Attended')
          .sort((a, b) => b.date.localeCompare(a.date))[0];

        return {
          ...person,
          history: newHistory,
          lastConfessionDate: lastAtt ? lastAtt.date : undefined
        };
      }) : prev.people;

      return {
        ...prev,
        people: updatedPeople,
        appointments: prev.appointments.filter(a => a.id !== id)
      };
    }, "Appointment deleted");
  };

  const importData = (data: AppState) => {
    safeUpdate(() => ({ ...data, ui: { toasts: [] } }), "Data restored");
  };

  return (
    <StoreContext.Provider value={{
      state, setTheme, setLanguage, updateSettings, addPerson, updatePerson,
      archivePeople, restorePeople, deletePermanently,
      addAppointment, updateAppointment, finalizeAppointment, unfinalizeAppointment, updateAppointmentAttendance, deleteAppointment,
      importData, addToast, removeToast, addCategory, removeCategory, renameCategory
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
