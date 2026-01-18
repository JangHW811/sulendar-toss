/**
 * 통계 화면
 * intoss://sulendar/stats
 */

import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { createRoute } from '@granite-js/react-native';
import { Text, Card, Loader } from '../components/ui';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { DRINK_INFO, DrinkType } from '../types';
import { useDrinkLogsByMonth } from '../hooks';
import { useAuth } from '../context';

export const Route = createRoute('/stats', {
  component: StatsPage,
});

const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

function StatsPage() {
  const { user } = useAuth();
  const now = new Date();
  const { data: logs = [], isLoading } = useDrinkLogsByMonth(
    now.getFullYear(),
    now.getMonth() + 1
  );

  // 이번 주 요일별 통계
  const weeklyStats = useMemo(() => {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const dailyTotals = Array(7).fill(0);

    logs.forEach((log) => {
      const logDate = new Date(log.date);
      if (logDate >= startOfWeek) {
        const dayIndex = logDate.getDay();
        dailyTotals[dayIndex] += log.volumeMl;
      }
    });

    const maxMl = Math.max(...dailyTotals, 1);
    return dailyTotals.map((ml, index) => ({
      day: DAYS_KO[index],
      ml,
      height: (ml / maxMl) * 100,
    }));
  }, [logs, now]);

  // 이번 달 가장 많이 마신 요일
  const mostDrinkingDay = useMemo(() => {
    const dayTotals = Array(7).fill(0);
    logs.forEach((log) => {
      const dayIndex = new Date(log.date).getDay();
      dayTotals[dayIndex] += log.volumeMl;
    });
    const maxIndex = dayTotals.indexOf(Math.max(...dayTotals));
    return DAYS_KO[maxIndex];
  }, [logs]);

  // 이번 달 가장 많이 마신 주종
  const mostDrinkType = useMemo(() => {
    const typeTotals: Record<string, number> = {};
    logs.forEach((log) => {
      typeTotals[log.drinkType] = (typeTotals[log.drinkType] || 0) + log.volumeMl;
    });
    const entries = Object.entries(typeTotals);
    if (entries.length === 0) return null;
    const [type] = entries.sort(([, a], [, b]) => b - a)[0];
    return type as DrinkType;
  }, [logs]);

  if (!user) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text variant="body" color="secondary">로그인이 필요합니다</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Loader size="large" />
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
        <Text variant="heading" style={styles.title}>통계</Text>

        {/* 이번 주 차트 */}
        <Card style={styles.chartCard}>
          <Text variant="title" style={styles.cardTitle}>이번 주</Text>
          <View style={styles.barChart}>
            {weeklyStats.map((stat, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${stat.height}%`,
                        backgroundColor: stat.ml > 0 ? colors.primary.main : colors.border.default,
                      },
                    ]}
                  />
                </View>
                <Text variant="small" color="secondary">{stat.day}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* 이번 달 인사이트 */}
        <Card style={styles.insightCard}>
          <Text variant="title" style={styles.cardTitle}>이번 달</Text>
          <View style={styles.insightRow}>
            <View style={styles.insightItem}>
              <Text variant="caption" color="secondary">가장 많이 마신 요일</Text>
              <Text variant="heading" color="primary">{mostDrinkingDay}요일</Text>
            </View>
            {mostDrinkType && (
              <View style={styles.insightItem}>
                <Text variant="caption" color="secondary">가장 많이 마신 술</Text>
                <View style={styles.drinkTypeRow}>
                  <Text style={styles.drinkEmoji}>{DRINK_INFO[mostDrinkType].icon}</Text>
                  <Text variant="heading" color="primary">
                    {DRINK_INFO[mostDrinkType].label}
                  </Text>
                </View>
              </View>
            )}
          </View>
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
  chartCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.md,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 150,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    flex: 1,
    width: 24,
    justifyContent: 'flex-end',
    marginBottom: spacing.xs,
  },
  bar: {
    width: '100%',
    borderRadius: borderRadius.sm,
    minHeight: 4,
  },
  insightCard: {
    padding: spacing.lg,
  },
  insightRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  insightItem: {
    flex: 1,
    gap: spacing.xs,
  },
  drinkTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  drinkEmoji: {
    fontSize: 24,
  },
});
