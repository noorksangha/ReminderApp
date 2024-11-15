// app/screens/ReminderDetailsScreen.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

type ReminderDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ReminderDetails'>;
type ReminderDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ReminderDetails'>;

export default function ReminderDetailsScreen() {
  const navigation = useNavigation<ReminderDetailsScreenNavigationProp>();
  const route = useRoute<ReminderDetailsScreenRouteProp>();

  const { reminder } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Reminder Details Screen</Text>
      <Text>Type: {reminder.type}</Text>
      <Text>Date: {reminder.date.toLocaleString()}</Text>
      <Text>Description: {reminder.description}</Text>
      <Button title="Go Back to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}
