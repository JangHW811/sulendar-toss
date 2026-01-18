/**
 * 상담 기록 서비스 - Supabase 연동 (토스 로그인용)
 */

import { supabase } from '../lib/supabase';
import { Consultation } from '../types';

export interface CreateConsultationParams {
  userId: string;
  question: string;
  response: string;
  adWatched?: boolean;
}

// snake_case -> camelCase 변환
function toConsultation(row: any): Consultation {
  return {
    id: row.id,
    userId: row.user_id,
    question: row.question,
    response: row.response,
    adWatched: row.ad_watched,
    createdAt: row.created_at,
  };
}

/**
 * 상담 기록 생성
 */
async function create(params: CreateConsultationParams): Promise<Consultation> {
  const { data, error } = await supabase
    .from('consultations')
    .insert({
      user_id: params.userId,
      question: params.question,
      response: params.response,
      ad_watched: params.adWatched ?? false,
    })
    .select()
    .single();

  if (error) throw error;
  return toConsultation(data);
}

/**
 * 사용자의 상담 기록 조회 (최신순)
 */
async function getByUser(userId: string, limit = 50): Promise<Consultation[]> {
  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map(toConsultation);
}

/**
 * 특정 날짜 범위의 상담 기록 조회
 */
async function getByDateRange(userId: string, startDate: string, endDate: string): Promise<Consultation[]> {
  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', `${startDate}T00:00:00`)
    .lte('created_at', `${endDate}T23:59:59`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(toConsultation);
}

/**
 * 상담 기록 삭제
 */
async function remove(id: string): Promise<void> {
  const { error } = await supabase
    .from('consultations')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export const consultationsService = {
  create,
  getByUser,
  getByDateRange,
  remove,
};
