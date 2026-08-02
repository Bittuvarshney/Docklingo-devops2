import { User } from '../types';

const STORAGE_USERS_KEY = 'doc_trans_users_v1';
const STORAGE_CURRENT_USER_KEY = 'doc_trans_current_user_v1';

// Pre-seed a demo user for easy testing
const DEMO_USER: User = {
  id: 'usr_demo_101',
  email: 'demo@translator.ai',
  name: 'Alex Rivera',
  createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
};

interface StoredUserAccount extends User {
  passwordHash: string;
}

function getUsersFromStorage(): StoredUserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      const initial = [{ ...DEMO_USER, passwordHash: 'demo1234' }];
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse users', err);
    return [];
  }
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (!raw) {
      // Default to DEMO_USER so user can immediately test history features if desired
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(DEMO_USER));
      return DEMO_USER;
    }
    return JSON.parse(raw);
  } catch {
    return DEMO_USER;
  }
}

export function loginUser(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const users = getUsersFromStorage();
  const normalizedEmail = email.trim().toLowerCase();
  
  const found = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!found) {
    return { success: false, error: 'No account found with this email address.' };
  }
  if (found.passwordHash !== password) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  const userObj: User = {
    id: found.id,
    email: found.email,
    name: found.name,
    createdAt: found.createdAt,
  };

  localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(userObj));
  window.dispatchEvent(new Event('auth_change'));
  return { success: true, user: userObj };
}

export function signUpUser(name: string, email: string, password: string): { success: boolean; user?: User; error?: string } {
  const users = getUsersFromStorage();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const newUser: StoredUserAccount = {
    id: 'usr_' + Math.random().toString(36).substring(2, 10),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

  const userObj: User = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    createdAt: newUser.createdAt,
  };

  localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(userObj));
  window.dispatchEvent(new Event('auth_change'));
  return { success: true, user: userObj };
}

export function logoutUser(): void {
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  window.dispatchEvent(new Event('auth_change'));
}
