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


  const scheduleNotification = async (reminder: Reminder) => {
    const quotes = {
      Medication: "Take care of your body. It's the only place you have to live.",
      Exercise: 'Push yourself, because no one else is going to do it for you.',
      Meeting: 'Opportunities don’t happen, you create them.',
    };
  
  
    const videos = {
      Medication: 'https://www.youtube.com/watch?v=inpok4MKVLM',
      "Exercise": require('@/assets/videos/excercise.mp4'),
      Meeting: 'https://www.youtube.com/watch?v=l9_SoClAO5g',
    };
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Reminder: ${reminder.type}`,
          body: reminder.description,
          sound: true,
          data: { reminder ,
            quote: quotes,
            videoUri: videos,}, // Optional: Pass reminder data to the notification
        },
        trigger: new Date(reminder.date), // Use the date directly for the notification trigger
      });
  
      Alert.alert('Success', 'Reminder has been set!');
    } catch (error) {
           const errorMessage =
            error instanceof Error ? error.message : 'An unknown error occurred';
           Alert.alert('Error', `Failed to schedule the notification: ${errorMessage}`);
        }
  };
  
  
  

  const handleSaveReminder = async () => {
    if (!selectedType || !date) {
      Alert.alert('Error', 'Please select a reminder type and date/time.');
      return;
    }
    const videos = {
      "Medication": 'https://www.youtube.com/watch?v=inpok4MKVLM',
      "Exercise": require('@/assets/videos/excercise.mp4'),
      "Meeting": 'https://www.youtube.com/watch?v=l9_SoClAO5g',
    };

    const newReminder: Reminder = {
      id: Date.now().toString(),
      type: selectedType,
      date: date,
      description: `This is a reminder for ${selectedType}.`,
      videoUri: videos[selectedType as keyof typeof videos], // Type assertion here
    };

    // Add the new reminder to the global context
    addReminder(newReminder);

    // Schedule a notification for the new reminder
    await scheduleNotification(newReminder);

    Alert.alert('Success', 'Reminder has been set!');
    navigation.navigate('Home'); // Navigate back to the Home screen
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

      <Button title="Save Reminder" onPress={handleSaveReminder} />
    </View>
  );
}
