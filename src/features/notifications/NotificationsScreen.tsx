import { FlashList } from '@shopify/flash-list';
import { Bell, CalendarCheck, Tag } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText, Card, EmptyState, ScreenLoader } from '@/components/atoms';
import { ScreenTemplate } from '@/components/templates';
import { useNotifications } from '@/hooks/queries';
import { colors, radius, spacing } from '@/theme';

function NotificationsScreen() {
  const query = useNotifications();
  if (query.isLoading) return <ScreenLoader />;
  return (
    <ScreenTemplate scroll={false}>
      <View style={styles.header}>
        <AppText variant="h1">Notifications</AppText>
        <AppText color={colors.muted}>Booking updates and useful offers.</AppText>
      </View>
      <FlashList
        data={query.data ?? []}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const Icon = item.kind === 'booking' ? CalendarCheck : item.kind === 'offer' ? Tag : Bell;
          return (
            <Card style={[styles.item, !item.read && styles.unread]}>
              <View style={styles.icon}>
                <Icon size={22} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <AppText variant="h3">{item.title}</AppText>
                <AppText color={colors.muted}>{item.body}</AppText>
                <AppText variant="caption" color={colors.muted}>
                  {item.createdAt}
                </AppText>
              </View>
              {!item.read ? <View style={styles.dot} /> : null}
            </Card>
          );
        }}
        ListEmptyComponent={
          <EmptyState title="All caught up" message="New updates will appear here." />
        }
      />
    </ScreenTemplate>
  );
}
const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { padding: spacing.md, gap: spacing.xs },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  item: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  unread: { borderColor: colors.primary, backgroundColor: '#F7FCFE' },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.softBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
});

export { NotificationsScreen };
