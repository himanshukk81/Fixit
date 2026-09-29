import { Image } from 'expo-image';
import {
  Hammer,
  Zap,
  Wrench,
  Paintbrush,
  Snowflake,
  Sparkles,
  Leaf,
  Settings,
  Search,
  ShieldCheck,
  Clock3,
  ChevronRight,
  MapPin,
} from 'lucide-react-native';
import { memo, type ComponentType } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText, Card, Pill, Rating } from '@/components/atoms';
import { services as serviceData, professionals } from '@/mocks/data';
import { colors, radius, spacing } from '@/theme';
import { formatPrice } from '@/utils/format';

import type { Booking, Professional, Service, ServiceCategory } from '@/types/domain';

const iconMap: Record<string, ComponentType<{ size?: number; color?: string }>> = {
  Hammer,
  Zap,
  Wrench,
  Paintbrush,
  Snowflake,
  Sparkles,
  Leaf,
  Settings,
};
const technician = require('@assets/images/technician-hero.png');

function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search services',
}: {
  value: string;
  onChangeText(value: string): void;
  placeholder?: string;
}) {
  return (
    <View style={styles.search}>
      <Search size={20} color={colors.muted} />
      <TextInput
        accessibilityLabel={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8A98A3"
        style={styles.searchInput}
      />
    </View>
  );
}

const CategoryCard = memo(function CategoryCard({
  category,
  onPress,
}: {
  category: ServiceCategory;
  onPress(): void;
}) {
  const Icon = iconMap[category.icon] ?? Settings;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${category.name} services`}
      onPress={onPress}
      style={({ pressed }) => [styles.category, pressed && { opacity: 0.75 }]}
    >
      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
        <Icon size={25} color={colors.primary} />
      </View>
      <AppText variant="caption" style={styles.categoryName}>
        {category.name}
      </AppText>
    </Pressable>
  );
});

const ServiceCard = memo(function ServiceCard({
  service,
  onPress,
}: {
  service: Service;
  onPress(): void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      <Card style={styles.serviceCard}>
        <View style={styles.serviceIcon}>
          <Hammer size={23} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <View style={styles.rowBetween}>
            <AppText variant="h3" style={styles.flex}>
              {service.name}
            </AppText>
            {service.popular ? <Pill label="Popular" active /> : null}
          </View>
          <AppText color={colors.muted} numberOfLines={2}>
            {service.description}
          </AppText>
          <View style={styles.meta}>
            <Rating value={service.rating} count={service.reviewCount} />
            <AppText variant="h3" color={colors.primary}>
              From {formatPrice(service.basePrice)}
            </AppText>
          </View>
        </View>
        <ChevronRight size={20} color={colors.muted} />
      </Card>
    </Pressable>
  );
});

const ProfessionalCard = memo(function ProfessionalCard({
  professional,
  onPress,
  compact = false,
}: {
  professional: Professional;
  onPress(): void;
  compact?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={compact ? styles.professionalCompactWrap : undefined}
    >
      <Card style={[styles.professionalCard, compact && styles.professionalCompact]}>
        <Image
          source={technician}
          style={compact ? styles.avatarLarge : styles.professionalImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.flex}>
          <View style={styles.nameRow}>
            <AppText variant="h3" numberOfLines={1} style={styles.flex}>
              {professional.name}
            </AppText>
            {professional.verified ? <ShieldCheck size={17} color={colors.primary} /> : null}
          </View>
          <Rating value={professional.rating} count={professional.reviewCount} />
          <View style={styles.smallMeta}>
            <Clock3 size={14} color={colors.muted} />
            <AppText variant="caption" color={colors.muted}>
              {professional.experienceYears} yrs · {professional.distanceKm} km away
            </AppText>
          </View>
          <AppText variant="h3" color={colors.primary}>
            {formatPrice(professional.hourlyRate)}/hr
          </AppText>
        </View>
        <ChevronRight size={18} color={colors.muted} />
      </Card>
    </Pressable>
  );
});

function BookingCard({ booking, onPress }: { booking: Booking; onPress(): void }) {
  const service = serviceData.find(item => item.id === booking.serviceId);
  const professional = professionals.find(item => item.id === booking.professionalId);
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.bookingCard}>
        <View style={styles.rowBetween}>
          <Pill
            label={booking.status.replace('_', ' ')}
            active={booking.status === 'upcoming' || booking.status === 'on_the_way'}
          />
          <AppText variant="caption" color={colors.muted}>
            #{booking.id}
          </AppText>
        </View>
        <AppText variant="h3">{service?.name ?? 'Home service'}</AppText>
        <View style={styles.smallMeta}>
          <Clock3 size={15} color={colors.muted} />
          <AppText color={colors.muted}>
            {booking.date} · {booking.time}
          </AppText>
        </View>
        <View style={styles.smallMeta}>
          <MapPin size={15} color={colors.muted} />
          <AppText color={colors.muted} numberOfLines={1}>
            {booking.address.line1}
          </AppText>
        </View>
        <View style={styles.rowBetween}>
          <AppText variant="caption">with {professional?.name}</AppText>
          <AppText variant="h3">{formatPrice(booking.total)}</AppText>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.xs,
  },
  search: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, color: colors.ink, fontSize: 15 },
  category: { alignItems: 'center', width: '25%', gap: spacing.xs, marginBottom: spacing.md },
  categoryIcon: {
    width: 58,
    height: 58,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: { textAlign: 'center' },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.softBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  professionalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  professionalCompactWrap: { width: 276, marginRight: spacing.sm },
  professionalCompact: { minHeight: 128 },
  professionalImage: {
    width: 76,
    height: 88,
    borderRadius: radius.md,
    backgroundColor: colors.softBlue,
  },
  avatarLarge: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.softBlue },
  nameRow: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  smallMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 3 },
  bookingCard: { gap: spacing.sm, marginBottom: spacing.sm },
});

export { BookingCard, CategoryCard, ProfessionalCard, SearchBar, ServiceCard };
