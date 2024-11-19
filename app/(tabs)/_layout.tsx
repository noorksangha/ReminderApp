import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MyLightTheme, MyDarkTheme } from '../themes';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const currentTheme = colorScheme === 'light' ? MyLightTheme : MyDarkTheme;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: currentTheme.colors.tint,
        tabBarStyle: {
          backgroundColor: currentTheme.colors.primary,
        },
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          color: currentTheme.colors.text,
        },
        tabBarInactiveTintColor: currentTheme.colors.inactive,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
