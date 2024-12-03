import React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../types';
import { useReminders } from '../context/RemindersContext';
import { Reminder } from '../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { reminders, removeReminder } = useReminders();

  // Navigate to Add Reminder Screen
  const navigateToAddReminder = () => {
    navigation.navigate('AddReminder');
  };

  // Navigate to Reminder Details Screen with serialized reminder
  const navigateToReminderDetails = (reminder: Reminder) => {
    navigation.navigate('ReminderDetails', {
      reminder: JSON.stringify({
        ...reminder,
        date: reminder.date instanceof Date ? reminder.date.toISOString() : reminder.date, // Ensure date is serialized
      }),
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

  // Format days of the week for display
  const formatDaysOfWeek = (daysOfWeek: number[] | undefined) => {
    if (!daysOfWeek || daysOfWeek.length === 0) return '';
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek.map((day) => dayNames[day - 1]).join(', ');
  };

  // Format time for display
  // Format time for display
    const formatTime = (time: { hour: number; minute: number } | null | undefined): string => {
        if (!time) return ''; // Handle null or undefined

        let hour = time.hour;
        const minute = time.minute < 10 ? `0${time.minute}` : time.minute; // Always show minutes with two digits
        const ampm = hour >= 12 ? 'PM' : 'AM'; // Determine AM or PM

        hour = hour % 12; // Convert to 12-hour format
        hour = hour ? hour : 12; // If hour is 0 (midnight), display 12 instead

        return `${hour}:${minute} ${ampm}`;
    };



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
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              padding: 10,
              marginVertical: 5,
              backgroundColor: '#f9f9f9',
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 5,
            }}
            onPress={() => navigateToReminderDetails(item)}
          >
              <View style={{flex: 1}}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.type}</Text>
            {item.reminderMode === 'single' && (
              <Text style={{ fontSize: 14, color: '#666' }}>
                {item.date instanceof Date ? item.date.toLocaleString() : item.date}
              </Text>
            )}
            {item.reminderMode === 'repetitive' && (
              <>
                <Text style={{ fontSize: 14, color: '#666' }}>
                  Repeat On: {formatDaysOfWeek(item.daysOfWeek)}
                </Text>
                <Text style={{ fontSize: 14, color: '#666' }}>Time: {formatTime(item.time)}</Text>
              </>
            )}
              </View>

            <TouchableOpacity onPress={() => handleDeleteReminder(item.id)}>
                <Icon name="delete" size={20} color="red" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
      <Button title="Add Reminder" onPress={navigateToAddReminder} />
    </View>
  );
}
