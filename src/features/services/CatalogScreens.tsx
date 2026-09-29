import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle2, Clock3, ShieldCheck } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppText,
  Card,
  EmptyState,
  Pill,
  Rating,
  ScreenLoader,
  SectionHeader,
} from '@/components/atoms';
import { ProfessionalCard, SearchBar, ServiceCard } from '@/components/molecules';
import { ProfessionalHero } from '@/components/organisms';
import { ScreenTemplate } from '@/components/templates';
import { useCategories, useProfessionals, useServices } from '@/hooks/queries';
import { useBookingStore } from '@/store/booking.store';
import { colors, spacing } from '@/theme';
import { formatPrice } from '@/utils/format';

function BackHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Back" hitSlop={12} onPress={() => router.back()}>
        <ArrowLeft size={23} color={colors.ink} />
      </Pressable>
      <View style={styles.flex}>
        <AppText variant="h2">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" color={colors.muted}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

function ServiceListingScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'recommended' | 'price' | 'rating'>('recommended');
  const categoryQuery = useCategories();
  const serviceQuery = useServices(categoryId);
  const proQuery = useProfessionals(categoryId);
  const category = categoryQuery.data?.find(item => item.id === categoryId);
  const filtered = useMemo(() => {
    const list = (serviceQuery.data ?? []).filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()),
    );
    return [...list].sort((a, b) =>
      sort === 'price'
        ? a.basePrice - b.basePrice
        : sort === 'rating'
          ? b.rating - a.rating
          : Number(Boolean(b.popular)) - Number(Boolean(a.popular)),
    );
  }, [query, serviceQuery.data, sort]);
  if (serviceQuery.isLoading || proQuery.isLoading) return <ScreenLoader />;
  return (
    <ScreenTemplate>
      <BackHeader
        title={`${category?.name ?? 'Home'} services`}
        subtitle="Verified experts · upfront prices"
      />
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder={`Search ${category?.name?.toLowerCase() ?? ''} services`}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {(['recommended', 'price', 'rating'] as const).map(item => (
          <Pill
            key={item}
            label={item[0]!.toUpperCase() + item.slice(1)}
            active={sort === item}
            onPress={() => setSort(item)}
          />
        ))}
      </ScrollView>
      <View>
        <SectionHeader title="Services" />
        {filtered.length ? (
          filtered.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onPress={() =>
                router.push({
                  pathname: '/services/details/[serviceId]',
                  params: { serviceId: service.id },
                })
              }
            />
          ))
        ) : (
          <EmptyState title="No match" message="Try changing your search or filter." />
        )}
      </View>
      <View>
        <SectionHeader title="Available professionals" />
        {proQuery.data?.map(pro => (
          <ProfessionalCard
            key={pro.id}
            professional={pro}
            onPress={() =>
              router.push({
                pathname: '/professionals/[professionalId]',
                params: { professionalId: pro.id },
              })
            }
          />
        ))}
      </View>
    </ScreenTemplate>
  );
}

function ServiceDetailScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const allServices = useServices();
  const professionals = useProfessionals();
  const chooseService = useBookingStore(state => state.chooseService);
  const service = allServices.data?.find(item => item.id === serviceId);
  const pros =
    professionals.data?.filter(item => service && item.categoryIds.includes(service.categoryId)) ??
    [];
  if (allServices.isLoading || professionals.isLoading) return <ScreenLoader />;
  if (!service)
    return (
      <ScreenTemplate>
        <BackHeader title="Service" />
        <EmptyState title="Service unavailable" message="This service may have moved." />
      </ScreenTemplate>
    );
  return (
    <ScreenTemplate
      footer={
        <AppButton
          label={`Choose professional · ${formatPrice(service.basePrice)}`}
          onPress={() => {
            chooseService(service.id);
            router.push(`/services/${service.categoryId}`);
          }}
        />
      }
    >
      <BackHeader title="Service details" />
      <Card style={styles.detailHero}>
        <View style={styles.serviceGlyph}>
          <CheckCircle2 size={34} color={colors.primary} />
        </View>
        <AppText variant="h1">{service.name}</AppText>
        <Rating value={service.rating} count={service.reviewCount} />
        <AppText color={colors.muted}>{service.description}</AppText>
        <View style={styles.detailMeta}>
          <View>
            <AppText variant="caption" color={colors.muted}>
              STARTING AT
            </AppText>
            <AppText variant="h1" color={colors.primary}>
              {formatPrice(service.basePrice)}
            </AppText>
          </View>
          <View>
            <AppText variant="caption" color={colors.muted}>
              DURATION
            </AppText>
            <View style={styles.inline}>
              <Clock3 size={16} color={colors.ink} />
              <AppText variant="h3">{service.durationMinutes} min</AppText>
            </View>
          </View>
        </View>
      </Card>
      <Card style={styles.listCard}>
        <AppText variant="h2">What’s included</AppText>
        {[
          'Inspection and diagnosis',
          'Professional labour',
          'Basic cleanup after service',
          '30-day service assurance',
        ].map(item => (
          <View key={item} style={styles.included}>
            <CheckCircle2 size={18} color={colors.success} />
            <AppText>{item}</AppText>
          </View>
        ))}
      </Card>
      <View>
        <SectionHeader title="Recommended experts" />
        {pros.map(pro => (
          <ProfessionalCard
            key={pro.id}
            professional={pro}
            onPress={() => {
              chooseService(service.id);
              router.push({
                pathname: '/professionals/[professionalId]',
                params: { professionalId: pro.id },
              });
            }}
          />
        ))}
      </View>
    </ScreenTemplate>
  );
}

