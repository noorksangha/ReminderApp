import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router'; // For navigation

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Global handler for notification responses
let notificationHandler: ((data: any) => void) | null = null;

export function setNotificationHandler(handler: (data: any) => void) {
  notificationHandler = handler;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const router = useRouter(); // Initialize the router for navigation

  useEffect(() => {
    // Register for notifications
    registerForPushNotificationsAsync();

    // Listen for notifications
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const reminder = response.notification.request.content.data.reminder;
      if (reminder) {
        // Navigate to ReminderDetails screen
        router.push({
          pathname: '/screens/ReminderDetails',
          params: { reminder: JSON.stringify(reminder) }, // Pass the reminder as a query parameter
        });
      }
    });

    if (loaded) {
      SplashScreen.hideAsync();
    }

    return () => subscription.remove();
  }, [loaded, router]);

  // Function to register for notifications
  async function registerForPushNotificationsAsync() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Failed to get push token for push notifications!');
      return;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
