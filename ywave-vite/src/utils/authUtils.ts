// 이메일 유효성 검사
export const validateEmail = (email: string): boolean => {
  return email.includes("@");
};

// 비밀번호 유효성 검사
export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

// 입력값 유효성 검사 (공통)
export const validateInput = (value: string, fieldName: string): string | null => {
  if (!value.trim()) {
    return `${fieldName}을(를) 입력해주세요`;
  }
  return null;
};

// 이메일 입력값 유효성 검사
export const validateEmailInput = (email: string): string | null => {
  const emptyError = validateInput(email, "이메일");
  if (emptyError) return emptyError;
  
  if (!validateEmail(email)) {
    return "올바른 이메일 형식을 입력해주세요";
  }
  
  return null;
};

// 비밀번호 입력값 유효성 검사
export const validatePasswordInput = (password: string): string | null => {
  const emptyError = validateInput(password, "비밀번호");
  if (emptyError) return emptyError;
  
  if (!validatePassword(password)) {
    return "비밀번호는 최소 8자 이상이어야 합니다";
  }
  
  return null;
};

// 닉네임 입력값 유효성 검사
export const validateNicknameInput = (nickname: string): string | null => {
  return validateInput(nickname, "닉네임");
};

// 토큰 관련 유틸리티 함수들
export const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const getUserId = (): number | null => {
  const userId = localStorage.getItem('userId');
  return userId ? parseInt(userId) : null;
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return token !== null && token !== '';
};
