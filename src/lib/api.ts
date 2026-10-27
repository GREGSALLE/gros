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
  credits: number;
  xp: number;
  fullName: string;
};

type LoginResponse = {
  username?: string;
  id?: number | string;
  email?: string;
  firstname?: string;
  lastname?: string;
  first_name?: string;
  last_name?: string;
  pfp_url?: string;
  credits?: number;
  xp?: number;
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

  const firstname = data.firstname ?? data.first_name ?? '';
  const lastname = data.lastname ?? data.last_name ?? '';
  return {
    id,
    username: data.username,
    firstname,
    lastname,
    email: data.email ?? '',
    pfpUrl: data.pfp_url ?? '',
    credits: Number(data.credits ?? 0),
    xp: Number(data.xp ?? 0),
    fullName: `${firstname} ${lastname}`.trim() || data.username,
  };
}
