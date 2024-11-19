// app/context/RemindersContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Reminder } from '../types';

type RemindersContextType = {
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  removeReminder: (id: string) => void;
  updateReminder: (reminder: Reminder) => void;
  clearReminders: () => void;
  toggleCompleteReminder: (id: string) => void;
};

const RemindersContext = createContext<RemindersContextType | undefined>(undefined);

export const RemindersProvider = ({ children }: { children: ReactNode }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const addReminder = (reminder: Reminder) => {
    setReminders((prevReminders) => [...prevReminders, reminder]);
  };

  const removeReminder = (id: string) =>
  setReminders(prev => prev.filter(r => r.id !== id));

  const updateReminder = (updatedReminder: Reminder) =>
  setReminders(prev => prev.map(r => (r.id === updatedReminder.id ? updatedReminder : r))
  );

  const clearReminders = () => setReminders([]);

  const toggleCompleteReminder = (id: string) =>
  setReminders(prev =>
  prev.map(r => (r.id === id ? { ...r, completed: !r.completed } : r))
  );

  return (
    <RemindersContext.Provider
    value={{
    reminders,
    addReminder,
    removeReminder,
    updateReminder,
    clearReminders,
    toggleCompleteReminder,
    }}
    >
      {children}
    </RemindersContext.Provider>
  );
};

export const useReminders = () => {
  const context = useContext(RemindersContext);
  if (!context) {
    throw new Error('useReminders must be used within a RemindersProvider');
  }
  return context;
};
