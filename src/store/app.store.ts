import { create } from 'zustand';
interface AppState {
  notificationsEnabled: boolean;
  setNotificationsEnabled(value: boolean): void;
}
const useAppStore = create<AppState>(set => ({
  notificationsEnabled: true,
  setNotificationsEnabled: notificationsEnabled => set({ notificationsEnabled }),
}));

export { useAppStore };
