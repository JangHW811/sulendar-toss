/**
 * 술렌다 컬러 시스템
 * TDS (Toss Design System) Green 기반
 */

import { colors as tdsColors } from '@toss/tds-react-native';

export const colors = {
  // Primary - TDS Green 계열
  primary: {
    light: tdsColors.green100,      // #aeefd5
    main: tdsColors.green500,       // #03b26c
    dark: tdsColors.green600,       // #02a262
    gradient: [tdsColors.green50, tdsColors.green500] as const,
  },

  // Background
  background: {
    primary: tdsColors.green50,     // #f0faf6
    secondary: tdsColors.background, // #FFFFFF
    card: tdsColors.background,
    glass: 'rgba(255, 255, 255, 0.7)',
    gradient: [tdsColors.green50, tdsColors.background] as const,
  },

  // Text - TDS Grey 계열
  text: {
    primary: tdsColors.grey900,     // #191f28
    secondary: tdsColors.grey600,   // #6b7684
    muted: tdsColors.grey400,       // #b0b8c1
    inverse: tdsColors.background,  // #FFFFFF
  },

  // Accent
  accent: {
    success: tdsColors.green500,    // #03b26c
    warning: tdsColors.orange500,   // #fe9800
    error: tdsColors.red500,        // #f04452
    info: tdsColors.blue500,        // #3182f6
  },

  // Border & Divider
  border: {
    light: tdsColors.greyOpacity50,
    default: tdsColors.grey200,     // #e5e8eb
  },

  // Drink type colors (주종별 컬러)
  drinks: {
    soju: tdsColors.green500,       // 초록 - 소주
    beer: tdsColors.orange500,      // 앰버 - 맥주
    wine: tdsColors.red500,         // 레드 - 와인
    whiskey: tdsColors.orange700,   // 앰버/오렌지 - 위스키
    makgeolli: tdsColors.grey400,   // 그레이 - 막걸리
    etc: tdsColors.grey600,         // 다크그레이 - 기타
  },

  // TDS 원본 colors 참조용
  tds: tdsColors,
} as const;

export type Colors = typeof colors;
