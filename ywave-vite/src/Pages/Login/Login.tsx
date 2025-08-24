import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PublicInput from "../../Components/PublicInput";
import LargeButton from "../../Components/Button/LargeButton";
import TitleLogo from "../../Images/TitleLogo.svg";
import { useUserApi } from "../../hooks/useApi";
import {
  AuthPageContainer,
  AuthInputContainer,
  AuthInputRow,
  AuthErrorMessage,
  AuthLoadingText,
  AuthButtonContainer,
  AuthSignUpContainer,
  AuthSignUpLink
} from "../../Styles/AuthStyles";
import { validateEmailInput, validatePasswordInput } from "../../utils/authUtils";

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-l);
`;

const TitleLogoImage = styled.img`
  width: 189px;
`;

const Title = styled.div`
  text-align: center;
`;

export default function Login(): React.JSX.Element {
  const navigate = useNavigate();
  const [idInput, setIdInput] = useState<string>("");
  const [pwInput, setPwInput] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  
  const { login, loginState } = useUserApi();

  const validateInputs = (): boolean => {
    // 이메일 유효성 검사
    const emailError = validateEmailInput(idInput);
    if (emailError) {
      setValidationError(emailError);
      return false;
    }
    
    // 비밀번호 유효성 검사
    const passwordError = validatePasswordInput(pwInput);
    if (passwordError) {
      setValidationError(passwordError);
      return false;
    }
    
    setValidationError("");
    return true;
  };

  const handleLogin = async (): Promise<void> => {
    if (!validateInputs()) return;
    
    try {
      await login({
        email: idInput.trim(),
        password: pwInput
      });
      
      // 로그인 성공 후 카테고리 설정 완료 여부 확인
      let hasCompletedCategories = localStorage.getItem('hasCompletedCategories');
      
      // hasCompletedCategories가 설정되지 않은 경우 false로 초기화
      if (hasCompletedCategories === null) {
        hasCompletedCategories = 'false';
        localStorage.setItem('hasCompletedCategories', 'false');
      }
      
      if (hasCompletedCategories === 'true') {
        // 카테고리 설정을 이미 완료한 경우 메인 페이지로 이동
        navigate("/main");
      } else {
        // 첫 로그인인 경우 카테고리 설정 페이지로 이동
        navigate("/category/region");
      }
    } catch (error) {
      // 에러는 useUserApi에서 처리됨
      console.error("로그인 실패:", error);
    }
  };



  return (
    <AuthPageContainer>
      <TitleContainer>
        <TitleLogoImage src={TitleLogo} alt="Title Logo" />
        <Title className="Body__XLarge">
          서비스 이용을 위해 <br />
          로그인을 진행해주세요
        </Title>
      </TitleContainer>
      <AuthInputContainer>
        <AuthInputRow>
          <label className="Body__XLarge" htmlFor="user-id">
            ID
          </label>
          <PublicInput
            type="email"
            id="user-id"
            value={idInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setIdInput(e.target.value);
              setValidationError(""); // 입력 시 에러 메시지 제거
            }}
            placeholder="아이디를 입력해주세요"
          />
        </AuthInputRow>
        <AuthInputRow>
          <label className="Body__XLarge" htmlFor="user-pw">
            PW
          </label>
          <PublicInput
            type="password"
            id="user-pw"
            value={pwInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPwInput(e.target.value);
              setValidationError(""); // 입력 시 에러 메시지 제거
            }}
            placeholder="비밀번호를 입력해주세요"
          />
        </AuthInputRow>
      </AuthInputContainer>
      
      {/* 에러 메시지 표시 */}
      {validationError && <AuthErrorMessage className="Body__Medium">{validationError}</AuthErrorMessage>}
      {loginState.error && <AuthErrorMessage className="Body__Medium">{loginState.error}</AuthErrorMessage>}
      
      {/* 로딩 상태 표시 */}
      {loginState.loading && <AuthLoadingText className="Body__Medium">로그인 중...</AuthLoadingText>}
      
      <AuthButtonContainer>
        <LargeButton 
          buttonText={loginState.loading ? "로그인 중..." : "로그인"} 
          onClick={handleLogin}
        />
        <AuthSignUpContainer>
          <div className="Body__Large">아직 가입하지 않으셨나요?</div>
          <AuthSignUpLink
            className="Title__H5"
            onClick={() => {
              navigate("/signup");
            }}
          >
            회원가입하기
          </AuthSignUpLink>
        </AuthSignUpContainer>
      </AuthButtonContainer>
    </AuthPageContainer>
  );
}
