// app/context/RemindersContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Reminder } from '../types';

type RemindersContextType = {
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
};

const RemindersContext = createContext<RemindersContextType | undefined>(undefined);

export const RemindersProvider = ({ children }: { children: ReactNode }) => {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', type: 'Medication', date: new Date(Date.now() + 60 * 60 * 1000), description: 'Take your medication' , videoUri:'https://www.youtube.com/watch?v=inpok4MKVLM'},
    { id: '2', type: 'Exercise', date: new Date(Date.now() + 2 * 60 * 60 * 1000), description: 'Time for a workout', videoUri:'https://www.youtube.com/watch?v=l9_SoClAO5g' },
    { id: '3', type: 'Meeting', date: new Date(Date.now() + 3 * 60 * 60 * 1000), description: 'Project meeting' , videoUri:'https://www.youtube.com/watch?v=l9_SoClAO5g'},
  ]);

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
