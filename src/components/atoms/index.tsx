import { AlertCircle, Star } from 'lucide-react-native';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  type TextProps,
  View,
  type ViewProps,
} from 'react-native';

import { colors, elevation, radius, spacing, typography } from '@/theme';

import type { ComponentProps, PropsWithChildren, ReactNode } from 'react';

type TextVariant = 'hero' | 'h1' | 'h2' | 'h3' | 'body' | 'caption';
function AppText({
  variant = 'body',
  color = colors.ink,
  style,
  ...props
}: TextProps & { variant?: TextVariant; color?: string }) {
  return <Text {...props} style={[typography[variant], { color }, style]} />;
}

interface ButtonProps extends ComponentProps<typeof Pressable> {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}
function AppButton({
  label,
  variant = 'primary',
  loading,
  disabled,
  icon,
  fullWidth = true,
  style,
  ...props
}: ButtonProps) {
  const isSolid = variant === 'primary' || variant === 'danger';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled || loading), busy: Boolean(loading) }}
      disabled={disabled || loading}
      {...props}
      style={state => [
        styles.button,
        fullWidth && styles.fullWidth,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'ghost' && styles.ghostButton,
        variant === 'danger' && styles.dangerButton,
        (disabled || loading) && styles.disabled,
        state.pressed && styles.pressed,
        typeof style === 'function' ? style(state) : style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isSolid ? colors.white : colors.primary} />
      ) : (
        <>
          {icon}
          <AppText
            variant="h3"
            color={isSolid ? colors.danger : colors.primary}
            style={icon ? styles.buttonLabelWithIcon : undefined}
          >
            {label}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

function AppInput({
  label,
  error,
  containerStyle,
  ...props
}: TextInputProps & { label?: string; error?: string; containerStyle?: ViewProps['style'] }) {
  return (
    <View style={[styles.inputWrap, containerStyle]}>
      {label ? (
        <AppText variant="caption" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <TextInput
        placeholderTextColor="#9AA7B0"
        accessibilityLabel={props.accessibilityLabel ?? label}
        {...props}
        style={[styles.input, error && styles.inputError, props.style]}
      />
      {error ? (
        <View style={styles.errorRow}>
          <AlertCircle size={14} color={colors.danger} />
          <AppText variant="caption" color={colors.danger}>
            {error}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

function Card({ children, style, ...props }: PropsWithChildren<ViewProps>) {
  return (
    <View {...props} style={[styles.card, style]}>
      {children}
    </View>
  );
}
function Pill({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={[styles.pill, active && styles.pillActive]}
    >
      <AppText variant="caption" color={active ? colors.white : colors.muted}>
        {label}
      </AppText>
    </Pressable>
  );
}
function Rating({ value, count, size = 14 }: { value: number; count?: number; size?: number }) {
  return (
    <View style={styles.rating}>
      <Star size={size} color={colors.warning} fill={colors.warning} />
      <AppText variant="caption">
        {value.toFixed(1)}
        {count === undefined ? '' : ` (${count})`}
      </AppText>
    </View>
  );
}
function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <AppText variant="h2">{title}</AppText>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <AppText variant="caption" color={colors.primary}>
            {action}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
function ScreenLoader() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} size="large" />
      <AppText color={colors.muted}>Loading…</AppText>
    </View>
  );
}
function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <View style={styles.center}>
      <AlertCircle size={32} color={colors.muted} />
      <AppText variant="h3">{title}</AppText>
      <AppText color={colors.muted} style={styles.centerText}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { width: '100%' },
  primaryButton: { backgroundColor: colors.primary },
  secondaryButton: { borderWidth: 1.5, borderColor: colors.primary, backgroundColor: colors.white },
  ghostButton: { backgroundColor: 'transparent' },
  dangerButton: { backgroundColor: colors.danger },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  buttonLabelWithIcon: { marginLeft: spacing.xs },
  inputWrap: { gap: spacing.xs },
  label: { color: colors.ink },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    color: colors.ink,
    fontSize: 15,
  },
  inputError: { borderColor: colors.danger },
  errorRow: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...elevation,
  },
  pill: {
    minHeight: 36,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  center: {
    flex: 1,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  centerText: { textAlign: 'center' },
});

export {
  AppButton,
  AppInput,
  AppText,
  Card,
  EmptyState,
  Pill,
  Rating,
  ScreenLoader,
  SectionHeader,
};
