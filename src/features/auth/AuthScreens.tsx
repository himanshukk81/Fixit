import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Wrench, ArrowLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { z } from 'zod';

import { AppButton, AppInput, AppText, Card } from '@/components/atoms';
import { ScreenTemplate } from '@/components/templates';
import { services } from '@/services';
import { useAuthStore } from '@/store/auth.store';
import { colors, radius, spacing } from '@/theme';
import { otpSchema, phoneSchema } from '@/utils/validation';

type PhoneForm = z.infer<typeof phoneSchema>;
type OtpForm = z.infer<typeof otpSchema>;

function Brand() {
  return (
    <View style={styles.brand}>
      <View style={styles.brandMark}>
        <Wrench size={27} color={colors.white} />
      </View>
      <AppText variant="h1">FixIt</AppText>
    </View>
  );
}

function AuthActionButton({
  label,
  accessibilityLabel,
  loading,
  onPress,
}: {
  label: string;
  accessibilityLabel: string;
  loading: boolean;
  onPress: () => void | Promise<void>;
}) {
  return (
    <View style={styles.authButtonShell}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ disabled: loading, busy: loading }}
        disabled={loading}
        onPress={onPress}
        style={({ pressed }) => [styles.authButtonPressable, pressed && styles.authButtonPressed]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <AppText variant="h3" color="#FFFFFF" style={styles.authButtonLabel}>
            {label}
          </AppText>
        )}
      </Pressable>
    </View>
  );
}

function LoginScreen() {
  const setPendingPhone = useAuthStore(state => state.setPendingPhone);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PhoneForm>({ resolver: zodResolver(phoneSchema), defaultValues: { phone: '' } });
  const submit = handleSubmit(async ({ phone }) => {
    try {
      await services.auth.requestOtp(phone);
      setPendingPhone(phone);
      router.push('/(auth)/verify-otp');
    } catch {
      setError('phone', { message: 'Unable to continue. Try again.' });
    }
  });
  return (
    <ScreenTemplate>
      <View style={styles.loginTop}>
        <Brand />
        <View style={[styles.welcome, styles.authIntro]}>
          <AppText variant="hero" style={styles.centerText}>
            Welcome back!
          </AppText>
          <AppText color={colors.muted} style={styles.centerText}>
            Enter your phone number below
          </AppText>
        </View>
      </View>
      <Card style={styles.formCard}>
        <AppText variant="h2">Mobile number</AppText>
        <AppText color={colors.muted}>We’ll take you to the demo verification screen.</AppText>
        <View style={styles.phoneRow}>
          <View style={styles.country}>
            <AppText>🇮🇳 +91</AppText>
          </View>
          <Controller
            control={control}
            name="phone"
            render={({ field: { value, onChange, onBlur } }) => (
              <AppInput
                accessibilityLabel="Mobile number"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="number-pad"
                maxLength={10}
                placeholder="98765 43210"
                error={errors.phone?.message}
                containerStyle={styles.phoneInput}
              />
            )}
          />
        </View>
        <AuthActionButton
          accessibilityLabel="Continue to verification"
          label="Get OTP"
          loading={isSubmitting}
          onPress={submit}
        />
      </Card>
      <AppText variant="caption" color={colors.muted} style={styles.disclaimer}>
        Demo authentication only. No real SMS will be sent.
      </AppText>
    </ScreenTemplate>
  );
}

function VerifyOtpScreen() {
  const phone = useAuthStore(state => state.pendingPhone);
  const signIn = useAuthStore(state => state.signIn);
  const [seconds, setSeconds] = useState(30);
  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OtpForm>({ resolver: zodResolver(otpSchema), defaultValues: { otp: '' } });
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => setSeconds(value => value - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);
  const submit = handleSubmit(async ({ otp }) => {
    try {
      const result = await services.auth.verifyOtp(phone, otp);
      await signIn(result.user, result.token);
      router.replace('/(tabs)');
    } catch (error) {
      setError('otp', { message: error instanceof Error ? error.message : 'Verification failed' });
    }
  });
  return (
    <ScreenTemplate>
      <Pressable accessibilityLabel="Back" hitSlop={12} onPress={() => router.back()}>
        <ArrowLeft size={24} color={colors.ink} />
      </Pressable>
      <Brand />
      <View style={styles.welcome}>
        <AppText variant="hero">Check your phone</AppText>
        <AppText color={colors.muted}>
          Enter the six-digit demo code sent to +91 {phone || '••••••••••'}.
        </AppText>
      </View>
      <Card style={styles.formCard}>
        <Controller
          control={control}
          name="otp"
          render={({ field: { value, onChange, onBlur } }) => (
            <AppInput
              label="Verification code"
              accessibilityLabel="Six-digit verification code"
              value={value}
              onChangeText={text => onChange(text.replace(/\D/g, ''))}
              onBlur={onBlur}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="• • • • • •"
              error={errors.otp?.message}
              style={styles.otp}
            />
          )}
        />
        <AuthActionButton
          accessibilityLabel="Verify code and log in"
          label="Verify & log in"
          loading={isSubmitting}
          onPress={submit}
        />
        {/* <View style={styles.demoCode}>
          <AppText variant="caption" color={colors.primary}>
            Demo mode: any six-digit code works
          </AppText>
        </View> */}
        <AppButton
          label={seconds > 0 ? `Resend in 0:${String(seconds).padStart(2, '0')}` : 'Resend code'}
          variant="ghost"
          disabled={seconds > 0}
          onPress={() => {
            setSeconds(30);
            reset();
            void services.auth.requestOtp(phone);
          }}
        />
      </Card>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  loginTop: { minHeight: 150, justifyContent: 'space-between', paddingTop: spacing.sm },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: spacing.sm,
  },
  brandMark: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: { gap: spacing.xs, marginVertical: spacing.lg },
  authIntro: { alignItems: 'center', marginVertical: spacing.md },
  centerText: { textAlign: 'center' },
  formCard: { gap: spacing.md },
  phoneRow: { flexDirection: 'row', gap: spacing.sm },
  country: {
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
  },
  phoneInput: { flex: 1 },
  disclaimer: { textAlign: 'center', marginTop: spacing.sm },
  otp: { fontSize: 24, letterSpacing: 12, textAlign: 'center' },
  demoCode: {
    backgroundColor: colors.softBlue,
    borderRadius: radius.sm,
    padding: spacing.sm,
    alignItems: 'center',
  },
  authButtonShell: {
    width: '100%',
    // height: 52,
    marginTop: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: '#078DC3',
    borderWidth: 1,
    borderColor: '#0477A7',
    overflow: 'hidden',
    // elevation: 2,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    padding: 15,
  },
  authButtonPressable: {
    flex: 1,
    width: '100%',
    backgroundColor: '#078DC3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authButtonPressed: { backgroundColor: colors.primaryDark, opacity: 0.92 },
  authButtonLabel: { color: '#FFFFFF', textAlign: 'center' },
});

export { LoginScreen, VerifyOtpScreen };
