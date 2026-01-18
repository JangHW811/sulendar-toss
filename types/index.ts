/**
 * 술렌다 타입 정의
 */

export type DrinkType = 'soju' | 'beer' | 'wine' | 'whiskey' | 'makgeolli' | 'etc';

export interface DrinkLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  drinkType: DrinkType;
  amount: number; // 병 단위
  volumeMl: number; // ml 환산
  memo?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name?: string;
  weight?: number; // kg
  height?: number; // cm
  createdAt: string;
  updatedAt?: string;
}

export interface Goal {
  id: string;
  userId: string;
  type: 'weekly_limit' | 'sober_challenge';
  targetValue: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface Consultation {
  id: string;
  userId: string;
  question: string;
  response: string;
  adWatched: boolean;
  createdAt: string;
}

export interface DayData {
  date: string;
  logs: DrinkLog[];
  totalMl: number;
}

// 주종별 정보
export const DRINK_INFO: Record<DrinkType, { label: string; icon: string; unit: string; mlPerUnit: number; alcoholPercent: number }> = {
  soju: { label: '소주', icon: '🍶', unit: '병', mlPerUnit: 360, alcoholPercent: 17 },
  beer: { label: '맥주', icon: '🍺', unit: '병', mlPerUnit: 500, alcoholPercent: 5 },
  wine: { label: '와인', icon: '🍷', unit: '병', mlPerUnit: 750, alcoholPercent: 13 },
  whiskey: { label: '위스키', icon: '🥃', unit: '잔', mlPerUnit: 30, alcoholPercent: 40 },
  makgeolli: { label: '막걸리', icon: '🍵', unit: '병', mlPerUnit: 750, alcoholPercent: 6 },
  etc: { label: '기타', icon: '🍸', unit: '잔', mlPerUnit: 150, alcoholPercent: 15 },
};
