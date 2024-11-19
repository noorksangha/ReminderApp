import React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../types';
import { useReminders } from '../context/RemindersContext';
import { Reminder } from '../types';

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { reminders, removeReminder, updateReminder } = useReminders();

  // Navigate to Add Reminder Screen
  const navigateToAddReminder = () => {
    navigation.navigate('AddReminder');
  };

    // Specify that reminder is of type Reminder
    const navigateToReminderDetails = (reminder: Reminder) => {
      navigation.navigate('ReminderDetails', {
        reminder: {
          ...reminder,
          date: reminder.date instanceof Date ? reminder.date.toISOString() : reminder.date, // Ensure date is serialized
        },
      });
    };

   // Remove a reminder
   const handleDeleteReminder = (id: string) => {
     Alert.alert(
       'Delete Reminder',
       'Are you sure you want to delete this reminder?',
       [
         {
           text: 'Cancel',
           style: 'cancel',
         },
         {
           text: 'OK',
           onPress: () => removeReminder(id),
         },
       ]
     );
   };

//Navigate to Update Reminder Screen
// const navigateToUpdateReminder = (reminder: Reminder) => {
// navigate.navigate('UpdateReminder', {reminder});
// };


  return (
    <View style={{ flex: 1, padding: 20 }}>
  <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Pending Reminders</Text>

  <FlatList
    style={{ flexGrow: 0 }} // Prevent FlatList from taking over the screen
    data={reminders}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={{
          padding: 10,
          marginVertical: 5,
          backgroundColor: '#f9f9f9',
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 5,
        }}
        onPress={() => navigateToReminderDetails(item)}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.type}</Text>
        <Text style={{ fontSize: 14, color: '#666' }}>
          {item.date instanceof Date ? item.date.toLocaleString() : ''}
        </Text>
        <TouchableOpacity onPress={() => handleDeleteReminder(item.id)}>
         <Text style={{ fontSize: 14, color: 'red', fontWeight: 'bold' }}>Delete</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    )}
  />

  <Button title="Add Reminder" onPress={navigateToAddReminder} />
</View>

  );
}
