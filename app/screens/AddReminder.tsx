import React, { useState } from 'react';
import { View, Text, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MultiSelect from 'react-native-multiple-select';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Reminder } from '../types';
import { useReminders } from '../context/RemindersContext';
import * as Notifications from 'expo-notifications';

type AddReminderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddReminder'>;

const reminderTypes = ['Break', 'Exercise', 'Water'];

export default function AddReminderScreen() {
  const navigation = useNavigation<AddReminderScreenNavigationProp>();
  const { addReminder } = useReminders();

  const [reminderMode, setReminderMode] = useState<'single' | 'repetitive'>('single');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [date, setDate] = useState<string | Date | null>(null);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [time, setTime] = useState<{ hour: number; minute: number } | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerMode, setPickerMode] = useState<'datetime' | 'time'>('datetime'); // To handle picker mode

  const weekdays = [
    { id: 1, name: 'Sunday' },
    { id: 2, name: 'Monday' },
    { id: 3, name: 'Tuesday' },
    { id: 4, name: 'Wednesday' },
    { id: 5, name: 'Thursday' },
    { id: 6, name: 'Friday' },
    { id: 7, name: 'Saturday' },
  ];
  
  const videos = {
    Break: require('@/assets/videos/break.mp4'),
    Exercise: require('@/assets/videos/excercise.mp4'),
    Water: require('@/assets/gifs/water.gif'),
  };
  const description ={
    "Break": 'Take care of your body. Its the only place you have to',
    "Exercise": 'Push yourself, because no one else is going to do it for you.',
    "Water": 'Opportunities don’t happen, you create them.',
  }

  const showDatePicker = (mode: 'datetime' | 'time') => {
    setPickerMode(mode);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleDateConfirm = (pickedDate: Date) => {
    if (pickerMode === 'datetime') {
      setDate(pickedDate as Date);
    } else {
      setTime({ hour: pickedDate.getHours(), minute: pickedDate.getMinutes() });
    }
    hideDatePicker();
  };

  const handleSaveReminder = async () => {
    if (!selectedType) {
      Alert.alert('Error', 'Please select a reminder type.');
      return;
    }

    if (reminderMode === 'single' && !date) {
      Alert.alert('Error', 'Please select a date and time for the reminder.');
      return;
    }

    if (reminderMode === 'repetitive' && (selectedDays.length === 0 || !time)) {
      Alert.alert('Error', 'Please select days of the week and a time for the reminder.');
      return;
    }

    const newReminder: Reminder = {
      id: Date.now().toString(),
      type: selectedType,
      reminderMode,
      date: reminderMode === 'single' ? (date as Date) : undefined,
      daysOfWeek: reminderMode === 'repetitive' ? selectedDays : undefined,
      time: reminderMode === 'repetitive' ? time : undefined,
      description: description[selectedType as keyof typeof description],
      videoUri: videos[selectedType as keyof typeof videos], // Type assertion here
    };

    addReminder(newReminder);

    if (reminderMode === 'single') {
      await scheduleSingleReminder(newReminder);
    } else {
      await scheduleRepetitiveReminder(newReminder);
    }

    navigation.navigate('Home');
  };

  const scheduleSingleReminder = async (reminder: Reminder) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Reminder: ${reminder.type}`,
          body: reminder.description,
          sound: 'default',
          data: {reminder},
        },
        trigger: new Date(reminder.date as Date),
      });

      Alert.alert('Success', 'Single reminder has been set!');
    } catch (error) {
      Alert.alert('Error', `Failed to schedule notification: ${error}`);
    }
  };

  const scheduleRepetitiveReminder = async (reminder: Reminder) => {
    try {
      for (const day of reminder.daysOfWeek || []) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Reminder: ${reminder.type}`,
            body: reminder.description,
            sound: 'default',
            data: {reminder},
          },
          trigger: {
            type: 'calendar',
            weekday: day,
            hour: reminder.time?.hour || 0,
            minute: reminder.time?.minute || 0,
            repeats: true,
          } as Notifications.CalendarTriggerInput,
        });
      }

      Alert.alert('Success', 'Repetitive reminder has been set!');
    } catch (error) {
      Alert.alert('Error', `Failed to schedule notification: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Reminder Mode:</Text>
      <View style={styles.modeSelector}>
        <TouchableOpacity
          onPress={() => setReminderMode('single')}
          style={[styles.button, reminderMode === 'single' && styles.selectedButton]}
        >
          <Text>Single</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setReminderMode('repetitive')}
          style={[styles.button, reminderMode === 'repetitive' && styles.selectedButton]}
        >
          <Text>Repetitive</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Select Reminder Type:</Text>
      {reminderTypes.map((type) => (
        <TouchableOpacity
          key={type}
          onPress={() => setSelectedType(type)}
          style={[styles.button, selectedType === type && styles.selectedButton]}
        >
          <Text>{type}</Text>
        </TouchableOpacity>
      ))}

      {reminderMode === 'single' && (
        <>
          <Text style={styles.title}>Select Date and Time:</Text>
          <Button title="Pick Date & Time" onPress={() => showDatePicker('datetime')} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode={pickerMode}
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
          />
          {date && <Text>Selected Date: {date.toString()}</Text>}
        </>
      )}

      {reminderMode === 'repetitive' && (
        <>
          <Text style={styles.title}>Select Days of the Week:</Text>
          <MultiSelect
            items={weekdays}
            uniqueKey="id"
            onSelectedItemsChange={(selectedItems) => setSelectedDays(selectedItems)}
            selectedItems={selectedDays}
            selectText="Pick Days"
            searchInputPlaceholderText="Search Days..."
          />
          <Text style={styles.title}>Select Time:</Text>
          <Button title="Pick Time" onPress={() => showDatePicker('time')} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode={pickerMode}
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
          />
          {time && (
            <Text>
              Selected Time: {time.hour}:{time.minute < 10 ? `0${time.minute}` : time.minute}
            </Text>
          )}
        </>
      )}

      <Button title="Save Reminder" onPress={handleSaveReminder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginVertical: 10,
  },
  button: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});
