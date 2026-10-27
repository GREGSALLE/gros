import { Redirect, Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  addReaderListener,
  getNfcStatus,
  isHceAvailable,
  openNfcSettings,
  setUserId,
  type NfcStatus,
} from '../../modules/umbra-hce/src';
import { useSession } from '../lib/session';
import { colors, fonts } from '../lib/theme';

const DETECTED_MS = 3000;

export default function CredencialScreen() {
  const router = useRouter();
  const { user, signOut } = useSession();
  const [imageFailed, setImageFailed] = useState(false);
  const [detected, setDetected] = useState(false);
  const [nfcStatus, setNfcStatus] = useState<NfcStatus>(() => getNfcStatus());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Asegura que el servicio HCE tenga el número de usuario correcto
  useEffect(() => {
    if (user) setUserId(user.id);
  }, [user]);

  // Retroalimentación: un lector habló con la app → borde verde unos segundos
  useEffect(() => {
    const unsubscribe = addReaderListener(() => {
      setDetected(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setDetected(false), DETECTED_MS);
    });
    return () => {
      unsubscribe();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // Revisa de nuevo si el NFC está activado cuando la app vuelve a primer plano
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') setNfcStatus(getNfcStatus());
    });
    return () => sub.remove();
  }, []);

  if (!user) return <Redirect href="/" />;

  const onLogout = () => {
    signOut();
    router.replace('/');
  };

  const showPhoto = user.pfpUrl !== '' && !imageFailed;

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={onLogout} hitSlop={12} accessibilityLabel="Cerrar sesión">
              <Text style={styles.logout}>Salir</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* --- Tarjeta de credencial --- */}
        <View style={[styles.card, { borderColor: detected ? colors.signal : colors.alarmDim }]}>
          {showPhoto ? (
            <Image
              source={{ uri: user.pfpUrl }}
              style={styles.photo}
              onError={() => setImageFailed(true)}
              accessibilityLabel="foto de perfil"
            />
          ) : (
            <View style={[styles.photo, styles.photoFallback]}>
              <Text style={styles.initial}>{user.fullName.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <Text style={styles.name}>{user.fullName}</Text>
          <View style={styles.rule} />
          <Text style={styles.idLabel}>NÚMERO DE USUARIO</Text>
          <Text style={styles.id}>{user.id}</Text>
        </View>

        {/* --- Estado del NFC / detección del lector --- */}
        <NfcStatusRow status={nfcStatus} detected={detected} />

        <Pressable style={styles.creditsButton} onPress={() => router.push('/creditos')}>
          <Text style={styles.creditsText}>Créditos</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

function NfcStatusRow({ status, detected }: { status: NfcStatus; detected: boolean }) {
  let text = 'Acerca el teléfono al lector.';
  let color: string = colors.fog;

  if (!isHceAvailable) {
    text = 'Falta el módulo NFC: usa la development build (no Expo Go).';
    color = colors.amber;
  } else if (status === 'no_hardware') {
    text = 'Este teléfono no admite emulación de tarjeta NFC.';
    color = colors.amber;
  } else if (status === 'disabled') {
    text = 'El NFC está desactivado.';
    color = colors.amber;
  } else if (detected) {
    text = '✓ Lector detectado';
    color = colors.signal;
  }

  return (
    <View style={styles.statusWrap}>
      <Text style={[styles.statusText, { color }]}>{text}</Text>
      {isHceAvailable && status === 'disabled' ? (
        <Pressable style={styles.settingsButton} onPress={openNfcSettings}>
          <Text style={styles.settingsText}>Abrir ajustes de NFC</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, alignItems: 'stretch' },
  logout: { color: colors.alarm, fontSize: 16, fontWeight: '600' },
  card: {
    backgroundColor: colors.panel,
    borderRadius: 24,
    borderWidth: 2,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  photo: { width: 160, height: 160, borderRadius: 80 },
  photoFallback: { backgroundColor: colors.alarmDim, alignItems: 'center', justifyContent: 'center' },
  initial: { color: colors.bone, fontFamily: fonts.title, fontSize: 64 },
  name: {
    marginTop: 24,
    color: colors.bone,
    fontFamily: fonts.title,
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'center',
  },
  rule: { marginTop: 20, width: 28, height: 3, backgroundColor: colors.alarm },
  idLabel: { marginTop: 20, color: colors.fog, fontSize: 13, letterSpacing: 1 },
  id: { marginTop: 4, color: colors.alarm, fontFamily: fonts.title, fontSize: 44, lineHeight: 50 },
  statusWrap: { marginTop: 24, alignItems: 'center' },
  statusText: { fontSize: 17, textAlign: 'center' },
  settingsButton: {
    marginTop: 12,
    backgroundColor: colors.alarm,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  settingsText: { color: colors.bone, fontWeight: '600' },
  creditsButton: {
    marginTop: 32,
    borderWidth: 1,
    borderColor: colors.alarm,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  creditsText: { color: colors.bone, fontSize: 16, fontWeight: '600' },
});
