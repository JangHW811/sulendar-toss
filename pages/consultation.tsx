/**
 * AI 상담 화면
 * intoss://sulendar/consultation
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { createRoute } from '@granite-js/react-native';
import { Text, Card } from '../components/ui';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { geminiService, ChatMessage, WeeklySummary } from '../services/gemini';
import { useDrinkLogsByDateRange, useCreateConsultation } from '../hooks';
import { useAuth } from '../context';
import { DRINK_INFO, DrinkType } from '../types';

export const Route = createRoute('/consultation', {
  component: ConsultationPage,
});

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

function ConsultationPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! 저는 술렌다 AI 상담사입니다. 음주 습관이나 건강에 대해 궁금한 점을 물어보세요.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const createConsultation = useCreateConsultation();

  // 이번 주 음주 데이터
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startDate = startOfWeek.toISOString().split('T')[0];
  const endDate = now.toISOString().split('T')[0];

  const { data: weekLogs = [] } = useDrinkLogsByDateRange(startDate, endDate);

  const weeklySummary: WeeklySummary = useMemo(() => {
    const totalMl = weekLogs.reduce((sum, log) => sum + log.volumeMl, 0);
    const drinkDays = new Set(weekLogs.map((log) => log.date)).size;

    // 가장 많이 마신 주종
    const typeTotals: Record<string, number> = {};
    weekLogs.forEach((log) => {
      typeTotals[log.drinkType] = (typeTotals[log.drinkType] || 0) + log.volumeMl;
    });
    const entries = Object.entries(typeTotals);
    const mainDrink = entries.length > 0
      ? DRINK_INFO[entries.sort(([, a], [, b]) => b - a)[0][0] as DrinkType].label
      : '없음';

    return { totalMl, drinkDays, mainDrink, logs: weekLogs };
  }, [weekLogs]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 대화 히스토리를 Gemini 형식으로 변환
      const history: ChatMessage[] = messages.slice(1).map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      const response = await geminiService.chat(
        userMessage.content,
        history,
        weeklySummary,
        user ? { name: user.name, weight: user.weight, height: user.height } : undefined
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // 상담 기록 저장
      await createConsultation.mutateAsync({
        question: userMessage.content,
        response: response,
        adWatched: false,
      });
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userMessage : styles.assistantMessage,
            ]}
          >
            <Text
              variant="body"
              color={message.role === 'user' ? 'inverse' : 'primary'}
            >
              {message.content}
            </Text>
          </View>
        ))}
        {isLoading && (
          <View style={[styles.messageBubble, styles.assistantMessage]}>
            <Text variant="body" color="secondary">답변을 생성하고 있어요...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="메시지를 입력하세요..."
          placeholderTextColor={colors.text.muted}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || isLoading}
        >
          <Text variant="body" color="inverse">전송</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary.main,
    borderBottomRightRadius: spacing.xs,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background.card,
    borderBottomLeftRadius: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    backgroundColor: colors.background.secondary,
  },
  input: {
    flex: 1,
    ...typography.body,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    color: colors.text.primary,
  },
  sendButton: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
