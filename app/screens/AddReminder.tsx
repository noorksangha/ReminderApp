// app/screens/AddReminderScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, Alert, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Reminder } from '../types';
import { useReminders } from '../context/RemindersContext';

type AddReminderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddReminder'>;

const reminderTypes = ['Medication', 'Exercise', 'Meeting'];

export default function AddReminderScreen() {
  const navigation = useNavigation<AddReminderScreenNavigationProp>();
  const { addReminder } = useReminders();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleDateConfirm = (pickedDate: Date) => {
    setDate(pickedDate);
    hideDatePicker();
  };

  const scheduleNotification = async () => {
    if (!selectedType || !date) {
      Alert.alert('Error', 'Please select a reminder type and date/time.');
      return;
    }

    const newReminder: Reminder = {
      id: Date.now().toString(),
      type: selectedType,
      date: date,
      description: `This is a reminder for ${selectedType}.`,
    };

    // Add the new reminder to the global context
    addReminder(newReminder);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Reminder: ${selectedType}`,
        body: 'Tap to see details',
        data: { type: selectedType },
      },
      trigger: date,
    });

    Alert.alert('Success', 'Reminder has been set!');
    navigation.navigate('Home');
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Select Reminder Type:</Text>
      
      {reminderTypes.map((type) => (
        <TouchableOpacity
          key={type}
          onPress={() => setSelectedType(type)}
          style={{
            padding: 10,
            marginVertical: 5,
            backgroundColor: selectedType === type ? '#4CAF50' : '#ddd',
            borderRadius: 5,
          }}
        >
          <Text>{type}</Text>
        </TouchableOpacity>
      ))}

      <Text style={{ fontSize: 18, marginVertical: 10 }}>Select Date and Time:</Text>

      <Button title="Pick Date & Time" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
      {date && <Text style={{ marginTop: 10 }}>Reminder set for: {date.toString()}</Text>}

      <Button title="Save Reminder" onPress={scheduleNotification} />
    </View>
  );
}
