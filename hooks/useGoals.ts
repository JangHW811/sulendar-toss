import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsService, CreateGoalParams } from '../services/goals';
import { useAuth } from '../context';

// Query Keys
export const goalsKeys = {
  all: ['goals'] as const,
  active: (userId: string) => [...goalsKeys.all, 'active', userId] as const,
  byType: (userId: string, type: string) => [...goalsKeys.all, 'type', userId, type] as const,
};

// 활성 목표 조회
export function useActiveGoals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: goalsKeys.active(user?.id ?? ''),
    queryFn: () => goalsService.getActive(user!.id),
    enabled: !!user,
  });
}

// 타입별 목표 조회
export function useGoalByType(type: 'weekly_limit' | 'sober_challenge') {
  const { user } = useAuth();

  return useQuery({
    queryKey: goalsKeys.byType(user?.id ?? '', type),
    queryFn: () => goalsService.getByType(user!.id, type),
    enabled: !!user,
  });
}

// 목표 생성
export function useCreateGoal() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (params: Omit<CreateGoalParams, 'userId'>) =>
      goalsService.create({ ...params, userId: user!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsKeys.all });
    },
  });
}

// 목표 수정
export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, updates }: { goalId: string; updates: { targetValue?: number; endDate?: string } }) =>
      goalsService.update(goalId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsKeys.all });
    },
  });
}

// 목표 비활성화
export function useDeactivateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: string) => goalsService.deactivate(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsKeys.all });
    },
  });
}
