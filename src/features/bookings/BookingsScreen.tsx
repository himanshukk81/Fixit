import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, EmptyState, Pill, ScreenLoader } from '@/components/atoms';
import { BookingCard } from '@/components/molecules';
import { ScreenTemplate } from '@/components/templates';
import { useBookings } from '@/hooks/queries';
import { spacing } from '@/theme';

import type { BookingStatus } from '@/types/domain';

type Tab = 'upcoming' | 'completed' | 'cancelled';
function BookingsScreen() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const query = useBookings();
  if (query.isLoading) return <ScreenLoader />;
  const statuses: Record<Tab, BookingStatus[]> = {
    upcoming: ['upcoming', 'on_the_way', 'in_progress'],
    completed: ['completed'],
    cancelled: ['cancelled'],
  };
  const data = query.data?.filter(item => statuses[tab].includes(item.status)) ?? [];
  return (
    <ScreenTemplate scroll={false}>
      <View style={styles.header}>
        <AppText variant="h1">My bookings</AppText>
        <AppText>Everything scheduled, completed and cancelled.</AppText>
      </View>
      <View style={styles.tabs}>
        {(['upcoming', 'completed', 'cancelled'] as const).map(item => (
          <Pill
            key={item}
            label={item[0]!.toUpperCase() + item.slice(1)}
            active={tab === item}
            onPress={() => setTab(item)}
          />
        ))}
      </View>
      <FlashList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() =>
              router.push({ pathname: '/booking/success', params: { bookingId: item.id } })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState title={`No ${tab} bookings`} message="Your bookings will appear here." />
        }
      />
    </ScreenTemplate>
  );
}
const styles = StyleSheet.create({
  header: { padding: spacing.md, gap: spacing.xs },
  tabs: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
});

export { BookingsScreen };
