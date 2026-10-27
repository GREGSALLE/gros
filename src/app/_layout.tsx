import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { SessionProvider } from '../lib/session';
import { colors } from '../lib/theme';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlayfairBold: require('../../assets/fonts/PlayfairBold.ttf'),
    PlayfairBlack: require('../../assets/fonts/PlayfairBlack.ttf'),
    PlayfairItalic: require('../../assets/fonts/PlayfairItalic.ttf'),
  });

  if (!loaded && !error) return null;

  return (
    <SessionProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.ink },
          headerTintColor: colors.alarm,
          headerTitleStyle: { color: colors.bone, fontFamily: 'PlayfairBold', fontSize: 22 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.ink },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="credencial" options={{ title: 'Umbra', headerBackVisible: false }} />
        <Stack.Screen name="perfil" options={{ title: 'Perfil' }} />
        <Stack.Screen name="creditos" options={{ title: 'Créditos' }} />
      </Stack>
    </SessionProvider>
  );
}
