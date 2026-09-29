import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  PartyPopper,
  ShieldCheck,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';
import { z } from 'zod';

import {
  AppButton,
  AppInput,
  AppText,
  Card,
  EmptyState,
  Pill,
  ScreenLoader,
} from '@/components/atoms';
import { BookingSummary } from '@/components/organisms';
import { ScreenTemplate } from '@/components/templates';
import {
  useAvailability,
  useBookings,
  useCreateBooking,
  useProfessionals,
  useServices,
} from '@/hooks/queries';
import { defaultAddress } from '@/mocks/data';
import { useBookingStore } from '@/store/booking.store';
import { colors, radius, spacing } from '@/theme';
import { addressSchema } from '@/utils/validation';

function Header({ title, step }: { title: string; step?: string }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Back" hitSlop={12} onPress={() => router.back()}>
        <ArrowLeft size={23} color={colors.ink} />
      </Pressable>
      <View style={styles.flex}>
        <AppText variant="h2">{title}</AppText>
        {step ? (
          <AppText variant="caption" color={colors.muted}>
            {step}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

function ScheduleScreen() {
  const { serviceId, professionalId, date, time, chooseSlot } = useBookingStore();
  const availability = useAvailability(professionalId);
  const professionals = useProfessionals();
  const serviceQuery = useServices();
  const [selectedDate, setSelectedDate] = useState(date ?? '');
  const professional = professionals.data?.find(item => item.id === professionalId);
  const service = serviceQuery.data?.find(item => item.id === serviceId);
  const days = useMemo(
    () => [...new Set((availability.data ?? []).map(item => item.date))],
    [availability.data],
  );
  if (availability.isLoading || professionals.isLoading || serviceQuery.isLoading)
    return <ScreenLoader />;
  if (!serviceId || !professionalId)
    return (
      <ScreenTemplate>
        <Header title="Choose a time" />
        <EmptyState
          title="Choose an expert first"
          message="Select a service and professional before scheduling."
        />
        <AppButton label="Browse services" onPress={() => router.replace('/(tabs)')} />
      </ScreenTemplate>
    );
  const slots = availability.data?.filter(item => item.date === selectedDate) ?? [];
  return (
    <ScreenTemplate
      footer={
        <AppButton
          label="Continue to address"
          disabled={!selectedDate || !time || date !== selectedDate}
          onPress={() => router.push('/booking/address')}
        />
      }
    >
      <Header title="Choose date & time" step="Step 3 of 5" />
      <Card style={styles.selection}>
        <CalendarDays size={24} color={colors.primary} />
        <View style={styles.flex}>
          <AppText variant="h3">{service?.name}</AppText>
          <AppText color={colors.muted}>with {professional?.name}</AppText>
        </View>
      </Card>
      <AppText variant="h2">Select a date</AppText>
      <View style={styles.wrap}>
        {days.map(day => (
          <Pill
            key={day}
            label={new Date(`${day}T12:00:00`).toLocaleDateString('en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}
            active={selectedDate === day}
            onPress={() => {
              setSelectedDate(day);
              chooseSlot(day, '');
            }}
          />
        ))}
      </View>
      <AppText variant="h2">Available times</AppText>
      <View style={styles.wrap}>
        {selectedDate ? (
          slots.map(slot => (
            <Pressable
              key={slot.id}
              disabled={!slot.available}
              onPress={() => chooseSlot(selectedDate, slot.time)}
              style={[
                styles.slot,
                time === slot.time && date === selectedDate && styles.slotActive,
                !slot.available && styles.disabled,
              ]}
            >
              <Clock3 size={17} color={time === slot.time ? colors.white : colors.primary} />
              <AppText
                color={time === slot.time && date === selectedDate ? colors.white : colors.ink}
              >
                {slot.time}
              </AppText>
            </Pressable>
          ))
        ) : (
          <AppText color={colors.muted}>Choose a date to see available times.</AppText>
        )}
      </View>
      <Card style={styles.info}>
        <ShieldCheck size={20} color={colors.success} />
        <AppText color={colors.muted} style={styles.flex}>
          Free rescheduling up to two hours before your appointment.
        </AppText>
      </Card>
    </ScreenTemplate>
  );
}

type AddressForm = z.infer<typeof addressSchema>;
function AddressScreen() {
  const chooseAddress = useBookingStore(state => state.chooseAddress);
  const existing = useBookingStore(state => state.address);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: existing ?? defaultAddress,
  });
  const submit = handleSubmit(values => {
    chooseAddress({ id: existing?.id ?? 'address-draft', ...values });
    router.push('/booking/checkout');
  });
  return (
    <ScreenTemplate footer={<AppButton label="Review booking" onPress={submit} />}>
      <Header title="Service address" step="Step 4 of 5" />
      <Card style={styles.locationCard}>
        <MapPin size={26} color={colors.primary} />
        <View style={styles.flex}>
          <AppText variant="h3">Where should we come?</AppText>
          <AppText color={colors.muted}>
            Location permission is optional. Entering an address always works.
          </AppText>
        </View>
      </Card>
      <Controller
        control={control}
        name="label"
        render={({ field }) => (
          <AppInput
            label="Address label"
            placeholder="Home"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.label?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="line1"
        render={({ field }) => (
          <AppInput
            label="House / street"
            placeholder="42, 7th Main Road"
            value={field.value}
            onChangeText={field.onChange}
            multiline
            error={errors.line1?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="landmark"
        render={({ field }) => (
          <AppInput
            label="Landmark (optional)"
            placeholder="Near Metro Station"
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="city"
        render={({ field }) => (
          <AppInput
            label="City"
            placeholder="Bengaluru"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.city?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="postalCode"
        render={({ field }) => (
          <AppInput
            label="PIN code"
            placeholder="560038"
            keyboardType="number-pad"
            maxLength={6}
            value={field.value}
            onChangeText={field.onChange}
            error={errors.postalCode?.message}
          />
        )}
      />
    </ScreenTemplate>
  );
}

function CheckoutScreen() {
  const draft = useBookingStore();
  const reset = useBookingStore(state => state.reset);
  const serviceQuery = useServices();
  const professionals = useProfessionals();
  const create = useCreateBooking();
  const service = serviceQuery.data?.find(item => item.id === draft.serviceId);
  const professional = professionals.data?.find(item => item.id === draft.professionalId);
  if (serviceQuery.isLoading || professionals.isLoading) return <ScreenLoader />;
  if (!draft.serviceId || !draft.professionalId || !draft.date || !draft.time || !draft.address)
    return (
      <ScreenTemplate>
        <Header title="Review booking" />
        <EmptyState
          title="Booking is incomplete"
          message="Please return home and finish each booking step."
        />
        <AppButton label="Back home" onPress={() => router.replace('/(tabs)')} />
      </ScreenTemplate>
    );
  const confirm = async () => {
    const booking = await create.mutateAsync({
      serviceId: draft.serviceId!,
      professionalId: draft.professionalId!,
      date: draft.date!,
      time: draft.time!,
      address: draft.address!,
    });
    reset();
    router.replace({
      pathname: '/booking/success',
      params: { bookingId: booking.id, justBooked: 'true' },
    });
  };
  return (
    <ScreenTemplate
      footer={<AppButton label="Confirm booking" loading={create.isPending} onPress={confirm} />}
    >
      <Header title="Review booking" step="Step 5 of 5" />
      <BookingSummary
        service={service}
        professional={professional}
        date={draft.date}
        time={draft.time}
        address={draft.address}
      />
      <Card style={styles.coupon}>
        <AppText variant="h3">Have a coupon?</AppText>
        <AppText color={colors.muted}>
          Coupon support will be enabled with the production backend.
        </AppText>
        <AppButton label="Coupon unavailable in demo" variant="secondary" disabled />
      </Card>
      <Card style={styles.info}>
        <ShieldCheck size={20} color={colors.success} />
        <AppText color={colors.muted} style={styles.flex}>
          No payment will be collected. This creates a demo booking only.
        </AppText>
      </Card>
      {create.error ? (
        <AppText color={colors.danger}>Couldn’t confirm the booking. Please try again.</AppText>
      ) : null}
    </ScreenTemplate>
  );
}

function SuccessScreen() {
  const { bookingId, justBooked } = useLocalSearchParams<{
    bookingId: string;
    justBooked?: string;
  }>();
  const bookings = useBookings();
  const services = useServices();
  const professionals = useProfessionals();
  const booking = bookings.data?.find(item => item.id === bookingId);
  const service = services.data?.find(item => item.id === booking?.serviceId);
  const professional = professionals.data?.find(item => item.id === booking?.professionalId);
  if (bookings.isLoading || services.isLoading || professionals.isLoading) return <ScreenLoader />;
  if (!booking)
    return (
      <ScreenTemplate>
        <Header title="Booking" />
        <EmptyState
          title="Booking not found"
          message="Return to My Bookings to see your appointments."
        />
        <AppButton label="My bookings" onPress={() => router.replace('/(tabs)/bookings')} />
      </ScreenTemplate>
    );
  const isFresh = justBooked === 'true';
  return (
    <ScreenTemplate>
      <Header title={isFresh ? 'Booking confirmed' : 'Booking details'} />
      <View style={styles.success}>
        <View style={styles.successMark}>
          <Check size={48} color={colors.white} />
        </View>
        <PartyPopper size={26} color={colors.warning} />
        <AppText variant="h1">{isFresh ? 'Booking successful!' : service?.name}</AppText>
        <AppText color={colors.muted} style={styles.center}>
          Your booking ID is {booking.id}
        </AppText>
      </View>
      <BookingSummary
        service={service}
        professional={professional}
        date={booking.date}
        time={booking.time}
        address={booking.address}
      />
      <View style={styles.actions}>
        <AppButton
          label="Track professional"
          onPress={() =>
            router.push({
              pathname: '/booking/tracking/[bookingId]',
              params: { bookingId: booking.id },
            })
          }
        />
        <AppButton
          label="View my bookings"
          variant="secondary"
          onPress={() => router.replace('/(tabs)/bookings')}
        />
        <AppButton label="Back to home" variant="ghost" onPress={() => router.replace('/(tabs)')} />
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { minHeight: 48, flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  selection: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  slot: {
    minWidth: '46%',
    minHeight: 48,
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: radius.md,
  },
  slotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  disabled: { opacity: 0.35 },
  info: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', backgroundColor: '#EDFAF3' },
  locationCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.softBlue,
  },
  coupon: { gap: spacing.sm },
  success: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.sm },
  successMark: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { textAlign: 'center' },
  actions: { gap: spacing.sm },
});

export { AddressScreen, CheckoutScreen, ScheduleScreen, SuccessScreen };
