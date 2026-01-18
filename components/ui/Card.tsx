/**
 * 술렌다 Card 컴포넌트
 * TDS Border + Shadow 기반
 */

import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { Border, Shadow, colors } from '@toss/tds-react-native';

interface CardProps extends ViewProps {
  variant?: 'default' | 'glass' | 'elevated';
  padding?: 'sm' | 'md' | 'lg' | 'none';
  children: React.ReactNode;
}

const paddingValues = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 24,
};

export function Card({
  variant = 'default',
  padding = 'md',
  style,
  children,
  ...props
}: CardProps) {
  const content = (
    <View
      style={[
        styles.base,
        { padding: paddingValues[padding] },
        variant === 'glass' && styles.glass,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );

  // elevated variant는 Shadow 사용
  if (variant === 'elevated') {
    return (
      <Shadow radius={16}>
        <Border radius={16} color={colors.grey200}>
          {content}
        </Border>
      </Shadow>
    );
  }

  // default variant는 Border만 사용
  if (variant === 'default') {
    return (
      <Shadow radius={16} style={{ shadowOpacity: 0.05 }}>
        <Border radius={16} color={colors.grey100}>
          {content}
        </Border>
      </Shadow>
    );
  }

  // glass variant
  return (
    <Border radius={16} color={colors.grey200}>
      {content}
    </Border>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});
