/**
 * 토스 로그인 서비스
 * @apps-in-toss/framework의 login API 사용
 */

import { supabase } from '../lib/supabase';
import type { User } from '../types';

// 토스 로그인 응답 타입 (실제 SDK 타입에 맞게 조정 필요)
export interface TossUser {
  userId: string;
  // 토스에서 제공하는 다른 정보들...
}

// Supabase users 테이블 row 타입
interface UserRow {
  id: string;
  name: string | null;
  weight: number | null;
  height: number | null;
  created_at: string;
  updated_at: string;
}

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name ?? undefined,
    weight: row.weight ?? undefined,
    height: row.height ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * 토스 로그인 후 Supabase에 사용자 정보 저장/업데이트
 */
export async function signInWithToss(tossUserId: string): Promise<User> {
  // Supabase users 테이블에 upsert
  const { data, error } = await supabase
    .from('users')
    .upsert({
      id: tossUserId,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return rowToUser(data);
}

/**
 * 현재 사용자 정보 조회
 */
export async function getCurrentUser(tossUserId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', tossUserId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return rowToUser(data);
}

/**
 * 사용자 프로필 업데이트
 */
export async function updateProfile(
  tossUserId: string,
  updates: Partial<Pick<User, 'name' | 'weight' | 'height'>>
): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', tossUserId)
    .select()
    .single();

  if (error) throw error;
  return rowToUser(data);
}

export const authService = {
  signInWithToss,
  getCurrentUser,
  updateProfile,
};
