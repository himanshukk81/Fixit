import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ArrowRight, Tag } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card, EmptyState, ScreenLoader, SectionHeader } from '@/components/atoms';
import { CategoryCard, ProfessionalCard, SearchBar, ServiceCard } from '@/components/molecules';
import { EmergencyBanner, HomeHeader } from '@/components/organisms';
import { ScreenTemplate } from '@/components/templates';
import { useCategories, useProfessionals, useServices } from '@/hooks/queries';
import { useAuthStore } from '@/store/auth.store';
import { colors, radius, spacing } from '@/theme';

const technician = require('@assets/images/technician-hero.png');

function HomeScreen() {
  const name = useAuthStore(state => state.user?.name);
  const [search, setSearch] = useState('');
  const categories = useCategories();
  const serviceQuery = useServices();
  const proQuery = useProfessionals();
  const visibleServices = useMemo(
    () =>
      serviceQuery.data
        ?.filter(item => !search || item.name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 4) ?? [],
    [search, serviceQuery.data],
  );
  if (categories.isLoading || serviceQuery.isLoading || proQuery.isLoading) return <ScreenLoader />;
  return (
    <ScreenTemplate>
      <HomeHeader name={name} />
      <SearchBar value={search} onChangeText={setSearch} />
      <EmergencyBanner />
      <View>
        <SectionHeader title="What do you need?" />
        <View style={styles.grid}>
          {categories.data?.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onPress={() =>
                router.push({
                  pathname: '/services/[categoryId]',
                  params: { categoryId: category.id },
                })
              }
            />
          ))}
        </View>
      </View>
      <View>
        <SectionHeader
          title="Top professionals"
          action="View all"
          onAction={() => router.push('/services/carpenter')}
        />
        <FlashList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={proQuery.data ?? []}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ProfessionalCard
              compact
              professional={item}
              onPress={() =>
                router.push({
                  pathname: '/professionals/[professionalId]',
                  params: { professionalId: item.id },
                })
              }
            />
          )}
        />
      </View>
      <OfferCard />
      <View>
        <SectionHeader title={search ? `Results for “${search}”` : 'Popular services'} />
        {visibleServices.length ? (
          visibleServices.map(service => (
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
          <EmptyState title="No services found" message="Try another service or category." />
        )}
      </View>
    </ScreenTemplate>
  );
}

function OfferCard() {
  return (
    <Pressable onPress={() => router.push('/services/cleaning')}>
      <Card style={styles.offer}>
        <View style={styles.offerCopy}>
          <View style={styles.offerLabel}>
            <Tag size={14} color={colors.primary} />
            <AppText variant="caption" color={colors.primary}>
              WEEKEND OFFER
            </AppText>
          </View>
          <AppText variant="h2">20% off deep cleaning</AppText>
          <AppText color={colors.muted}>A fresher home, without giving up your weekend.</AppText>
          <View style={styles.offerAction}>
            <AppText variant="h3" color={colors.primary}>
              Book now
            </AppText>
            <ArrowRight size={18} color={colors.primary} />
          </View>
        </View>
        <Image
          source={technician}
          style={styles.offerImage}
          contentFit="cover"
          contentPosition="top"
        />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  offer: {
    padding: 0,
    overflow: 'hidden',
    minHeight: 168,
    flexDirection: 'row',
    backgroundColor: '#EAF7F4',
  },
  offerCopy: { flex: 1.4, gap: spacing.xs, padding: spacing.lg },
  offerImage: {
    flex: 0.8,
    minHeight: 168,
    borderTopRightRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  offerLabel: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  offerAction: { flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: spacing.xs },
});

export { HomeScreen };
