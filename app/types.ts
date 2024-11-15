// app/types.ts
import { StackNavigationProp } from '@react-navigation/stack';

// Define a reusable Reminder type
export type Reminder = {
  id: string;
  type: string;
  date: Date;
  description: string;
};

// Update RootStackParamList with consistent types
// app/types.ts
export type RootStackParamList = {
  Home: undefined;
  AddReminder: undefined; // Remove the onAddReminder parameter here
  ReminderDetails: { reminder: Reminder }; // Keep the reminder parameter for ReminderDetails
};

// Type definitions for navigation props
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type AddReminderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddReminder'>;
export type ReminderDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ReminderDetails'>;
