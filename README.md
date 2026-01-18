# 술렌다 (Sulendar) - Apps in Toss 버전

음주 기록 캘린더 앱 - 토스 앱 내 미니앱

## 시작하기

### 1. 의존성 설치

```bash
cd sulendar-toss
yarn install
```

### 2. 개발 서버 실행

```bash
yarn dev
```

### 3. 샌드박스 앱에서 테스트

1. 샌드박스 앱 설치 (https://developers-apps-in-toss.toss.im/development/test/sandbox)
2. 샌드박스 앱 실행
3. 스킴 입력: `intoss://sulendar`
4. "스키마 열기" 버튼 클릭

### 4. 빌드

```bash
yarn build
```

`sulendar.ait` 파일이 생성됩니다.

## 프로젝트 구조

```
sulendar-toss/
├── pages/                    # 파일 기반 라우팅
│   ├── index.tsx            # 홈 (캘린더)
│   ├── add-drink.tsx        # 음주 기록 추가
│   ├── stats.tsx            # 통계
│   ├── goals.tsx            # 목표 설정
│   ├── consultation.tsx     # AI 상담
│   └── profile.tsx          # 프로필
├── components/ui/           # UI 컴포넌트
├── services/                # API 서비스
├── hooks/                   # React Query 훅
├── context/                 # AuthContext (토스 로그인)
├── theme/                   # 디자인 시스템
├── types/                   # TypeScript 타입
├── lib/                     # Supabase 클라이언트
├── _app.tsx                 # 앱 진입점
├── granite.config.ts        # Granite 설정
└── .env                     # 환경변수
```

## URL 스킴

| 페이지 | 스킴 |
|--------|------|
| 홈 | `intoss://sulendar` |
| 음주 기록 추가 | `intoss://sulendar/add-drink` |
| 통계 | `intoss://sulendar/stats` |
| 목표 | `intoss://sulendar/goals` |
| AI 상담 | `intoss://sulendar/consultation` |
| 프로필 | `intoss://sulendar/profile` |

## 환경변수

`.env` 파일:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

## 기술 스택

- **Framework**: Granite (Apps in Toss)
- **UI**: React Native + TDS (Toss Design System)
- **Backend**: Supabase
- **State Management**: TanStack Query
- **AI**: Google Gemini

## Supabase 테이블

```sql
-- users: 사용자 프로필 (토스 User ID 기반)
-- drink_logs: 음주 기록
-- goals: 목표 설정
-- consultations: AI 상담 기록
```

## 참고 문서

- [Apps in Toss 개발자 센터](https://developers-apps-in-toss.toss.im/)
- [Granite 프레임워크](https://granite-js.github.io/granite/)
- [React Native TDS](https://tossmini-docs.toss.im/tds-react-native/)
