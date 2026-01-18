# SULENDAR-TOSS - 술렌다 (Apps in Toss)

**Generated:** 2026-01-18 | **Branch:** master

음주 기록 캘린더 앱 | Granite (React Native) + Supabase + Gemini AI + 토스 로그인

## OVERVIEW

토스 앱 내 미니앱. 기존 Expo 프로젝트(`C:\workspace\sulendar`) 마이그레이션.
- Expo 지원 X → Granite 프레임워크 사용
- React Navigation → 파일 기반 라우팅 (`pages/`)
- Supabase Auth → 토스 로그인

## STRUCTURE

```
sulendar-toss/
├── _app.tsx              # AppsInToss.registerApp 진입점
├── granite.config.ts     # appName: 'sulendar', brand 설정
├── require.context.ts    # 페이지 컨텍스트
├── pages/                # 파일 기반 라우팅 → intoss://sulendar/*
├── components/ui/        # Text, Button, Card, Input
├── services/             # Supabase CRUD + Gemini AI
├── hooks/                # TanStack Query 래퍼
├── context/              # AuthContext (토스 로그인 상태)
├── theme/                # colors, spacing, typography
├── types/                # DrinkLog, User, Goal, DRINK_INFO
└── lib/                  # Supabase 클라이언트
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| 새 페이지 추가 | `pages/*.tsx` | `createRoute('/{path}')` 사용 |
| UI 컴포넌트 | `components/ui/` | Text, Button, Card, Input 재사용 |
| API 호출 | `services/*.ts` | Supabase 쿼리 |
| 데이터 페칭 | `hooks/use*.ts` | TanStack Query 훅 |
| 인증 로직 | `context/AuthContext.tsx` | 토스 로그인 연동 |
| 디자인 토큰 | `theme/colors.ts` | Primary: #10B981 (에메랄드) |
| 타입 정의 | `types/index.ts` | DrinkType, DRINK_INFO 상수 |
| AI 상담 | `services/gemini.ts` | Gemini 1.5 Flash API |

## CONVENTIONS

### 파일 기반 라우팅
```typescript
// pages/add-drink.tsx → intoss://sulendar/add-drink
export const Route = createRoute('/add-drink', { component: AddDrinkPage });
const navigation = Route.useNavigation();
navigation.navigate('/stats');
```

### 서비스 패턴 (Supabase)
```typescript
// snake_case ↔ camelCase 변환 함수 필수
function rowToLog(row: DrinkLogRow): DrinkLog { ... }
```

### TanStack Query 훅
```typescript
// hooks/useDrinkLogs.ts - staleTime: 5분, retry: 1
const { data, isLoading } = useDrinkLogsByMonth(year, month);
```

### 컬러 시스템
- Primary: `colors.primary.main` (#10B981)
- Background: `colors.background.primary` (#F0FDF4)
- 주종별: `colors.drinks.soju`, `.beer`, `.wine` 등

## ANTI-PATTERNS

| DO NOT | Reason |
|--------|--------|
| `auth.uid()` RLS 사용 | 토스 환경에서 불가 - RLS 비활성화됨 |
| Supabase Auth API 사용 | 토스 로그인 사용 - `@apps-in-toss/framework` |
| React Navigation 사용 | Granite 파일 기반 라우팅 사용 |
| user_id: UUID 타입 | TEXT로 변경됨 (토스 User ID) |

## TODO (Incomplete Features)

```typescript
// context/AuthContext.tsx - 토스 SDK 연동 미완성
// TODO: 실제 토스 SDK의 getUserInfo 사용
// TODO: 실제 토스 SDK의 login 사용
```

- [ ] `yarn install` 실행
- [ ] 토스 로그인 실제 연동 (`@apps-in-toss/framework` 주석 해제)
- [ ] TDS 컴포넌트 적용 (`@toss/tds-react-native`)
- [ ] 인앱 광고 연동 (AI 상담 리워드)
- [ ] 샌드박스 테스트

## DB SCHEMA

```sql
-- user_id: TEXT (토스 User ID) - UUID 아님!
users (id TEXT PK, name, weight, height, created_at, updated_at)
drink_logs (id UUID, user_id TEXT FK, date, drink_type, amount, volume_ml, memo)
goals (id UUID, user_id TEXT FK, type, target_value, start_date, end_date, is_active)
consultations (id UUID, user_id TEXT FK, question, response, ad_watched)
-- RLS 비활성화됨!
```

## URL SCHEME

| Route | URL | File |
|-------|-----|------|
| 홈/캘린더 | `intoss://sulendar` | `pages/index.tsx` |
| 기록 추가 | `intoss://sulendar/add-drink` | `pages/add-drink.tsx` |
| 통계 | `intoss://sulendar/stats` | `pages/stats.tsx` |
| 목표 | `intoss://sulendar/goals` | `pages/goals.tsx` |
| AI 상담 | `intoss://sulendar/consultation` | `pages/consultation.tsx` |
| 프로필 | `intoss://sulendar/profile` | `pages/profile.tsx` |

## DRINK_INFO

```typescript
// types/index.ts
DRINK_INFO = {
  soju: { label: '소주', icon: '🍶', unit: '병', mlPerUnit: 360, alcoholPercent: 17 },
  beer: { label: '맥주', icon: '🍺', unit: '병', mlPerUnit: 500, alcoholPercent: 5 },
  wine: { label: '와인', icon: '🍷', unit: '병', mlPerUnit: 750, alcoholPercent: 13 },
  whiskey: { label: '위스키', icon: '🥃', unit: '잔', mlPerUnit: 30, alcoholPercent: 40 },
  makgeolli: { label: '막걸리', icon: '🍵', unit: '병', mlPerUnit: 750, alcoholPercent: 6 },
  etc: { label: '기타', icon: '🍸', unit: '잔', mlPerUnit: 150, alcoholPercent: 15 },
}
```

## COMMANDS

```bash
yarn install     # 의존성 설치
yarn dev         # Granite 개발 서버 (Metro)
yarn build       # 빌드 → sulendar.ait
yarn lint        # Biome 린트
yarn lint:fix    # Biome 자동 수정
```

## TEST

```bash
# 샌드박스 앱 테스트
# 1. 샌드박스 앱 설치: https://developers-apps-in-toss.toss.im/development/test/sandbox
# 2. yarn dev
# 3. 샌드박스 앱에서 intoss://sulendar 입력

# Android 실기기
adb reverse tcp:8081 tcp:8081
adb reverse tcp:5173 tcp:5173
```

## RELATED

- **기존 Expo 버전**: `C:\workspace\sulendar`
- [Apps in Toss 개발자 센터](https://developers-apps-in-toss.toss.im/)
- [Granite React Native](https://developers-apps-in-toss.toss.im/tutorials/react-native.html)
- [React Native TDS](https://tossmini-docs.toss.im/tds-react-native/)
