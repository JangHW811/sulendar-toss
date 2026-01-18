/**
 * 술렌다 Button 컴포넌트
 * TDS Button 기반 래퍼
 */

import React from 'react';
import { Button as TDSButton } from '@toss/tds-react-native';
import { ViewStyle } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children: string;
  style?: ViewStyle;
}

// TDS Button variant 매핑
const variantMap: Record<ButtonVariant, 'primary' | 'secondary' | 'outline'> = {
  primary: 'primary',
  secondary: 'secondary',
  ghost: 'secondary',
  outline: 'outline',
};

// TDS Button size 매핑
const sizeMap: Record<ButtonSize, 'small' | 'medium' | 'large'> = {
  sm: 'small',
  md: 'medium',
  lg: 'large',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onPress,
  children,
  style,
}: ButtonProps) {
  return (
    <TDSButton
      variant={variantMap[variant]}
      size={sizeMap[size]}
      disabled={disabled}
      onPress={onPress}
      style={[
        fullWidth && { width: '100%' },
        style,
      ] as ViewStyle[]}
    >
      {children}
    </TDSButton>
  );
}
