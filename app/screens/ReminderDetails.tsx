import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';

// ReminderDetailsScreen Component
type ReminderDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ReminderDetails'>;
type ReminderDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ReminderDetails'>;

export default function ReminderDetailsScreen() {
  const navigation = useNavigation<ReminderDetailsScreenNavigationProp>();
  const route = useRoute<ReminderDetailsScreenRouteProp>();
  //const route = useRoute<RouteProp<RootStackParamList, 'ReminderDetails'>>();

  const { reminder } = route.params;
  console.log(reminder);
  const reminderDate = new Date(reminder.date);
  console.log('ReminderDetails Params:', route.params);


  // Initialize the video player with the videoUri
  const player = useVideoPlayer(reminder.videoUri, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  return (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>{reminder ? reminder.type : 'Loading...'} Reminder</Text>
      <Text style={styles.description}>Date: {reminderDate.toLocaleString()}</Text>
      <Text style={styles.description}>{reminder ? reminder.description : 'Loading description...'}</Text>
  
      {/* Conditional Rendering for GIF or Video */}
      {reminder.type === 'Water' ? (
        <Image
          source={require('@/assets/gifs/water.gif')} // Replace with your GIF path
          style={styles.gifStyle} // Add your own styles for the GIF
          resizeMode="contain" // Adjusts how the GIF is resized
        />
      ) : (
        <View style={styles.videoContainer}>
          {/* Video Section */}
          <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
          <View style={styles.controlsContainer}>
            <Button
              title={isPlaying ? 'Pause' : 'Play'}
              onPress={() => {
                if (isPlaying) {
                  player.pause();
                } else {
                  player.play();
                }
              }}
            />
          </View>
        </View>
      )}
  
      <Button title="Go Back to Home" onPress={() => navigation.navigate('Home')} />
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
    color:'white',
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    color:'white',
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
    color:'white',
  },
  gifStyle: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  
});
