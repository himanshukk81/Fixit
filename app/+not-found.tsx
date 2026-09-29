import { router } from 'expo-router';

import { AppButton, AppText } from '@/components/atoms';
import { ScreenTemplate } from '@/components/templates';

export default function NotFound() {
  return (
    <ScreenTemplate>
      <AppText variant="hero">That page needs a repair.</AppText>
      <AppText>We couldn’t find the screen you requested.</AppText>
      <AppButton label="Back to FixIt" onPress={() => router.replace('/')} />
    </ScreenTemplate>
  );
}
