import { supabase } from '../lib/supabase';
import type { Goal } from '../types';

export interface CreateGoalParams {
  userId: string;
  type: 'weekly_limit' | 'sober_challenge';
  targetValue: number;
  startDate: string;
  endDate?: string;
}

export interface GoalRow {
  id: string;
  user_id: string;
  type: 'weekly_limit' | 'sober_challenge';
  target_value: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
}

function rowToGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    targetValue: row.target_value,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    isActive: row.is_active,
  };
}

export const goalsService = {
  async create(params: CreateGoalParams): Promise<Goal> {
    await supabase
      .from('goals')
      .update({ is_active: false })
      .eq('user_id', params.userId)
      .eq('type', params.type)
      .eq('is_active', true);

    const { data, error } = await supabase
      .from('goals')
      .insert({
        user_id: params.userId,
        type: params.type,
        target_value: params.targetValue,
        start_date: params.startDate,
        end_date: params.endDate,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return rowToGoal(data);
  },

  async getActive(userId: string): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(rowToGoal);
  },

  async getByType(userId: string, type: 'weekly_limit' | 'sober_challenge'): Promise<Goal | null> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('type', type)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return rowToGoal(data);
  },

  async deactivate(goalId: string): Promise<void> {
    const { error } = await supabase
      .from('goals')
      .update({ is_active: false })
      .eq('id', goalId);

    if (error) throw error;
  },

  async update(goalId: string, updates: Partial<Pick<CreateGoalParams, 'targetValue' | 'endDate'>>): Promise<Goal> {
    const updateData: Record<string, unknown> = {};
    if (updates.targetValue !== undefined) updateData.target_value = updates.targetValue;
    if (updates.endDate !== undefined) updateData.end_date = updates.endDate;

    const { data, error } = await supabase
      .from('goals')
      .update(updateData)
      .eq('id', goalId)
      .select()
      .single();

    if (error) throw error;
    return rowToGoal(data);
  },
};
