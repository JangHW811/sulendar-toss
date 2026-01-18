/**
 * 상담 기록 관련 TanStack Query 훅
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultationsService, CreateConsultationParams } from '../services/consultations';
import { useAuth } from '../context';

const QUERY_KEY = 'consultations';

/**
 * 사용자의 상담 기록 조회
 */
export function useConsultations(limit = 50) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: [QUERY_KEY, 'list', user?.id, limit],
    queryFn: () => consultationsService.getByUser(user!.id, limit),
    enabled: !!user,
  });
}

/**
 * 날짜 범위로 상담 기록 조회
 */
export function useConsultationsByDateRange(startDate: string, endDate: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: [QUERY_KEY, 'range', user?.id, startDate, endDate],
    queryFn: () => consultationsService.getByDateRange(user!.id, startDate, endDate),
    enabled: !!user && !!startDate && !!endDate,
  });
}

/**
 * 상담 기록 생성 mutation
 */
export function useCreateConsultation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (params: Omit<CreateConsultationParams, 'userId'>) => 
      consultationsService.create({ ...params, userId: user!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/**
 * 상담 기록 삭제 mutation
 */
export function useDeleteConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => consultationsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
