import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
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

  const { reminder } = route.params;

  // Initialize the video player with the videoUri
  const player = useVideoPlayer(reminder.videoUri, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  return (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>{reminder.type} Reminder</Text>
      <Text style={styles.description}>{reminder.description}</Text>

      {/* Video Section */}
      <View style={styles.videoContainer}>
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
  },
  description: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
});
