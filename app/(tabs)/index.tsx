import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddReminderScreen from '../screens/AddReminder';
import ReminderDetailsScreen from '../screens/ReminderDetails';
import { RemindersProvider } from '../context/RemindersContext';
import { useColorScheme } from 'react-native';
import { MyLightTheme, MyDarkTheme } from '../themes';

const Stack = createStackNavigator();

export default function MainNavigator() {
    const colorScheme = useColorScheme();  // Detects the system theme (light or dark)
    const currentTheme = colorScheme === 'light' ? MyLightTheme : MyDarkTheme; // Choose theme based on state

  return (
    <RemindersProvider>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: currentTheme.colors.primary, // Header background based on theme
          },
          headerTintColor: currentTheme.colors.text, // Text color in header based on theme
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddReminder" component={AddReminderScreen} />
        <Stack.Screen name="ReminderDetails" component={ReminderDetailsScreen} />
      </Stack.Navigator>
 </RemindersProvider>
  );
}
