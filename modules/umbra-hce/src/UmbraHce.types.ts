export type NfcStatus = 'ready' | 'disabled' | 'no_hardware';

export type ReaderDetectedPayload = {
  /** Instante (ms desde epoch) en que un lector habló con la app */
  timestamp: number;
};

export type UmbraHceModuleEvents = {
  onReaderDetected: (params: ReaderDetectedPayload) => void;
};
