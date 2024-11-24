// app/themes.ts
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#ffffff',        // Background of the app
    background: '#ffffff',     // General background color
    text: '#000000',           // Text color
    card: 'white',
    border: '#dddddd',
    notification: 'red',
    tint: '#006666',           // Active tab color, for example
    inactive: 'grey',       // Inactive tab color
    headerTint: '#000000',     // Header text color
  },
};

export const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#000000',        // Background of the app
    background: '#000000',     // General background color
    text: 'white',             // Text color
    card: '1f1f1f',
    border: '#333333',
    notification: '#ff5252',
    tint: '#006666',           // Active tab color (light purple for dark theme)
    inactive: '#777777',       // Inactive tab color
    headerTint: 'white',       // Header text color
  },
};
