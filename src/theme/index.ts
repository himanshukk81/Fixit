import { Platform } from 'react-native';

const colors = {
  primary: '#087FAF',
  primaryDark: '#05678F',
  secondary: '#258CB0',
  accent: '#28B99A',
  success: '#2BAE66',
  warning: '#F5A623',
  danger: '#D94A4A',
  ink: '#18212B',
  muted: '#6F7B86',
  border: '#DCE7EC',
  canvas: '#F5FAFC',
  softBlue: '#E8F5FA',
  white: '#FFFFFF',
  black: '#000000',
} as const;

const spacing = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 40 } as const;
const radius = { sm: 8, md: 12, lg: 18, xl: 24, pill: 999 } as const;
const iconSizes = { sm: 16, md: 20, lg: 24, xl: 32 } as const;
const typography = {
  hero: { fontSize: 32, lineHeight: 38, fontWeight: '800' as const },
  h1: { fontSize: 26, lineHeight: 32, fontWeight: '800' as const },
  h2: { fontSize: 20, lineHeight: 26, fontWeight: '700' as const },
  h3: { fontSize: 16, lineHeight: 22, fontWeight: '700' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  caption: { fontSize: 12, lineHeight: 17, fontWeight: '500' as const },
};
const elevation = Platform.select({
  ios: {
    shadowColor: colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 3 },
  default: {},
});

export { colors, elevation, iconSizes, radius, spacing, typography };
