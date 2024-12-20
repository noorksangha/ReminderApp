import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types'; // Ensure this is correctly imported
import { useVideoPlayer, VideoView } from 'expo-video';

// Define the type for the route prop
type ReminderDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ReminderDetails'>;

export default function ReminderDetailsScreen() {
  const route = useRoute<ReminderDetailsScreenRouteProp>(); // Type the route
  const navigation = useNavigation(); // Use the navigation hook

  // Parse the reminder object from the stringified JSON in route params
  const reminder = route.params?.reminder ? JSON.parse(route.params.reminder as unknown as string) : null;
  const formatDaysOfWeek = (daysOfWeek: number[] | undefined): string => {
    if (!daysOfWeek || daysOfWeek.length === 0) return 'No days selected';
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek.map((day) => dayNames[day - 1]).join(', ');
  };
  
  const formatTime = (time: { hour: number; minute: number } | null): string => {
    if (!time) return 'No time set';
    const formattedHour = time.hour.toString().padStart(2, '0');
    const formattedMinute = time.minute.toString().padStart(2, '0');
    return `${formattedHour}:${formattedMinute}`;
  };
  if (!reminder) {
    // Fallback if reminder is not provided
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.title}>No Reminder Data Found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const reminderDate = new Date(reminder.date);

  // Initialize the video player with the videoUri
  const player = useVideoPlayer(reminder.videoUri, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>{reminder.type} Reminder</Text>
      {reminder.reminderMode === 'single' && reminder.date && (
      <Text style={styles.description}>
        Date: {new Date(reminder.date).toLocaleString()}
      </Text>
    )}

    {reminder.reminderMode === 'repetitive' && (
      <>
        <Text style={styles.description}>
          Days: {formatDaysOfWeek(reminder.daysOfWeek)}
        </Text>
        <Text style={styles.description}>
          Time: {formatTime(reminder.time)}
        </Text>
      </>
    )}
      <Text style={styles.description}>{reminder.description}</Text>


      {reminder.type === 'Water' ? (
        <Image
          source={require('@/assets/gifs/water.gif')} // Replace with your GIF path
          style={styles.gifStyle}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.videoContainer}>
          <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
          <View style={styles.controlsContainer}>
            <Button
              title={player.playing ? 'Pause' : 'Play'}
              onPress={() => (player.playing ? player.pause() : player.play())}
            />
          </View>
        </View>
      )}

      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  videoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color: 'white',
  },
  gifStyle: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },

});
