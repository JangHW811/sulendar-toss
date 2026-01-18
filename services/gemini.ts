/**
 * Gemini AI 서비스 - 음주 건강 상담
 */

import { DrinkLog, DRINK_INFO, DrinkType } from '../types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface WeeklySummary {
  totalMl: number;
  drinkDays: number;
  mainDrink: string;
  logs: DrinkLog[];
}

export interface UserContext {
  weight?: number;
  height?: number;
  name?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const SYSTEM_PROMPT = `당신은 "술렌다" 앱의 AI 건강 상담사입니다.

역할:
- 사용자의 음주 습관에 대해 친근하고 이해심 있게 상담합니다
- 건강 정보를 쉽게 설명하고, 실천 가능한 조언을 제공합니다
- 판단하거나 비난하지 않고, 긍정적인 변화를 격려합니다

주의사항:
- 의학적 진단이나 처방을 하지 않습니다
- "의사 상담을 권장합니다" 등의 면책 문구를 적절히 포함합니다
- 한국어로 응답하며, 이모지를 적절히 사용해 친근함을 유지합니다
- 응답은 간결하게 (최대 3-4문장) 유지합니다

알코올 관련 참고 정보:
- 성인 남성 권장 음주량: 하루 알코올 40g 이하 (소주 약 4잔)
- 성인 여성 권장 음주량: 하루 알코올 20g 이하 (소주 약 2잔)
- 주 2일 이상 금주일 권장
- 순 알코올(g) = 음료량(ml) × 알코올도수(%) × 0.8 / 100`;

function buildContextMessage(weeklySummary: WeeklySummary, userContext?: UserContext): string {
  const { totalMl, drinkDays, mainDrink, logs } = weeklySummary;
  
  // 주종별 상세 분석
  const drinkBreakdown: Record<string, { ml: number; count: number }> = {};
  logs.forEach((log) => {
    if (!drinkBreakdown[log.drinkType]) {
      drinkBreakdown[log.drinkType] = { ml: 0, count: 0 };
    }
    drinkBreakdown[log.drinkType].ml += log.volumeMl;
    drinkBreakdown[log.drinkType].count += log.amount;
  });

  const breakdownText = Object.entries(drinkBreakdown)
    .map(([type, data]) => {
      const info = DRINK_INFO[type as DrinkType];
      const alcoholGrams = (data.ml * info.alcoholPercent * 0.8) / 100;
      return `- ${info.label}: ${data.ml}ml (${data.count}병), 순알코올 약 ${alcoholGrams.toFixed(0)}g`;
    })
    .join('\n');

  // 총 순알코올량 계산
  let totalAlcoholGrams = 0;
  logs.forEach((log) => {
    const info = DRINK_INFO[log.drinkType];
    totalAlcoholGrams += (log.volumeMl * info.alcoholPercent * 0.8) / 100;
  });

  let context = `[이번 주 사용자 음주 데이터]
- 총 음주량: ${totalMl}ml (${(totalMl / 1000).toFixed(1)}L)
- 총 순알코올: 약 ${totalAlcoholGrams.toFixed(0)}g
- 음주일: ${drinkDays}일 / 7일
- 주로 마신 술: ${mainDrink}

[주종별 상세]
${breakdownText || '- 기록 없음'}`;

  if (userContext) {
    const { weight, height, name } = userContext;
    if (weight || height) {
      context += `\n\n[사용자 신체 정보]`;
      if (name) context += `\n- 이름: ${name}`;
      if (weight) context += `\n- 체중: ${weight}kg`;
      if (height) context += `\n- 키: ${height}cm`;
      if (weight && height) {
        const bmi = weight / Math.pow(height / 100, 2);
        context += `\n- BMI: ${bmi.toFixed(1)}`;
      }
    }
  }

  return context;
}

export async function chat(
  userMessage: string,
  conversationHistory: ChatMessage[],
  weeklySummary: WeeklySummary,
  userContext?: UserContext
): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not configured');
    return '죄송합니다. AI 서비스가 현재 설정되지 않았습니다. 관리자에게 문의해주세요.';
  }

  const contextMessage = buildContextMessage(weeklySummary, userContext);

  // Gemini API 요청 형식으로 변환
  const contents = [
    // 시스템 프롬프트 + 컨텍스트를 첫 메시지로
    {
      role: 'user',
      parts: [{ text: `${SYSTEM_PROMPT}\n\n${contextMessage}\n\n위 정보를 바탕으로 사용자의 질문에 답변해주세요.` }],
    },
    {
      role: 'model',
      parts: [{ text: '네, 알겠습니다. 사용자의 음주 데이터를 바탕으로 친근하게 상담하겠습니다.' }],
    },
    // 기존 대화 히스토리
    ...conversationHistory,
    // 새 사용자 메시지
    {
      role: 'user',
      parts: [{ text: userMessage }],
    },
  ];

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', response.status, errorData);
      throw new Error(`API 오류: ${response.status}`);
    }

    const data = await response.json();
    
    // 응답 추출
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      console.error('Unexpected Gemini response format:', data);
      throw new Error('응답 형식 오류');
    }

    return text;
  } catch (error) {
    console.error('Gemini chat error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return '네트워크 연결을 확인해주세요. 인터넷에 연결되어 있지 않은 것 같습니다.';
    }
    
    return '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }
}

export const geminiService = {
  chat,
};
