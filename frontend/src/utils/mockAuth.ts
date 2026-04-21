/**
 * mockAuth.ts — KisanMitra Mock Authentication Layer
 *
 * Simulates the backend auth API entirely in localStorage.
 * Built to be DELETED, not worked around.
 *
 * Migration path:
 *   Set VITE_MOCK_AUTH=false in frontend/.env
 *   AuthContext will switch to real fetch() calls automatically.
 *   This file is never imported by components — only by AuthContext.
 */

import type { User, UserRole } from '../types';

export const MOCK_OTP = '123456';

// Simple deterministic fake JWT (not cryptographically secure — dev only)
function makeFakeToken(userId: number, role: UserRole, phone: string): string {
  const payload = { user_id: userId, role, phone, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 };
  return `mock.${btoa(JSON.stringify(payload))}.sig`;
}

function decodeFakeToken(token: string): { user_id: number; role: UserRole; phone: string; exp: number } | null {
  try {
    const parts = token.split('.');
    if (parts[0] !== 'mock') return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

function getStore(): Record<string, User> {
  try {
    return JSON.parse(localStorage.getItem('km_mock_users') || '{}');
  } catch {
    return {};
  }
}

function saveStore(store: Record<string, User>): void {
  localStorage.setItem('km_mock_users', JSON.stringify(store));
}

let _userIdCounter = parseInt(localStorage.getItem('km_uid_counter') || '1', 10);
function nextId(): number {
  localStorage.setItem('km_uid_counter', String(++_userIdCounter));
  return _userIdCounter;
}

/** Simulate sending OTP — no-op in mock mode */
export function mockSendOtp(_phone: string): void {
  // In real mode: POST /api/auth/send-otp
  console.log(`[MockAuth] OTP sent to ${_phone} — use ${MOCK_OTP}`);
}

/** Verify OTP and return token. Creates user if new. */
export function mockVerifyOtp(
  phone: string,
  otp: string,
  role: UserRole
): { token: string; isNewUser: boolean; user: User } {
  if (otp !== MOCK_OTP) {
    throw new Error('Invalid OTP. Use 123456 for testing.');
  }

  const store = getStore();
  const existing = Object.values(store).find((u) => u.phone_number === phone);

  if (existing) {
    const token = makeFakeToken(existing.user_id, existing.role, phone);
    return { token, isNewUser: !existing.full_name, user: existing };
  }

  // New user
  const newUser: User = {
    user_id: nextId(),
    full_name: '',
    phone_number: phone,
    role,
    is_verified: false,
    created_at: new Date().toISOString(),
    preferred_language: 'en',
  };

  store[String(newUser.user_id)] = newUser;
  saveStore(store);

  const token = makeFakeToken(newUser.user_id, role, phone);
  return { token, isNewUser: true, user: newUser };
}

/** Load user profile from token */
export function mockGetProfile(token: string): User | null {
  const payload = decodeFakeToken(token);
  if (!payload) return null;
  if (payload.exp < Date.now()) return null; // expired

  const store = getStore();
  return store[String(payload.user_id)] ?? null;
}

/** Update user profile */
export function mockUpdateProfile(token: string, data: Partial<User>): User {
  const payload = decodeFakeToken(token);
  if (!payload) throw new Error('Invalid token');

  const store = getStore();
  const user = store[String(payload.user_id)];
  if (!user) throw new Error('User not found');

  const updated: User = { ...user, ...data, user_id: user.user_id, role: user.role };
  store[String(user.user_id)] = updated;
  saveStore(store);
  return updated;
}
