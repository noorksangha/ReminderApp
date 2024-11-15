// app/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../types';
import { useReminders } from '../context/RemindersContext';
import { Reminder } from '../types'; // Import the Reminder type

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { reminders } = useReminders();

  const navigateToAddReminder = () => {
    navigation.navigate('AddReminder');
  };

  // Specify that `reminder` is of type `Reminder`
  const navigateToReminderDetails = (reminder: Reminder) => {
    navigation.navigate('ReminderDetails', { reminder });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Pending Reminders</Text>

      <FlatList
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
            <Text>{item.type}</Text>
            <Text>{item.date.toLocaleString()}</Text>
          </TouchableOpacity>
        )}
      />

      <Button title="Add Reminder" onPress={navigateToAddReminder} />
    </View>
  );
}
