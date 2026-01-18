/**
 * 홈 화면 - 캘린더 뷰
 * intoss://sulendar
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { createRoute } from '@granite-js/react-native';
import { Text, Card } from '../components/ui';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { DRINK_INFO, DrinkType } from '../types';
import { useDrinkLogsByMonth, useDeleteDrinkLog } from '../hooks';
import { useAuth } from '../context';

export const Route = createRoute('/', {
  component: HomePage,
});

function HomePage() {
  const navigation = Route.useNavigation();
  const { user, isLoading: authLoading, signIn } = useAuth();
  
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  
  const now = new Date();
  const { data: logs = [], isLoading } = useDrinkLogsByMonth(
    now.getFullYear(),
    now.getMonth() + 1
  );
  
  const deleteMutation = useDeleteDrinkLog();

  const selectedLogs = useMemo(() => {
    return logs.filter((log) => log.date === selectedDate);
  }, [logs, selectedDate]);

  const weekStats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekLogs = logs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= startOfWeek;
    });

    const totalMl = weekLogs.reduce((sum, log) => sum + log.volumeMl, 0);
    const drinkDays = new Set(weekLogs.map((log) => log.date.split('T')[0])).size;

    return { totalMl, drinkDays };
  }, [logs]);

  const handleDeleteLog = (logId: string) => {
    deleteMutation.mutate(logId);
  };

  const goToAddDrink = () => {
    navigation.navigate('/add-drink', { date: selectedDate });
  };

  // 로그인 필요
  if (!user && !authLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loginPrompt}>
          <Text variant="heading" center>술렌다</Text>
          <Text variant="body" color="secondary" center style={styles.loginText}>
            음주 기록을 시작하려면 로그인하세요
          </Text>
          <TouchableOpacity style={styles.loginButton} onPress={signIn}>
            <Text variant="body" color="inverse">토스로 로그인</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isLoading || authLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
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
        {/* 주간 요약 카드 */}
        <Card style={styles.summaryCard}>
          <Text variant="title" color="primary" style={styles.summaryTitle}>
            이번 주 요약
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text variant="display" color="primary">
                {weekStats.drinkDays}
              </Text>
              <Text variant="caption" color="secondary">
                음주일
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text variant="display" color="primary">
                {(weekStats.totalMl / 1000).toFixed(1)}L
              </Text>
              <Text variant="caption" color="secondary">
                총 음주량
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text variant="display" color="primary">
                {7 - weekStats.drinkDays}
              </Text>
              <Text variant="caption" color="secondary">
                금주일
              </Text>
            </View>
          </View>
        </Card>

        {/* 오늘 기록 섹션 */}
        <View style={styles.logsSection}>
          <View style={styles.logsSectionHeader}>
            <Text variant="title" color="primary">
              {selectedDate === today ? '오늘' : selectedDate.slice(5).replace('-', '/')} 기록
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={goToAddDrink}
              activeOpacity={0.7}
            >
              <Text variant="body" color="inverse">+ 추가</Text>
            </TouchableOpacity>
          </View>

          {selectedLogs.length === 0 ? (
            <Card variant="glass" style={styles.emptyCard}>
              <Text variant="body" color="secondary" center>
                기록이 없어요
              </Text>
              <Text variant="caption" color="muted" center>
                {selectedDate === today
                  ? '오늘은 금주하셨군요!'
                  : '이 날은 술을 안 마셨어요'}
              </Text>
            </Card>
          ) : (
            selectedLogs.map((log) => (
              <TouchableOpacity
                key={log.id}
                onLongPress={() => handleDeleteLog(log.id)}
                activeOpacity={0.8}
              >
                <Card style={styles.logCard}>
                  <View style={styles.logRow}>
                    <View
                      style={[
                        styles.logIcon,
                        { backgroundColor: `${colors.drinks[log.drinkType]}15` },
                      ]}
                    >
                      <Text style={styles.logEmoji}>
                        {DRINK_INFO[log.drinkType].icon}
                      </Text>
                    </View>
                    <View style={styles.logInfo}>
                      <Text variant="title" color="primary">
                        {DRINK_INFO[log.drinkType].label}
                      </Text>
                      <Text variant="caption" color="secondary">
                        {log.amount}{DRINK_INFO[log.drinkType].unit} ({log.volumeMl}ml)
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loginText: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  loginButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  summaryCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  summaryTitle: {
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.default,
  },
  logsSection: {
    marginTop: spacing.lg,
  },
  logsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  emptyCard: {
    padding: spacing.xl,
    gap: spacing.xs,
  },
  logCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logEmoji: {
    fontSize: 24,
  },
  logInfo: {
    flex: 1,
    gap: spacing.xs,
  },
});
