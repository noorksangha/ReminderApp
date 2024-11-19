import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import HomeScreen from '../screens/HomeScreen';
import AddReminderScreen from '../screens/AddReminder';
import ReminderDetailsScreen from '../screens/ReminderDetails';
import { RemindersProvider } from '../context/RemindersContext';
import { useColorScheme } from 'react-native';
import { MyLightTheme, MyDarkTheme } from '../themes';
import {Reminder, ReminderDetailsScreenNavigationProp} from '../types';

const Stack = createStackNavigator();

export default function MainNavigator() {
    const navigation = useNavigation<ReminderDetailsScreenNavigationProp>();
    const colorScheme = useColorScheme();  // Detects the system theme (light or dark)
  const [theme, setTheme] = useState('light'); // toggles theme according to current theme

  const currentTheme = colorScheme === 'light' ? MyLightTheme : MyDarkTheme; // Choose theme based on state


    useEffect(() => {
        // Set up the notification response listener
        const notificationResponseListener = Notifications.addNotificationResponseReceivedListener((response) => {
            // Extract the reminder data from the notification response
            const reminder: Reminder = response.notification.request.content.data.reminder;

            console.log('Notification tapped:', reminder);

            // Navigate to the ReminderDetails screen with the reminder data
            navigation.navigate('ReminderDetails', { reminder });
        });

        // Clean up the listener when the component unmounts
        return () => {
            notificationResponseListener.remove();
        };
    }, [navigation]); // Make sure navigation is in the dependency array

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
