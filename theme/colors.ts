/**
 * 술렌다 컬러 시스템
 * 에메랄드 그린 기반 미니멀 디자인 (피그마 디자인 반영)
 */

export const colors = {
  // Primary - 에메랄드 그린 계열
  primary: {
    light: '#A7F3D0',    // emerald-200
    main: '#10B981',     // emerald-500
    dark: '#059669',     // emerald-600
    gradient: ['#D1FAE5', '#10B981'] as const,
  },

  // Background - 민트빛 그라데이션
  background: {
    primary: '#F0FDF4',     // emerald-50
    secondary: '#FFFFFF',
    card: 'rgba(255, 255, 255, 0.95)',
    glass: 'rgba(255, 255, 255, 0.7)',
    gradient: ['#F0FDF4', '#ECFDF5'] as const,
  },

  // Text
  text: {
    primary: '#1F2937',     // gray-800
    secondary: '#6B7280',   // gray-500
    muted: '#9CA3AF',       // gray-400
    inverse: '#FFFFFF',
  },

  // Accent
  accent: {
    success: '#22C55E',     // green-500
    warning: '#F59E0B',     // amber-500
    error: '#EF4444',       // red-500
    info: '#3B82F6',        // blue-500
  },

  // Border & Divider
  border: {
    light: 'rgba(0, 0, 0, 0.04)',
    default: 'rgba(0, 0, 0, 0.08)',
  },

  // Drink type colors (주종별 컬러) - 투톤 스타일
  drinks: {
    soju: '#22C55E',       // 초록 - 소주
    beer: '#F59E0B',       // 앰버 - 맥주
    wine: '#DC2626',       // 레드 - 와인
    whiskey: '#D97706',    // 앰버/오렌지 - 위스키
    makgeolli: '#A1A1AA',  // 그레이 - 막걸리
    etc: '#71717A',        // 다크그레이 - 기타
  },
} as const;

export type Colors = typeof colors;
