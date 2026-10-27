import * as Crypto from 'expo-crypto';

const LOGIN_URL = 'https://monsterballgo.com/api/login';
const API_TOKEN = 'code37';

export type User = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  pfpUrl: string;
  fullName: string;
};

type LoginResponse = {
  username?: string;
  id?: number | string;
  email?: string;
  firstname?: string;
  lastname?: string;
  pfp_url?: string;
  error?: string;
};

export class LoginError extends Error {}

/** Login contra la API de la práctica 2: la contraseña viaja como SHA-256 (hex). */
export async function login(username: string, password: string): Promise<User> {
  const hashed = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
  const body = new URLSearchParams({ user: username, pass: hashed, token: API_TOKEN }).toString();

  const res = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = (await res.json()) as LoginResponse;

  const id = Number(data.id);
  if (data.error || !data.username || !Number.isFinite(id)) {
    throw new LoginError(data.error ?? 'Usuario o contraseña incorrectos.');
  }

  const firstname = data.firstname ?? '';
  const lastname = data.lastname ?? '';
  return {
    id,
    username: data.username,
    firstname,
    lastname,
    email: data.email ?? '',
    pfpUrl: data.pfp_url ?? '',
    fullName: `${firstname} ${lastname}`.trim() || data.username,
  };
}
