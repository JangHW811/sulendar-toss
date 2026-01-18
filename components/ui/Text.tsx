/**
 * 술렌다 Text 컴포넌트
 * 타이포그래피 시스템 기반 텍스트 컴포넌트
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

type TextVariant = 'display' | 'heading' | 'title' | 'body' | 'caption' | 'small';
type TextColor = 'primary' | 'secondary' | 'muted' | 'inverse';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor;
  center?: boolean;
  children: React.ReactNode;
}

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
        { color: colors.text[color] },
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
