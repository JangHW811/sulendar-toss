/**
 * 목표 설정 화면
 * intoss://sulendar/goals
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { createRoute } from '@granite-js/react-native';
import { Text, Card, Button } from '../components/ui';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { useActiveGoals, useCreateGoal, useDeactivateGoal } from '../hooks';
import { useAuth } from '../context';

export const Route = createRoute('/goals', {
  component: GoalsPage,
});

function GoalsPage() {
  const { user } = useAuth();
  const { data: goals = [], isLoading } = useActiveGoals();
  const createMutation = useCreateGoal();
  const deactivateMutation = useDeactivateGoal();

  const [weeklyLimit, setWeeklyLimit] = useState(3);

  const weeklyGoal = goals.find((g) => g.type === 'weekly_limit');
  const soberGoal = goals.find((g) => g.type === 'sober_challenge');

  const handleSetWeeklyGoal = async () => {
    try {
      await createMutation.mutateAsync({
        type: 'weekly_limit',
        targetValue: weeklyLimit,
        startDate: new Date().toISOString().split('T')[0],
      });
      Alert.alert('성공', '주간 음주 목표가 설정되었습니다');
    } catch (error) {
      Alert.alert('오류', '목표 설정에 실패했습니다');
    }
  };

  const handleStartSoberChallenge = async () => {
    try {
      await createMutation.mutateAsync({
        type: 'sober_challenge',
        targetValue: 7, // 7일 금주 챌린지
        startDate: new Date().toISOString().split('T')[0],
      });
      Alert.alert('성공', '금주 챌린지가 시작되었습니다!');
    } catch (error) {
      Alert.alert('오류', '챌린지 시작에 실패했습니다');
    }
  };

  const handleDeactivateGoal = async (goalId: string) => {
    try {
      await deactivateMutation.mutateAsync(goalId);
    } catch (error) {
      Alert.alert('오류', '목표 해제에 실패했습니다');
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text variant="body" color="secondary">로그인이 필요합니다</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="heading" style={styles.title}>목표</Text>

        {/* 주간 음주 제한 */}
        <Card style={styles.goalCard}>
          <Text variant="title" style={styles.cardTitle}>주간 음주 제한</Text>
          <Text variant="caption" color="secondary" style={styles.cardDescription}>
            일주일에 몇 번까지 마실까요?
          </Text>

          {weeklyGoal ? (
            <View style={styles.activeGoal}>
              <Text variant="display" color="primary">
                {weeklyGoal.targetValue}일
              </Text>
              <Text variant="caption" color="secondary">현재 목표</Text>
              <TouchableOpacity
                style={styles.deactivateButton}
                onPress={() => handleDeactivateGoal(weeklyGoal.id)}
              >
                <Text variant="small" color="muted">목표 해제</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.goalSetter}>
              <View style={styles.sliderRow}>
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => setWeeklyLimit(Math.max(1, weeklyLimit - 1))}
                >
                  <Text variant="heading">-</Text>
                </TouchableOpacity>
                <Text variant="display" color="primary">{weeklyLimit}</Text>
                <TouchableOpacity
                  style={styles.sliderButton}
                  onPress={() => setWeeklyLimit(Math.min(7, weeklyLimit + 1))}
                >
                  <Text variant="heading">+</Text>
                </TouchableOpacity>
              </View>
              <Button
                variant="primary"
                fullWidth
                onPress={handleSetWeeklyGoal}
                disabled={createMutation.isPending}
              >
                목표 설정
              </Button>
            </View>
          )}
        </Card>

        {/* 금주 챌린지 */}
        <Card style={styles.goalCard}>
          <Text variant="title" style={styles.cardTitle}>금주 챌린지</Text>
          <Text variant="caption" color="secondary" style={styles.cardDescription}>
            7일간 금주에 도전해보세요
          </Text>

          {soberGoal ? (
            <View style={styles.activeGoal}>
              <Text variant="display" color="primary">
                진행 중
              </Text>
              <Text variant="caption" color="secondary">
                시작일: {soberGoal.startDate}
              </Text>
              <TouchableOpacity
                style={styles.deactivateButton}
                onPress={() => handleDeactivateGoal(soberGoal.id)}
              >
                <Text variant="small" color="muted">챌린지 포기</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Button
              variant="outline"
              fullWidth
              onPress={handleStartSoberChallenge}
              disabled={createMutation.isPending}
            >
              챌린지 시작
            </Button>
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  title: {
    marginBottom: spacing.lg,
  },
  goalCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.xs,
  },
  cardDescription: {
    marginBottom: spacing.lg,
  },
  activeGoal: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  deactivateButton: {
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  goalSetter: {
    gap: spacing.lg,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  sliderButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
