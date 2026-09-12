import { User, RoleId } from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'usr-01',
    name: 'Fakhar Memon',
    email: 'fakhar@fidsorholdings.pk',
    phone: '+92 300 2214 880',
    roleId: 'administrator',
    status: 'active',
    lastActiveAt: '2026-08-29T09:12:00',
    joinedOn: '2021-11-02'
  },
  {
    id: 'usr-02',
    name: 'Adnan Qureshi',
    email: 'adnan@fidsorholdings.pk',
    phone: '+92 321 3390 415',
    roleId: 'investment-manager',
    status: 'active',
    lastActiveAt: '2026-08-28T17:40:00',
    joinedOn: '2023-02-13'
  },
  {
    id: 'usr-03',
    name: 'Bilal Ahmed Jat',
    email: 'bilal@fidsorholdings.pk',
    phone: '+92 333 7712 004',
    roleId: 'operations',
    status: 'active',
    lastActiveAt: '2026-08-29T08:05:00',
    joinedOn: '2024-01-08'
  },
  {
    id: 'usr-04',
    name: 'Sana Mirza',
    email: 'sana@fidsorholdings.pk',
    phone: '+92 345 2201 736',
    roleId: 'accountant',
    status: 'active',
    lastActiveAt: '2026-08-28T15:22:00',
    joinedOn: '2024-06-17'
  },
  {
    id: 'usr-06',
    name: 'Rukhsana Talpur',
    email: 'rukhsana@fidsorholdings.pk',
    phone: '+92 311 6620 190',
    roleId: 'viewer',
    status: 'active',
    lastActiveAt: '2026-08-20T13:03:00',
    joinedOn: '2025-07-01'
  }
];

export const DEMO_PASSWORD = 'fidsor2026';
export const SESSION_KEY = 'fidsor-invest.session';

export function getStoredSession(): { userId: string; signedInAt: string } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.userId === 'string') {
      return parsed;
    }
  } catch {}
  return null;
}

export function saveSession(userId: string, keepSignedIn: boolean = true) {
  const session = {
    userId,
    signedInAt: new Date().toISOString()
  };
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    (keepSignedIn ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(session));
  } catch {}
  return session;
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

export function getRoleLabel(roleId: RoleId): string {
  switch (roleId) {
    case 'administrator':
      return 'Administrator';
    case 'investment-manager':
      return 'Investment Manager';
    case 'operations':
      return 'Operations';
    case 'accountant':
      return 'Accountant';
    case 'viewer':
      return 'Viewer';
    default:
      return roleId;
  }
}

export function getUserInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
