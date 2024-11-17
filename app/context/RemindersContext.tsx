// app/context/RemindersContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Reminder } from '../types';

type RemindersContextType = {
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
};

const RemindersContext = createContext<RemindersContextType | undefined>(undefined);

export const RemindersProvider = ({ children }: { children: ReactNode }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);


  const addReminder = (reminder: Reminder) => {
    setReminders((prevReminders) => [...prevReminders, reminder]);
  };

  return (
    <RemindersContext.Provider value={{ reminders, addReminder }}>
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
