# Y-Wave

Y-Wave는 지역 기반 서비스 추천 플랫폼입니다.

## 🚀 기술 스택

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Styled Components
- **Routing**: React Router DOM
- **Icons**: React Icons
- **Animation**: Framer Motion

## 📦 설치 및 실행

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 9.0.0 이상

### 설치
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 🏗️ 프로젝트 구조

```
src/
├── Components/          # 재사용 가능한 컴포넌트
│   ├── PublicButton.tsx
│   ├── PublicInput.tsx
│   └── PublicDropdown.tsx
├── Pages/              # 페이지 컴포넌트
│   ├── Setting.tsx
│   ├── Login.tsx
│   ├── SignUp.tsx
│   ├── Main.tsx
│   ├── Map.tsx
│   ├── Mypage.tsx
│   ├── BookMark.tsx
│   ├── SignUpComplete.tsx
│   ├── CategoryRegion.tsx
│   ├── CategoryIndustry.tsx
│   └── CategoryResult.tsx
├── Styles/             # 전역 스타일 및 레이아웃
│   ├── GlobalStyle.ts
│   └── Mobile.tsx
├── Data/               # 정적 데이터
│   └── Categories.ts
├── Images/             # 이미지 에셋
│   ├── Logo.svg
│   └── TitleLogo.svg
├── App.tsx             # 메인 앱 컴포넌트
├── Router.tsx          # 라우팅 설정
└── main.tsx            # 앱 진입점
```

## 🎨 디자인 시스템

### 색상 변수
- **Primary Green**: `#9dd04e` (메인 브랜드 컬러)
- **Primary Blue**: `#048fff` (보조 브랜드 컬러)
- **Neutral**: `#ffffff` ~ `#141414` (그레이스케일)

### 타이포그래피
- **Font Family**: Pretendard
- **Display**: 28px ~ 32px (H1-H6)
- **Body**: 12px ~ 18px

### 스페이싱
- **XS**: 8px, **S**: 12px, **M**: 16px
- **L**: 20px, **XL**: 24px, **2XL**: 32px

## 🔧 개발 가이드

### 컴포넌트 작성 규칙
1. TypeScript 인터페이스 정의 필수
2. Styled Components 사용
3. 접근성 고려 (ARIA 라벨, 키보드 네비게이션)

### 스타일링 가이드
1. CSS 변수 활용
2. 반응형 디자인 적용
3. 접근성 개선 (고대비, 모션 감소 등)

## 📱 주요 기능

- **사용자 인증**: 로그인/회원가입
- **카테고리 설정**: 지역 및 업종 선호도 설정
- **지도 서비스**: 위치 기반 서비스 추천
- **즐겨찾기**: 관심 서비스 저장
- **마이페이지**: 사용자 정보 관리

## 🌟 마이그레이션 완료

✅ CRA → Vite + React + TypeScript  
✅ JavaScript → TypeScript  
✅ 빠른 개발 서버 및 HMR  
✅ 타입 안정성 확보  
✅ 최적화된 번들링  
