import { NativeModule, requireOptionalNativeModule } from 'expo';

import { NfcStatus, UmbraHceModuleEvents } from './UmbraHce.types';

declare class UmbraHceModule extends NativeModule<UmbraHceModuleEvents> {
  setUserId(userId: number): void;
  clearUserId(): void;
  getNfcStatus(): NfcStatus;
  openNfcSettings(): void;
}

// En Expo Go (o fuera de Android) el módulo nativo no existe: devolvemos null en vez de explotar.
export default requireOptionalNativeModule<UmbraHceModule>('UmbraHce');
