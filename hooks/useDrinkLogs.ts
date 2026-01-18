import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { drinkLogsService, CreateDrinkLogParams } from '../services/drinkLogs';
import { useAuth } from '../context';

// Query Keys
export const drinkLogsKeys = {
  all: ['drinkLogs'] as const,
  month: (userId: string, year: number, month: number) => 
    [...drinkLogsKeys.all, 'month', userId, year, month] as const,
  dateRange: (userId: string, startDate: string, endDate: string) =>
    [...drinkLogsKeys.all, 'range', userId, startDate, endDate] as const,
  date: (userId: string, date: string) =>
    [...drinkLogsKeys.all, 'date', userId, date] as const,
};

// 월별 음주 기록 조회
export function useDrinkLogsByMonth(year: number, month: number) {
  const { user } = useAuth();

  return useQuery({
    queryKey: drinkLogsKeys.month(user?.id ?? '', year, month),
    queryFn: () => drinkLogsService.getByMonth(user!.id, year, month),
    enabled: !!user,
  });
}

// 기간별 음주 기록 조회
export function useDrinkLogsByDateRange(startDate: string, endDate: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: drinkLogsKeys.dateRange(user?.id ?? '', startDate, endDate),
    queryFn: () => drinkLogsService.getByDateRange(user!.id, startDate, endDate),
    enabled: !!user,
  });
}

// 음주 기록 추가
export function useCreateDrinkLog() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (params: Omit<CreateDrinkLogParams, 'userId'>) =>
      drinkLogsService.create({ ...params, userId: user!.id }),
    onSuccess: () => {
      // 모든 drinkLogs 쿼리 invalidate
      queryClient.invalidateQueries({ queryKey: drinkLogsKeys.all });
    },
  });
}

// 음주 기록 삭제
export function useDeleteDrinkLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (logId: string) => drinkLogsService.delete(logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: drinkLogsKeys.all });
    },
  });
}

// 음주 기록 수정
export function useUpdateDrinkLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ logId, updates }: { logId: string; updates: { amount?: number; memo?: string } }) =>
      drinkLogsService.update(logId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: drinkLogsKeys.all });
    },
  });
}
