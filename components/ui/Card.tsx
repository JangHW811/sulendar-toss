/**
 * 술렌다 Card 컴포넌트
 * 피그마 디자인 기반 - 큰 border-radius, 부드러운 그림자
 */

import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/spacing';

interface CardProps extends ViewProps {
  variant?: 'default' | 'glass' | 'elevated';
  padding?: 'sm' | 'md' | 'lg' | 'none';
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  padding = 'md',
  style,
  children,
  ...props
}: CardProps) {
  return (
    <View
      style={[
        styles.base,
        variantStyles[variant],
        padding !== 'none' && paddingStyles[padding],
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
  },
});

const variantStyles = StyleSheet.create({
  default: {
    backgroundColor: colors.background.card,
    ...shadows.md,
  },
  glass: {
    backgroundColor: colors.background.glass,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  elevated: {
    backgroundColor: colors.background.secondary,
    ...shadows.lg,
  },
});

const paddingStyles = StyleSheet.create({
  sm: {
    padding: spacing.sm,
  },
  md: {
    padding: spacing.md,
  },
  lg: {
    padding: spacing.lg,
  },
});
