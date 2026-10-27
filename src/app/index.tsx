import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { UmbraLogo } from '../components/UmbraLogo';
import { login, LoginError } from '../lib/api';
import { useSession } from '../lib/session';
import { colors, fonts } from '../lib/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const user = await login(username.trim(), password);
      signIn(user);
      router.replace('/credencial');
    } catch (e) {
      setError(
        e instanceof LoginError
          ? e.message
          : 'No se pudo conectar. Verifica tu conexión a internet.'
      );
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <UmbraLogo size={40} />
            <Text style={styles.wordmark}>Umbra</Text>
          </View>
          <Text style={styles.tagline}>Tu credencial de acceso, sin tarjeta.</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Nombre de usuario</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Ej. paquito"
              placeholderTextColor={colors.fog + '99'}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={[styles.label, { marginTop: 18 }]}>Contraseña</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Ej. ••••••••"
              placeholderTextColor={colors.fog + '99'}
              secureTextEntry
              autoCapitalize="none"
              onSubmitEditing={onSubmit}
            />

            <Pressable
              onPress={onSubmit}
              disabled={loading}
              style={[styles.button, loading && styles.buttonDisabled]}>
              {loading ? <ActivityIndicator color={colors.bone} /> : <Text style={styles.buttonText}>Entrar</Text>}
            </Pressable>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28 },
  brand: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  wordmark: { fontFamily: fonts.wordmark, fontSize: 46, color: colors.alarm },
  tagline: { marginTop: 8, textAlign: 'center', color: colors.fog, fontFamily: fonts.italic, fontSize: 18 },
  form: { marginTop: 40 },
  label: { color: colors.fog, fontSize: 13, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.fog,
    borderRadius: 6,
    color: colors.bone,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    marginTop: 28,
    backgroundColor: colors.alarm,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: colors.alarmDim },
  buttonText: { color: colors.bone, fontSize: 16, fontWeight: '600' },
  error: { marginTop: 16, color: colors.amber, textAlign: 'center', fontSize: 15 },
});
