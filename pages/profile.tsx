/**
 * 프로필 화면
 * intoss://sulendar/profile
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { createRoute } from '@granite-js/react-native';
import { Text, Card, Button, Input } from '../components/ui';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useAuth } from '../context';

export const Route = createRoute('/profile', {
  component: ProfilePage,
});

function ProfilePage() {
  const { user, signOut, updateProfile, isLoading } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [weight, setWeight] = useState(user?.weight?.toString() || '');
  const [height, setHeight] = useState(user?.height?.toString() || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: name || undefined,
        weight: weight ? parseFloat(weight) : undefined,
        height: height ? parseFloat(height) : undefined,
      });
      Alert.alert('성공', '프로필이 저장되었습니다');
    } catch (error) {
      Alert.alert('오류', '저장에 실패했습니다');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '로그아웃', style: 'destructive', onPress: signOut },
      ]
    );
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
        <Text variant="heading" style={styles.title}>프로필</Text>

        {/* 신체 정보 */}
        <Card style={styles.card}>
          <Text variant="title" style={styles.cardTitle}>신체 정보</Text>
          <Text variant="caption" color="secondary" style={styles.cardDescription}>
            AI 상담 시 더 정확한 조언을 받을 수 있어요
          </Text>

          <Input
            label="이름 (선택)"
            value={name}
            onChangeText={setName}
            placeholder="이름을 입력하세요"
          />

          <Input
            label="체중 (kg)"
            value={weight}
            onChangeText={setWeight}
            placeholder="예: 70"
            keyboardType="numeric"
          />

          <Input
            label="키 (cm)"
            value={height}
            onChangeText={setHeight}
            placeholder="예: 175"
            keyboardType="numeric"
          />

          <Button
            variant="primary"
            fullWidth
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </Card>

        {/* 앱 정보 */}
        <Card style={styles.card}>
          <Text variant="title" style={styles.cardTitle}>앱 정보</Text>
          <View style={styles.infoRow}>
            <Text variant="body" color="secondary">버전</Text>
            <Text variant="body">1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="body" color="secondary">사용자 ID</Text>
            <Text variant="small" color="muted">{user.id.slice(0, 20)}...</Text>
          </View>
        </Card>

        {/* 로그아웃 */}
        <Button
          variant="ghost"
          fullWidth
          onPress={handleSignOut}
          style={styles.signOutButton}
        >
          로그아웃
        </Button>
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
  card: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.xs,
  },
  cardDescription: {
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  signOutButton: {
    marginTop: spacing.lg,
  },
});
