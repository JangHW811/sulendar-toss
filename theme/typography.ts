/**
 * 술렌다 타이포그래피 시스템
 * 시스템 폰트 사용 (토스 앱 내에서 실행)
 */

import { TextStyle, Platform } from 'react-native';

// 플랫폼별 폰트 패밀리 (시스템 폰트 사용)
const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
};

export const typography = {
  // Display - 큰 숫자, 강조 텍스트
  display: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  } as TextStyle,

  // Heading - 섹션 제목
  heading: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: -0.3,
  } as TextStyle,

  // Title - 카드/항목 제목
  title: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    letterSpacing: -0.2,
  } as TextStyle,

  // Body - 본문
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0,
  } as TextStyle,

  // Caption - 설명, 라벨
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,

  // Small - 작은 텍스트
  small: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.2,
  } as TextStyle,
} as const;

export { fontFamily };
export type Typography = typeof typography;
