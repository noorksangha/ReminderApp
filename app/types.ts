// app/types.ts
import { StackNavigationProp } from '@react-navigation/stack';

// Define a reusable Reminder type
export type Reminder = {
  id: string;
  type: string;
  date?: string | Date; // Allow both string and Date types
  daysOfWeek?: number[];
  time?:{hour:number; minute:number} | null;
  description: string;
  videoUri: string;
  reminderMode: 'single' | 'repetitive';
};


export type RootStackParamList = {
  Home: undefined;
  AddReminder: undefined;
  ReminderDetails: {
    reminder: string; // Allow reminder to be a stringified JSON object
  };

};



export default {};


// Type definitions for navigation props
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type AddReminderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddReminder'>;
export type ReminderDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ReminderDetails'>;
export {}; // Ensure there's a valid export
