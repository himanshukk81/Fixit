import { create } from 'zustand';

import { secureSession } from '@/services/storage';

import type { User } from '@/types/domain';

interface AuthState {
  hydrated: boolean;
  user: User | null;
  pendingPhone: string;
  hydrate(): Promise<void>;
  setPendingPhone(phone: string): void;
  signIn(user: User, token: string): Promise<void>;
  signOut(): Promise<void>;
}

const useAuthStore = create<AuthState>(set => ({
  hydrated: false,
  user: null,
  pendingPhone: '',
  async hydrate() {
    const [token, phone] = await Promise.all([secureSession.getToken(), secureSession.getPhone()]);
    set({ hydrated: true, user: token && phone ? { id: 'user-1', name: 'Priya', phone } : null });
  },
  setPendingPhone: pendingPhone => set({ pendingPhone }),
  async signIn(user, token) {
    await secureSession.save(token, user.phone);
    set({ user, pendingPhone: '' });
  },
  async signOut() {
    await secureSession.clear();
    set({ user: null, pendingPhone: '' });
  },
}));

export { useAuthStore };
