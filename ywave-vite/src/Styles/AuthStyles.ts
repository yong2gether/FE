import styled from "styled-components";

// 공통 컨테이너 스타일
export const AuthPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  min-height: 100vh;
  box-sizing: border-box;
  max-width: 400px;
  width: 100%;
  gap: 60px;
  color: var(--primary-blue-1000);
  user-select: none;
`;

export const AuthContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: var(--spacing-4xl);
  width: 100%;
`;

export const AuthTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: var(--spacing-xs);
  width: 100%;
`;

export const AuthInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 28px;
`;

export const AuthInputRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--spacing-xs);
  width: 100%;
`;

export const AuthInputTitle = styled.label`
  & > span {
    color: var(--error-300);
  }
`;

export const AuthInputCaption = styled.div`
  color: var(--neutral-500);
`;

export const AuthErrorMessage = styled.div`
  color: var(--error-300);
  font-size: 12px;
  text-align: center;
  margin-top: 4px;
`;

export const AuthSuccessMessage = styled.div`
  color: var(--success-300);
  font-size: 12px;
  text-align: center;
  margin-top: 4px;
`;

export const AuthLoadingText = styled.div`
  color: var(--neutral-500);
  font-size: 12px;
  text-align: center;
  margin-top: 4px;
`;

export const AuthButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xl);
  width: 100%;
`;

export const AuthSignUpContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-s);
`;

export const AuthSignUpLink = styled.a`
  color: var(--primary-blue-500);
  cursor: pointer;
`;
