/**
 * 술렌다 Text 컴포넌트
 * TDS 기반 타이포그래피
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors } from '@toss/tds-react-native';

type TextVariant = 'display' | 'heading' | 'title' | 'body' | 'caption' | 'small';
type TextColor = 'primary' | 'secondary' | 'muted' | 'inverse' | 'green' | 'red';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor;
  center?: boolean;
  children: React.ReactNode;
}

// TDS 스타일 기반 타이포그래피
const typography: Record<TextVariant, object> = {
  display: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  heading: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  title: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
};

// TDS 컬러 매핑
const colorMap: Record<TextColor, string> = {
  primary: colors.grey900,
  secondary: colors.grey600,
  muted: colors.grey400,
  inverse: '#FFFFFF',
  green: colors.green500,
  red: colors.red500,
};

export function Text({
  variant = 'body',
  color = 'primary',
  center = false,
  style,
  children,
  ...props
}: TextProps) {
  return (
    <RNText
      style={[
        typography[variant],
        { color: colorMap[color] },
        center && styles.center,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  center: {
    textAlign: 'center',
  },
});
