import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useSession } from '../lib/session';
import { colors, fonts } from '../lib/theme';

export default function PerfilScreen() {
  const { user } = useSession();
  const [imageFailed, setImageFailed] = useState(false);

  if (!user) return <Redirect href="/" />;

  const showPhoto = user.pfpUrl !== '' && !imageFailed;

  return (
    <ScrollView contentContainerStyle={styles.content}>
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

      <Field label="Usuario" value={user.username} />
      <Field label="Nombre completo" value={user.fullName} />
      <Field label="Email" value={user.email} />
      <Field label="ID" value={String(user.id)} />
      <Field label="Créditos" value={String(user.credits)} />
      <Field label="XP" value={String(user.xp)} />
    </ScrollView>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingVertical: 12, paddingBottom: 40 },
  photo: { width: 96, height: 96, borderRadius: 48, marginBottom: 20 },
  photoFallback: { backgroundColor: colors.alarmDim, alignItems: 'center', justifyContent: 'center' },
  initial: { color: colors.bone, fontFamily: fonts.title, fontSize: 40 },
  field: { paddingTop: 14 },
  label: { color: colors.fog, fontSize: 13 },
  value: { marginTop: 4, color: colors.bone, fontSize: 17 },
  divider: { marginTop: 14, height: StyleSheet.hairlineWidth, backgroundColor: colors.alarmDim },
});
