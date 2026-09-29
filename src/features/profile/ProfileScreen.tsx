import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import {
  CalendarDays,
  ChevronRight,
  CircleHelp,
  FileText,
  LogOut,
  MapPin,
  SlidersHorizontal,
  UserRound,
} from 'lucide-react-native';
import { Alert, Pressable, StyleSheet, Switch, View } from 'react-native';

import { AppButton, AppText, Card } from '@/components/atoms';
import { ScreenTemplate } from '@/components/templates';
import { defaultAddress } from '@/mocks/data';
import { useAppStore } from '@/store/app.store';
import { useAuthStore } from '@/store/auth.store';
import { useBookingStore } from '@/store/booking.store';
import { colors, radius, spacing } from '@/theme';

function LogoutButton({ onPress }: { onPress: () => void }) {
  return (
    <View style={styles.logoutButtonShell}>
      <Pressable
        accessibilityLabel="Log out of FixIt"
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.logoutButtonPressable,
          pressed && styles.logoutButtonPressed,
        ]}
      >
        {/* <LogOut size={19} color={colors.white} /> */}
        <AppText variant="h3" color={colors.white} style={styles.logoutButtonLabel}>
          Log out
        </AppText>
      </Pressable>
    </View>
  );
}

function ProfileScreen() {
  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);
  const signOut = useAuthStore(state => state.signOut);
  const resetBooking = useBookingStore(state => state.reset);
  const notificationsEnabled = useAppStore(state => state.notificationsEnabled);
  const setNotificationsEnabled = useAppStore(state => state.setNotificationsEnabled);
  const logout = () =>
    Alert.alert(
      'Log out of FixIt?',
      'Your saved session and current booking draft will be cleared.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            resetBooking();
            queryClient.clear();
            router.replace('/(auth)/login');
          },
        },
      ],
    );
  return (
    <ScreenTemplate footer={<LogoutButton onPress={logout} />}>
      <AppText variant="h1">Profile</AppText>
      <Card style={styles.profile}>
        <View style={styles.avatar}>
          <UserRound size={34} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <AppText variant="h2">{user?.name ?? 'Priya'}</AppText>
          <AppText color={colors.muted}>{user?.phone ?? '+91 ••••• •••••'}</AppText>
        </View>
        <AppButton
          label="Edit"
          variant="ghost"
          fullWidth={false}
          onPress={() =>
            Alert.alert('Demo profile', 'Profile editing is ready to connect to the backend.')
          }
        />
      </Card>
      <AppText variant="h2">Saved address</AppText>
      <Card style={styles.address}>
        <MapPin size={22} color={colors.primary} />
        <View style={styles.flex}>
          <AppText variant="h3">{defaultAddress.label}</AppText>
          <AppText color={colors.muted}>
            {defaultAddress.line1}, {defaultAddress.city} {defaultAddress.postalCode}
          </AppText>
        </View>
      </Card>
      <AppText variant="h2">Preferences & support</AppText>
      <Card style={styles.menu}>
        <MenuRow
          icon={CalendarDays}
          label="Booking history"
          onPress={() => router.push('/(tabs)/bookings')}
        />
        <MenuRow
          icon={SlidersHorizontal}
          label="Booking notifications"
          trailing={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ true: colors.primary }}
            />
          }
        />
        <MenuRow
          icon={CircleHelp}
          label="Help & support"
          onPress={() =>
            Alert.alert('Help & support', 'For this demo, email support@fixit.example.')
          }
        />
        <MenuRow
          icon={FileText}
          label="Terms & conditions"
          onPress={() =>
            Alert.alert('Demo terms', 'Production legal terms will be supplied before release.')
          }
          last
        />
      </Card>
    </ScreenTemplate>
  );
}
function MenuRow({
  icon: Icon,
  label,
  onPress,
  trailing,
  last,
}: {
  icon: typeof CalendarDays;
  label: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={[styles.row, last && { borderBottomWidth: 0 }]}
    >
      <View style={styles.menuIcon}>
        <Icon size={20} color={colors.primary} />
      </View>
      <AppText style={styles.flex}>{label}</AppText>
      {trailing ?? <ChevronRight size={19} color={colors.muted} />}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  flex: { flex: 1 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.softBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  address: { flexDirection: 'row', gap: spacing.sm },
  menu: { paddingVertical: 0 },
  row: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.softBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonShell: {
    width: '100%',
    // height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.danger,
    overflow: 'hidden',
    elevation: 2,
    // shadowColor: colors.black,
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // shadowOffset: { width: 0, height: 2 },
    padding:15
  },
  logoutButtonPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.danger,
  },
  logoutButtonPressed: { opacity: 0.88 },
  logoutButtonLabel: { color: colors.white, textAlign: 'center' },
});

export { ProfileScreen };
