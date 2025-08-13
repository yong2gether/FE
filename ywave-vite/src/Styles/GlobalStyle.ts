import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    scroll-behavior: smooth;
  }

  @font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
  }

  html {
    font-size: 16px;
    line-height: 1.4;
  }

  body {
    margin: 0;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    letter-spacing: -0.025em;
    line-height: 1.4;
    background-color: var(--background);
    color: var(--black);
    /* 접근성: 색상 대비 개선 */
    background-color: var(--neutral-100);
    color: var(--neutral-1000);
  }

  :root {
    /* Figma Color Variables */
    --primary-green-100: #e9f5d8;
    --primary-green-200: #d4eab0;
    --primary-green-300: #bee089;
    --primary-green-400: #aed86b;
    --primary-green-500: #9dd04e;
    --primary-green-600: #8cc534;
    --primary-green-700: #77a82c;
    --primary-green-800: #628a24;
    --primary-green-900: #4d6d1d;
    --primary-green-1000: #384f15;
    --primary-green-alpha-10: rgba(190, 224, 137, 0.1);
    --primary-green-alpha-20: rgba(190, 224, 137, 0.2);
    --primary-green-alpha-30: rgba(190, 224, 137, 0.3);
    --primary-green-alpha-40: rgba(190, 224, 137, 0.4);
    --primary-green-alpha-50: rgba(190, 224, 137, 0.5);
    --primary-blue-100: #abdaff;
    --primary-blue-200: #81c7ff;
    --primary-blue-300: #58b4ff;
    --primary-blue-400: #2ea2ff;
    --primary-blue-500: #048fff;
    --primary-blue-600: #0078d9;
    --primary-blue-700: #0061af;
    --primary-blue-800: #004c8a;
    --primary-blue-900: #003864;
    --primary-blue-1000: #00233f;
    --primary-blue-alpha-10: rgba(0, 97, 175, 0.1);
    --primary-blue-alpha-20: rgba(0, 97, 175, 0.2);
    --primary-blue-alpha-30: rgba(0, 97, 175, 0.3);
    --primary-blue-alpha-40: rgba(0, 97, 175, 0.4);
    --primary-blue-alpha-50: rgba(0, 97, 175, 0.5);
    --neutral-100: #ffffff;
    --neutral-200: #e5e5e5;
    --neutral-300: #cbcbcb;
    --neutral-400: #b1b1b1;
    --neutral-500: #979797;
    --neutral-600: #7c7c7c;
    --neutral-700: #626262;
    --neutral-800: #484848;
    --neutral-900: #2e2e2e;
    --neutral-1000: #141414;
    --neutral-alpha-10: rgba(20, 20, 20, 0.1);
    --neutral-alpha-20: rgba(20, 20, 20, 0.2);
    --neutral-alpha-30: rgba(20, 20, 20, 0.3);
    --neutral-alpha-40: rgba(20, 20, 20, 0.4);
    --neutral-alpha-50: rgba(20, 20, 20, 0.5);
    --neutral-alpha-45: rgba(13, 18, 22, 0.45);
    --success-100: #9eeecb;
    --success-200: #3ddc97;
    --success-300: #21b877;
    --success-400: #178254;
    --success-alpha-10: rgba(61, 219, 151, 0.102);
    --success-alpha-30: rgba(61, 219, 151, 0.302);
    --success-alpha-50: rgba(61, 220, 151, 0.5);
    --warning-100: #fff2ad;
    --warning-200: #ffe45c;
    --warning-300: #ffd70c;
    --warning-400: #ba9b00;
    --warning-alpha-10: rgba(255, 228, 92, 0.1);
    --warning-alpha-30: rgba(255, 228, 92, 0.3);
    --warning-alpha-50: rgba(255, 228, 92, 0.5);
    --error-100: #ffaeae;
    --error-200: #ff5c5c;
    --error-300: #ff0c0c;
    --error-400: #ba0000;
    --error-alpha-10: rgba(255, 92, 92, 0.1);
    --error-alpha-30: rgba(255, 92, 92, 0.3);
    --error-alpha-50: rgba(255, 92, 92, 0.5);
    --spacing-3xs: 2px;
    --spacing-2xs: 4px;
    --spacing-xs: 8px;
    --spacing-s: 12px;
    --spacing-m: 16px;
    --spacing-l: 20px;
    --spacing-xl: 24px;
    --spacing-2xl: 32px;
    --spacing-3xl: 40px;
    --spacing-4xl: 48px;
    --font-weight-bold: 700;
    --font-weight-semibold: 600;
    --font-weight-medium: 500;
    --font-weight-regular: 400;
    --font-weight-light: 300;
    --black : #111111;
    --white : #ffffff;
    --maincolor : #3C5E2D;
    --subcolor : #e7f5ff;
    --section : #F5F5F5;
    --subtext : #9d9d9d;
    --line : #e5e5ec;
    --midblue : #305ff8;
    --gray : #d9d9d9;
  }

  /* Display, Title, Body 스타일 */
  .Display__Large {
    font-size: 32px;
    font-family: Pretendard, sans-serif;
    font-weight: 600;
    line-height: 1.4;
  }
  .Display__Medium {
    font-size: 30px;
    font-family: Pretendard, sans-serif;
    font-weight: 600;
    line-height: 1.4;
  }
  .Display__Small {
    font-size: 28px;
    font-family: Pretendard, sans-serif;
    font-weight: 600;
    line-height: 1.4;
  }
  .Title__H1 {
    font-size: 24px;
    font-family: Pretendard, sans-serif;
    font-weight: 600;
    line-height: 1.4;
  }
  .Title__H2 {
    font-size: 22px;
    font-family: Pretendard, sans-serif;
    font-weight: 600;
    line-height: 1.4;
  }
  .Title__H3 {
    font-size: 20px;
    font-family: Pretendard, sans-serif;
    font-weight: 600;
    line-height: 1.4;
  }
  .Title__H4 {
    font-size: 18px;
    font-family: Pretendard, sans-serif;
    font-weight: 600;
    line-height: 1.4;
  }
  .Title__H5 {
    font-size: 16px;
    font-family: Pretendard, sans-serif;
    font-weight: 600;
    line-height: 1.4;
  }
  .Title__H6 {
    font-size: 14px;
    font-family: Pretendard, sans-serif;
    font-weight: 600;
    line-height: 1.4;
  }
  .Body__XLarge {
    font-size: 18px;
    font-family: Pretendard, sans-serif;
    font-weight: 400;
    line-height: 28px;
  }
  .Body__Large {
    font-size: 16px;
    font-family: Pretendard, sans-serif;
    font-weight: 400;
    line-height: 24px;
  }
  .Body__Default {
    font-size: 14px;
    font-family: Pretendard, sans-serif;
    font-weight: 400;
    line-height: 20px;
  }
  .Body__MediumDefault {
    font-size: 14px;
    font-family: Pretendard, sans-serif;
    font-weight: 500;
    line-height: 20px;
  }
  .Body__Small {
    font-size: 12px;
    font-family: Pretendard, sans-serif;
    font-weight: 400;
    line-height: 16px;
  }
  .Body__MediumSmall {
    font-size: 14px;
    font-family: Pretendard, sans-serif;
    font-weight: 500;
    line-height: 1.4;
  }
  .Body__ButtonDefault {
    font-size: 16px;
    font-family: Pretendard, sans-serif;
    font-weight: 600;
    line-height: 1.4;
  }

  /* 접근성 개선 스타일 */
  
  /* 포커스 스타일 */
  *:focus {
    outline: 2px solid var(--primary-green-500);
    outline-offset: 2px;
  }
  
  /* 버튼 포커스 스타일 */
  button:focus {
    outline: 2px solid var(--primary-green-500);
    outline-offset: 2px;
  }
  
  /* 링크 포커스 스타일 */
  a:focus {
    outline: 2px solid var(--primary-green-500);
    outline-offset: 2px;
  }
  
  /* 입력 필드 포커스 스타일 */
  input:focus, textarea:focus, select:focus {
    outline: 2px solid var(--primary-green-500);
    outline-offset: 2px;
    border-color: var(--primary-green-500);
  }
  
  /* 스크린 리더 전용 텍스트 */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  /* 고대비 모드 지원 */
  @media (prefers-contrast: high) {
    :root {
      --primary-green-500: #2d501f;
      --primary-blue-500: #003d7a;
      --neutral-1000: #000000;
      --neutral-100: #ffffff;
    }
  }
  
  /* 모션 감소 설정 지원 */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* 스크롤바 스타일링 */
  /* 웹킷 브라우저 (Chrome, Safari, Edge) */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--neutral-200);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--neutral-400);
    border-radius: 4px;
    transition: background 0.2s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--neutral-500);
  }

  ::-webkit-scrollbar-corner {
    background: var(--neutral-200);
  }

  /* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--neutral-400) var(--neutral-200);
  }

  /* 모바일에서는 스크롤바 숨김 */
  @media (max-width: 768px) {
    ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: var(--neutral-300);
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: var(--neutral-400);
    }
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
  
  button {
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    font: inherit;
    min-height: 44px; /* 터치 타겟 최소 크기 */
    min-width: 44px;
  }
  
  input, textarea {
    font-family: inherit;
    border: none;
    outline: none;
    min-height: 44px; /* 터치 타겟 최소 크기 */
    &::placeholder {
      color: var(--subtext);
    }
  }
  
  /* 이미지 접근성 */
  img {
    max-width: 100%;
    height: auto;
  }
  
  /* 테이블 접근성 */
  table {
    border-collapse: collapse;
    width: 100%;
  }
  
  th, td {
    padding: var(--spacing-s);
    text-align: left;
    border-bottom: 1px solid var(--neutral-200);
  }
  
  th {
    background-color: var(--neutral-100);
    font-weight: var(--font-weight-semibold);
  }
`;
