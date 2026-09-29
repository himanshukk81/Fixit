import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  Bell,
  MapPin,
  ShieldCheck,
  Phone,
  MessageCircle,
  Check,
  Circle,
} from 'lucide-react-native';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { AppButton, AppText, Card, Rating } from '@/components/atoms';
import { colors, radius, spacing } from '@/theme';
import { formatPrice } from '@/utils/format';

import type { Address, Professional, Service } from '@/types/domain';

const technician = require('@assets/images/technician-hero.png');

function HomeHeader({ name = 'Priya' }: { name?: string }) {
  return (
    <View style={styles.header}>
      <View style={styles.flex}>
        <AppText variant="caption" color={colors.muted}>
          Good morning,
        </AppText>
        <AppText variant="h1">Hi, {name} 👋</AppText>
        <View style={styles.location}>
          <MapPin size={15} color={colors.primary} />
          <AppText variant="caption" color={colors.muted}>
            Indiranagar, Bengaluru
          </AppText>
        </View>
      </View>
      <Pressable
        accessibilityLabel="Notifications, 2 unread"
        onPress={() => router.push('/notifications')}
        style={styles.bell}
      >
        <Bell size={22} color={colors.ink} />
        <View style={styles.badge}>
          <AppText variant="caption" color={colors.white} style={{ fontSize: 9 }}>
            2
          </AppText>
        </View>
      </Pressable>
    </View>
  );
}

function EmergencyBanner() {
  return (
    <Card style={styles.banner}>
      <View style={styles.bannerCopy}>
        <AppText variant="caption" color="#90BBDC">
          SAME-DAY HELP
        </AppText>
        <AppText variant="h2" color={colors.white}>
          Urgent repair?
        </AppText>
        <AppText color="#DDEFFC">
          Get a verified expert at your door in as little as 60 minutes.
        </AppText>
        <AppButton
          label="Find help now"
          variant="secondary"
          fullWidth={false}
          onPress={() => router.push('/services/carpenter')}
          style={styles.bannerButton}
        />
      </View>
      <Image
        source={technician}
        style={styles.bannerImage}
        contentFit="cover"
        contentPosition="top"
      />
    </Card>
  );
}

