import type { ImageSourcePropType } from 'react-native';

// ---- Datos de la pantalla de créditos (editar aquí) ----
export const GRUPO = 'Grupo POR_DEFINIR';
export const FECHA = 'Octubre 2026';

export type Member = { fullName: string; role: string; avatar: ImageSourcePropType };

export const members: Member[] = [
  { fullName: 'Mathis Gil', role: 'Backend & API', avatar: require('../../assets/avatars/avatar_mathis.png') },
  { fullName: 'Aristide Cordonnier', role: 'QA & Pruebas', avatar: require('../../assets/avatars/avatar_aristide.png') },
  { fullName: 'Oscar Buat', role: 'Diseño UI', avatar: require('../../assets/avatars/avatar_oscar.png') },
];

export type Tech = { name: string; usage: string; logo: string };

// `logo` es la clave en lib/logos.ts (logos oficiales de Simple Icons)
export const techStack: Tech[] = [
  { name: 'React Native', usage: 'Framework de la app móvil', logo: 'ReactNative' },
  { name: 'Expo', usage: 'Herramientas, build y módulos nativos', logo: 'Expo' },
  { name: 'TypeScript', usage: 'Lenguaje de la interfaz', logo: 'TypeScript' },
  { name: 'Kotlin', usage: 'Módulo nativo HCE (servicio APDU)', logo: 'Kotlin' },
  { name: 'Android', usage: 'HostApduService / emulación de tarjeta', logo: 'Android' },
  { name: 'NFC', usage: 'Comunicación con el lector (APDU)', logo: 'NFC' },
  { name: 'GitHub', usage: 'Control de versiones', logo: 'GitHub' },
];
