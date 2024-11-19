import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import HomeScreen from '../screens/HomeScreen';
import AddReminderScreen from '../screens/AddReminder';
import ReminderDetailsScreen from '../screens/ReminderDetails';
import { RemindersProvider } from '../context/RemindersContext';
import { Reminder } from '../types';
import { CommonActions } from '@react-navigation/native';

const Stack = createStackNavigator();

export default function MainNavigator() {
  const navigation = useNavigation(); // Access navigation object


// useEffect(() => {
//   const notificationResponseListener = Notifications.addNotificationResponseReceivedListener((response) => {
//     const reminder = response.notification.request.content.data.reminder;
//     console.log('Notification tapped:', reminder);
//
//     // Debugging: Check if navigation is being called correctly
//     if (reminder && navigation) {
//       console.log('Navigating to ReminderDetails...');
//       navigation.navigate('ReminderDetails', { reminder });
//     } else {
//       console.log('Reminder or navigation is undefined');
//     }
//   });
//
//   return () => {
//     notificationResponseListener.remove();
//   };
// }, [navigation]);



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
