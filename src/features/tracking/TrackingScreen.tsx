import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MapPin, Navigation } from 'lucide-react-native';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { AppText, Card, ScreenLoader } from '@/components/atoms';
import { BookingProgress, ContactActions } from '@/components/organisms';
import { ScreenTemplate } from '@/components/templates';
import { useBookings, useProfessionals, useTracking } from '@/hooks/queries';
import { colors, radius, spacing } from '@/theme';

function TrackingScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const tracking = useTracking(bookingId);
  const bookingQuery = useBookings();
  const pros = useProfessionals();
  const booking = bookingQuery.data?.find(item => item.id === bookingId);
  const professional = pros.data?.find(item => item.id === booking?.professionalId);
  const snapshot = tracking.data;
  if (tracking.isLoading || bookingQuery.isLoading || pros.isLoading || !snapshot)
    return <ScreenLoader />;
  const needsFallback = Platform.OS === 'android' && !process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  return (
    <ScreenTemplate>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Back" hitSlop={12} onPress={() => router.back()}>
          <ArrowLeft size={23} color={colors.ink} />
        </Pressable>
        <View style={styles.flex}>
          <AppText variant="h2">Track your expert</AppText>
          <AppText variant="caption" color={colors.warning}>
            SIMULATED FOR DEMO
          </AppText>
        </View>
      </View>
      {needsFallback ? (
        <FallbackMap progress={snapshot.progress} />
      ) : (
        <View style={styles.mapWrap}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: (snapshot.latitude + snapshot.destinationLatitude) / 2,
              longitude: (snapshot.longitude + snapshot.destinationLongitude) / 2,
              latitudeDelta: 0.025,
              longitudeDelta: 0.025,
            }}
          >
            <Marker
              coordinate={{ latitude: snapshot.latitude, longitude: snapshot.longitude }}
              title={professional?.name ?? 'Expert'}
            >
              <View style={styles.proMarker}>
                <Navigation size={18} color={colors.white} />
              </View>
            </Marker>
            <Marker
              coordinate={{
                latitude: snapshot.destinationLatitude,
                longitude: snapshot.destinationLongitude,
              }}
              title="Your address"
            />
            <Polyline
              coordinates={[
                { latitude: snapshot.latitude, longitude: snapshot.longitude },
                {
                  latitude: snapshot.destinationLatitude,
                  longitude: snapshot.destinationLongitude,
                },
              ]}
              strokeColor={colors.primary}
              strokeWidth={5}
            />
          </MapView>
          <View style={styles.mapBadge}>
            <AppText variant="caption">Demo route · updates every 3 sec</AppText>
          </View>
        </View>
      )}
      <Card style={styles.etaCard}>
        <View style={styles.eta}>
          <AppText variant="hero" color={colors.primary}>
            {snapshot.etaMinutes}
          </AppText>
          <AppText variant="caption" color={colors.muted}>
            MIN{snapshot.etaMinutes === 1 ? '' : 'S'}
          </AppText>
        </View>
        <View style={styles.flex}>
          <AppText variant="h2">{professional?.name} is on the way</AppText>
          <AppText color={colors.muted}>Arriving at {booking?.address.line1}</AppText>
        </View>
      </Card>
      <ContactActions name={professional?.name ?? 'your expert'} />
      <BookingProgress active="on_the_way" />
    </ScreenTemplate>
  );
}

function FallbackMap({ progress }: { progress: number }) {
  return (
    <View style={styles.fallback}>
      <View style={styles.roadA} />
      <View style={styles.roadB} />
      <View style={[styles.route, { height: `${Math.max(30, progress * 70)}%` }]} />
      <View style={[styles.techPin, { bottom: `${15 + progress * 45}%` }]}>
        <Navigation size={18} color={colors.white} />
      </View>
      <View style={styles.homePin}>
        <MapPin size={26} color={colors.danger} />
      </View>
      <View style={styles.fallbackLabel}>
        <AppText variant="caption">
          Map preview · add a Google Maps key for native Android tiles
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { minHeight: 48, flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  mapWrap: { height: 330, borderRadius: radius.lg, overflow: 'hidden' },
  map: { flex: 1 },
  mapBadge: {
    position: 'absolute',
    left: spacing.sm,
    top: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  proMarker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  fallback: {
    height: 330,
    borderRadius: radius.lg,
    backgroundColor: '#EAF1EE',
    overflow: 'hidden',
  },
  roadA: {
    position: 'absolute',
    width: 55,
    height: 430,
    backgroundColor: '#FFF',
    left: '48%',
    top: -40,
    transform: [{ rotate: '22deg' }],
  },
  roadB: {
    position: 'absolute',
    width: 440,
    height: 38,
    backgroundColor: '#FFF',
    left: -40,
    top: 165,
    transform: [{ rotate: '-9deg' }],
  },
  route: {
    position: 'absolute',
    width: 6,
    minHeight: 90,
    backgroundColor: colors.primary,
    left: '52%',
    bottom: '22%',
    borderRadius: 3,
    transform: [{ rotate: '17deg' }],
  },
  techPin: {
    position: 'absolute',
    left: '39%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homePin: { position: 'absolute', right: '26%', top: '17%' },
  fallbackLabel: {
    position: 'absolute',
    left: spacing.sm,
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  etaCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  eta: { width: 64, alignItems: 'center' },
});

export { TrackingScreen };
