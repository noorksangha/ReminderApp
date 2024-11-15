// app/tabs/index.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddReminderScreen from '../screens/AddReminder';
import ReminderDetailsScreen from '../screens/ReminderDetails';
import { RemindersProvider } from '../context/RemindersContext';

const Stack = createStackNavigator();

export default function MainNavigator() {
  return (
    <RemindersProvider>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddReminder" component={AddReminderScreen} />
        <Stack.Screen name="ReminderDetails" component={ReminderDetailsScreen} />
      </Stack.Navigator>
    </RemindersProvider>
  );
}
