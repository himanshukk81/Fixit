import { Redirect } from 'expo-router';

import { ScreenLoader } from '@/components/atoms';
import { useAuthStore } from '@/store/auth.store';

export default function Index() {
  const hydrated = useAuthStore(state => state.hydrated);
  const user = useAuthStore(state => state.user);
  if (!hydrated) return <ScreenLoader />;
  return <Redirect href={user ? '/(tabs)' : '/(auth)/login'} />;
}
