import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { clearUserId, setUserId } from '../../modules/umbra-hce/src';
import type { User } from './api';

type Session = {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = useCallback((u: User) => {
    // El servicio HCE nativo lee el número de usuario desde aquí
    setUserId(u.id);
    setUser(u);
  }, []);

  const signOut = useCallback(() => {
    clearUserId();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, signIn, signOut }), [user, signIn, signOut]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): Session {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession debe usarse dentro de <SessionProvider>');
  return ctx;
}
