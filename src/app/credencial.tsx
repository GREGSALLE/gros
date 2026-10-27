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
import { Icon } from '../components/Icon';
import { icons } from '../lib/icons';
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
  const displayName = user.firstname.trim() !== '' ? user.firstname : user.username;

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable onPress={() => router.push('/perfil')} hitSlop={10} accessibilityLabel="Perfil de usuario">
                <Icon path={icons.accountCircle} color={colors.alarm} size={26} />
              </Pressable>
              <Pressable onPress={onLogout} hitSlop={10} accessibilityLabel="Cerrar sesión">
                <Icon path={icons.logout} color={colors.alarm} size={26} />
              </Pressable>
            </View>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* --- Bienvenida (como en Umbra) --- */}
        <Text style={styles.welcome}>¡Bienvenido, {displayName}!</Text>
        <View style={styles.rule} />
        <Text style={styles.subtitle}>Esta es tu credencial de acceso.</Text>

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
          <View style={styles.cardRule} />
          <Text style={styles.idLabel}>NÚMERO DE USUARIO</Text>
          <Text style={styles.id}>{user.id}</Text>
        </View>

        {/* --- Estado del NFC / detección del lector --- */}
        <NfcStatusRow status={nfcStatus} detected={detected} />

        <Pressable style={styles.creditsButton} onPress={() => router.push('/creditos')}>
          <Icon path={icons.accountGroup} color={colors.alarm} size={22} />
          <Text style={styles.creditsText}>Créditos</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

function NfcStatusRow({ status, detected }: { status: NfcStatus; detected: boolean }) {
  let text = 'Acerca el teléfono al lector.';
  let color: string = colors.fog;
  let path: string = icons.nfc;

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
    text = 'Lector detectado';
    color = colors.signal;
    path = icons.checkCircle;
  }

  return (
    <View style={styles.statusWrap}>
      <View style={styles.statusRow}>
        <Icon path={path} color={color} size={26} />
        <Text style={[styles.statusText, { color }]}>{text}</Text>
      </View>
      {isHceAvailable && status === 'disabled' ? (
        <Pressable style={styles.settingsButton} onPress={openNfcSettings}>
          <Text style={styles.settingsText}>Abrir ajustes de NFC</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingVertical: 12, alignItems: 'stretch' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  welcome: { color: colors.bone, fontFamily: fonts.title, fontSize: 28, lineHeight: 34 },
  rule: { marginTop: 14, width: 28, height: 3, backgroundColor: colors.alarm },
  subtitle: { marginTop: 12, marginBottom: 20, color: colors.fog, fontFamily: fonts.italic, fontSize: 17 },
  card: {
    backgroundColor: colors.panel,
    borderRadius: 24,
    borderWidth: 2,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  photo: { width: 150, height: 150, borderRadius: 75 },
  photoFallback: { backgroundColor: colors.alarmDim, alignItems: 'center', justifyContent: 'center' },
  initial: { color: colors.bone, fontFamily: fonts.title, fontSize: 60 },
  name: {
    marginTop: 22,
    color: colors.bone,
    fontFamily: fonts.title,
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'center',
  },
  cardRule: { marginTop: 18, width: 28, height: 3, backgroundColor: colors.alarm },
  idLabel: { marginTop: 18, color: colors.fog, fontSize: 13, letterSpacing: 1 },
  id: { marginTop: 4, color: colors.alarm, fontFamily: fonts.title, fontSize: 44, lineHeight: 50 },
  statusWrap: { marginTop: 24, alignItems: 'center' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusText: { fontSize: 17, textAlign: 'center', flexShrink: 1 },
  settingsButton: {
    marginTop: 12,
    backgroundColor: colors.alarm,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  settingsText: { color: colors.bone, fontWeight: '600' },
  creditsButton: {
    marginTop: 28,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.alarm,
    borderRadius: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  creditsText: { color: colors.bone, fontSize: 16, fontWeight: '600' },
});
