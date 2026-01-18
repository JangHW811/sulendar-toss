/**
 * 음주 기록 추가 화면
 * intoss://sulendar/add-drink
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
import { DRINK_INFO, DrinkType } from '../types';
import { useCreateDrinkLog } from '../hooks';

const DRINK_TYPES: DrinkType[] = ['soju', 'beer', 'wine', 'whiskey', 'makgeolli', 'etc'];

export const Route = createRoute('/add-drink', {
  component: AddDrinkPage,
});

function AddDrinkPage() {
  const navigation = Route.useNavigation();
  const params = Route.useParams<{ date?: string }>();
  
  const date = params.date || new Date().toISOString().split('T')[0];
  
  const [selectedType, setSelectedType] = useState<DrinkType | null>(null);
  const [amount, setAmount] = useState(1);
  
  const createMutation = useCreateDrinkLog();

  const handleSelectType = (type: DrinkType) => {
    setSelectedType(type);
    setAmount(1);
  };

  const handleSave = async () => {
    if (!selectedType) {
      Alert.alert('알림', '주종을 선택해주세요');
      return;
    }

    try {
      await createMutation.mutateAsync({
        date,
        drinkType: selectedType,
        amount,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('오류', '저장에 실패했습니다');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="heading" style={styles.title}>
          {date.slice(5).replace('-', '/')} 음주 기록
        </Text>

        {/* 주종 선택 */}
        <Text variant="title" style={styles.sectionTitle}>
          무엇을 마셨나요?
        </Text>
        <View style={styles.drinkGrid}>
          {DRINK_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.drinkCard,
                selectedType === type && styles.drinkCardSelected,
              ]}
              onPress={() => handleSelectType(type)}
              activeOpacity={0.7}
            >
              <Text style={styles.drinkEmoji}>{DRINK_INFO[type].icon}</Text>
              <Text
                variant="body"
                color={selectedType === type ? 'inverse' : 'primary'}
              >
                {DRINK_INFO[type].label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 수량 선택 */}
        {selectedType && (
          <View style={styles.amountSection}>
            <Text variant="title" style={styles.sectionTitle}>
              얼마나 마셨나요?
            </Text>
            <Card style={styles.amountCard}>
              <View style={styles.amountRow}>
                <TouchableOpacity
                  style={styles.amountButton}
                  onPress={() => setAmount(Math.max(0.5, amount - 0.5))}
                >
                  <Text variant="heading" color="primary">-</Text>
                </TouchableOpacity>
                <View style={styles.amountDisplay}>
                  <Text variant="display" color="primary">
                    {amount}
                  </Text>
                  <Text variant="body" color="secondary">
                    {DRINK_INFO[selectedType].unit}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.amountButton}
                  onPress={() => setAmount(amount + 0.5)}
                >
                  <Text variant="heading" color="primary">+</Text>
                </TouchableOpacity>
              </View>
              <Text variant="caption" color="muted" center style={styles.mlText}>
                약 {amount * DRINK_INFO[selectedType].mlPerUnit}ml
              </Text>
            </Card>
          </View>
        )}
      </ScrollView>

      {/* 저장 버튼 */}
      <View style={styles.footer}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleSave}
          disabled={!selectedType || createMutation.isPending}
        >
          {createMutation.isPending ? '저장 중...' : '기록 저장'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  title: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  drinkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  drinkCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  drinkCardSelected: {
    backgroundColor: colors.primary.main,
  },
  drinkEmoji: {
    fontSize: 32,
  },
  amountSection: {
    marginTop: spacing.md,
  },
  amountCard: {
    padding: spacing.lg,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountButton: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountDisplay: {
    alignItems: 'center',
  },
  mlText: {
    marginTop: spacing.md,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
