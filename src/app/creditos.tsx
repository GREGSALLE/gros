import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TechLogo } from '../components/TechLogo';
import { FECHA, GRUPO, members, techStack } from '../lib/team';
import { colors, fonts } from '../lib/theme';

export default function CreditosScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.small}>Desarrollado por</Text>
      <Text style={styles.groupLine}>
        {GRUPO} · {FECHA}
      </Text>
      <View style={styles.divider} />

      {members.map((m, i) => (
        <View key={m.fullName}>
          {i > 0 ? <View style={styles.divider} /> : null}
          <View style={styles.row}>
            <Image source={m.avatar} style={styles.avatar} accessibilityLabel={`avatar de ${m.fullName}`} />
            <View>
              <Text style={styles.name}>{m.fullName}</Text>
              <Text style={styles.sub}>{m.role}</Text>
            </View>
          </View>
        </View>
      ))}

      <View style={[styles.divider, { marginTop: 4 }]} />
      <Text style={styles.heading}>Tecnologías utilizadas</Text>

      {techStack.map((t) => (
        <View key={t.name} style={styles.row}>
          <TechLogo name={t.logo} />
          <View style={styles.flex}>
            <Text style={styles.name}>{t.name}</Text>
            <Text style={styles.sub}>{t.usage}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingVertical: 12, paddingBottom: 40 },
  flex: { flex: 1 },
  small: { marginTop: 8, color: colors.fog, fontSize: 13 },
  groupLine: { marginTop: 4, marginBottom: 12, color: colors.bone, fontSize: 18 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.alarmDim, marginVertical: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 14 },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  name: { color: colors.bone, fontSize: 17 },
  sub: { color: colors.fog, fontSize: 14, marginTop: 2 },
  heading: { marginTop: 16, marginBottom: 6, color: colors.bone, fontFamily: fonts.title, fontSize: 24 },
});