function ProfessionalHero({ professional }: { professional: Professional }) {
  return (
    <View>
      <Image
        source={technician}
        style={styles.heroImage}
        contentFit="cover"
        contentPosition="top"
      />
      <Card style={styles.heroCard}>
        <View style={styles.nameLine}>
          <AppText variant="h1" style={styles.flex}>
            {professional.name}
          </AppText>
          <ShieldCheck size={23} color={colors.primary} />
        </View>
        <Rating value={professional.rating} count={professional.reviewCount} size={16} />
        <AppText color={colors.muted}>
          {professional.completedBookings.toLocaleString('en-IN')} jobs ·{' '}
          {professional.experienceYears} years experience
        </AppText>
        <AppText>{professional.bio}</AppText>
        <View style={styles.skills}>
          {professional.skills.map(skill => (
            <View key={skill} style={styles.skill}>
              <AppText variant="caption" color={colors.primary}>
                {skill}
              </AppText>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}

function BookingSummary({
  service,
  professional,
  date,
  time,
  address,
}: {
  service?: Service;
  professional?: Professional;
  date?: string;
  time?: string;
  address?: Address;
}) {
  const serviceCharge = service?.basePrice ?? 0;
  const fee = service ? 49 : 0;
  return (
    <Card style={styles.summary}>
      <AppText variant="h2">Booking summary</AppText>
      <SummaryRow label="Service" value={service?.name ?? 'Not selected'} />
      <SummaryRow label="Professional" value={professional?.name ?? 'Not selected'} />
      <SummaryRow label="Schedule" value={date && time ? `${date}, ${time}` : 'Not selected'} />
      <SummaryRow
        label="Address"
        value={address ? `${address.line1}, ${address.city}` : 'Not selected'}
      />
      <View style={styles.divider} />
      <SummaryRow label="Service charge" value={formatPrice(serviceCharge)} />
      <SummaryRow label="Convenience fee" value={formatPrice(fee)} />
      <SummaryRow label="Total" value={formatPrice(serviceCharge + fee)} strong />
    </Card>
  );
}
function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.row}>
      <AppText color={strong ? colors.ink : colors.muted} variant={strong ? 'h3' : 'body'}>
        {label}
      </AppText>
      <AppText
        variant={strong ? 'h2' : 'body'}
        color={strong ? colors.primary : colors.ink}
        style={styles.value}
      >
        {value}
      </AppText>
    </View>
  );
}

function BookingProgress({
  active,
}: {
  active: 'confirmed' | 'on_the_way' | 'arrived' | 'completed';
}) {
  const items = ['confirmed', 'on_the_way', 'arrived', 'completed'] as const;
  const activeIndex = items.indexOf(active);
  return (
    <Card>
      <AppText variant="h2" style={{ marginBottom: spacing.md }}>
        Service status
      </AppText>
      {items.map((item, index) => (
        <View key={item} style={styles.stepRow}>
          {index <= activeIndex ? (
            <View style={styles.check}>
              <Check size={13} color={colors.white} />
            </View>
          ) : (
            <Circle size={22} color={colors.border} />
          )}
          <View style={styles.flex}>
            <AppText variant="h3" color={index <= activeIndex ? colors.ink : colors.muted}>
              {item.replaceAll('_', ' ')}
            </AppText>
            {index === activeIndex ? (
              <AppText variant="caption" color={colors.primary}>
                {item === 'on_the_way' ? 'Your expert is heading to you' : 'Current status'}
              </AppText>
            ) : null}
          </View>
          {index < items.length - 1 ? (
            <View
              style={[styles.stepLine, index < activeIndex && { backgroundColor: colors.success }]}
            />
          ) : null}
        </View>
      ))}
    </Card>
  );
}

function ContactActions({ name }: { name: string }) {
  return (
    <View style={styles.contactRow}>
      <AppButton
        label="Message"
        variant="secondary"
        icon={<MessageCircle size={18} color={colors.primary} />}
        onPress={() => Alert.alert('Demo only', `Messaging ${name} is not connected.`)}
        style={styles.flex}
      />
      <AppButton
        label="Call"
        variant="secondary"
        icon={<Phone size={18} color={colors.primary} />}
        onPress={() => Alert.alert('Demo only', `Calling ${name} is not connected.`)}
        style={styles.flex}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  location: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  bell: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    padding: 0,
    overflow: 'hidden',
    minHeight: 190,
    flexDirection: 'row',
    backgroundColor: '#103D61',
    borderWidth: 0,
  },
  bannerCopy: { flex: 1.25, padding: spacing.lg, gap: spacing.xs, zIndex: 2 },
  bannerImage: { flex: 0.85, minHeight: 190 },
  bannerButton: { marginTop: spacing.xs, paddingHorizontal: spacing.md, minHeight: 42 },
  heroImage: { height: 330, borderRadius: radius.xl, backgroundColor: colors.softBlue },
  heroCard: { marginHorizontal: spacing.sm, marginTop: -42, gap: spacing.sm },
  nameLine: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  skill: {
    backgroundColor: colors.softBlue,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  summary: { gap: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  value: { flex: 1, textAlign: 'right' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  stepRow: { minHeight: 64, flexDirection: 'row', gap: spacing.sm, position: 'relative' },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: {
    position: 'absolute',
    left: 10,
    top: 24,
    width: 2,
    height: 38,
    backgroundColor: colors.border,
  },
  contactRow: { flexDirection: 'row', gap: spacing.sm },
});

export {
  BookingProgress,
  BookingSummary,
  ContactActions,
  EmergencyBanner,
  HomeHeader,
  ProfessionalHero,
};
