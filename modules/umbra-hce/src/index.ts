import UmbraHceModule from './UmbraHceModule';
import { NfcStatus, ReaderDetectedPayload } from './UmbraHce.types';

export type { NfcStatus, ReaderDetectedPayload };

/** false en Expo Go / iOS: hay que usar una development build en un Android con NFC. */
export const isHceAvailable = UmbraHceModule != null;

/** Número de usuario que el servicio HCE enviará al lector (4 bytes). */
export function setUserId(userId: number): void {
  UmbraHceModule?.setUserId(userId);
}

export function clearUserId(): void {
  UmbraHceModule?.clearUserId();
}

export function getNfcStatus(): NfcStatus {
  return UmbraHceModule ? UmbraHceModule.getNfcStatus() : 'no_hardware';
}

export function openNfcSettings(): void {
  UmbraHceModule?.openNfcSettings();
}

/** Se llama cada vez que un lector NFC hace SELECT sobre nuestro AID. Devuelve la función para cancelar. */
export function addReaderListener(callback: (payload: ReaderDetectedPayload) => void): () => void {
  if (!UmbraHceModule) return () => {};
  const subscription = UmbraHceModule.addListener('onReaderDetected', callback);
  return () => subscription.remove();
}