function ProfessionalDetailScreen() {
  const { professionalId } = useLocalSearchParams<{ professionalId: string }>();
  const pros = useProfessionals();
  const allServices = useServices();
  const chooseService = useBookingStore(state => state.chooseService);
  const chooseProfessional = useBookingStore(state => state.chooseProfessional);
  const selectedServiceId = useBookingStore(state => state.serviceId);
  const professional = pros.data?.find(item => item.id === professionalId);
  const eligibleServices =
    allServices.data?.filter(item => professional?.categoryIds.includes(item.categoryId)) ?? [];
  if (pros.isLoading || allServices.isLoading) return <ScreenLoader />;
  if (!professional)
    return (
      <ScreenTemplate>
        <BackHeader title="Professional" />
        <EmptyState title="Expert unavailable" message="Please choose another professional." />
      </ScreenTemplate>
    );
  const book = () => {
    const serviceId =
      selectedServiceId && eligibleServices.some(item => item.id === selectedServiceId)
        ? selectedServiceId
        : eligibleServices[0]?.id;
    if (!serviceId) return;
    chooseService(serviceId);
    chooseProfessional(professional.id);
    router.push('/booking/schedule');
  };
  return (
    <ScreenTemplate footer={<AppButton label="Book this expert" onPress={book} />}>
      <BackHeader title="Expert profile" />
      <ProfessionalHero professional={professional} />
      <View>
        <SectionHeader title="Services & pricing" />
        {eligibleServices.map(service => (
          <Pressable key={service.id} onPress={() => chooseService(service.id)}>
            <Card style={[styles.priceCard, selectedServiceId === service.id && styles.selected]}>
              <View style={styles.flex}>
                <AppText variant="h3">{service.name}</AppText>
                <AppText variant="caption" color={colors.muted}>
                  {service.durationMinutes} min
                </AppText>
              </View>
              <AppText variant="h3" color={colors.primary}>
                {formatPrice(service.basePrice)}
              </AppText>
            </Card>
          </Pressable>
        ))}
      </View>
      <View>
        <SectionHeader title="Customer reviews" action={`${professional.reviews.length} reviews`} />
        {professional.reviews.map(review => (
          <Card key={review.id} style={styles.review}>
            <View style={styles.inline}>
              <AppText variant="h3" style={styles.flex}>
                {review.customerName}
              </AppText>
              <Rating value={review.rating} />
            </View>
            <AppText>{review.comment}</AppText>
            <AppText variant="caption" color={colors.muted}>
              {review.date}
            </AppText>
          </Card>
        ))}
      </View>
      <Card style={styles.safety}>
        <ShieldCheck size={24} color={colors.success} />
        <View style={styles.flex}>
          <AppText variant="h3">FixIt verified</AppText>
          <AppText color={colors.muted}>Identity and background checks completed.</AppText>
        </View>
      </Card>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { minHeight: 48, flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  filters: { gap: spacing.xs },
  detailHero: { gap: spacing.sm },
  serviceGlyph: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: colors.softBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailMeta: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing.sm },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  listCard: { gap: spacing.sm },
  included: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  priceCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  selected: { borderWidth: 2, borderColor: colors.primary },
  review: { gap: spacing.xs, marginBottom: spacing.sm },
  safety: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    backgroundColor: '#EDFAF3',
  },
});

export { ProfessionalDetailScreen, ServiceDetailScreen, ServiceListingScreen };
