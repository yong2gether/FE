import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Logo from "../../Images/Logo.svg";
import PublicInput from "../../Components/PublicInput";
import LargeButton from "../../Components/Button/LargeButton";
import MediumButton from "../../Components/Button/MediumButton";
import { useUserApi } from "../../hooks/useApi";
import {
  AuthPageContainer,
  AuthContentContainer,
  AuthTitleContainer,
  AuthInputContainer,
  AuthInputRow,
  AuthInputTitle,
  AuthInputCaption,
  AuthErrorMessage,
  AuthSuccessMessage,
  AuthLoadingText
} from "../../Styles/AuthStyles";
import { validateEmailInput, validatePasswordInput, validateNicknameInput } from "../../utils/authUtils";

const TitleLogoImage = styled.img`
  width: 40px;
`;

const IdInputRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  width: 100%;
`;

export default function SignUp(): React.JSX.Element {
  const navigate = useNavigate();
  const [idInput, setIdInput] = useState<string>("");
  const [pwInput, setPwInput] = useState<string>("");
  const [nickInput, setNickInput] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [emailCheckResult, setEmailCheckResult] = useState<string>("");
  
  const { signup, signupState, checkEmailDuplicate, emailCheckState } = useUserApi();

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
    
    // 닉네임 유효성 검사
    const nicknameError = validateNicknameInput(nickInput);
    if (nicknameError) {
      setValidationError(nicknameError);
      return false;
    }
    
    // 이메일 중복 확인 제거 - 선택사항으로 변경
    setValidationError("");
    return true;
  };

  const handleIdCheck = async (): Promise<void> => {
    const emailError = validateEmailInput(idInput);
    if (emailError) {
      setValidationError(emailError);
      return;
    }

    try {
      const result = await checkEmailDuplicate({ email: idInput.trim() });
      if (result.duplicated) {
        setEmailCheckResult("이미 사용 중인 이메일입니다");
      } else {
        setEmailCheckResult("사용 가능한 이메일입니다");
      }
      setValidationError("");
    } catch (error) {
      console.error("이메일 중복 확인 실패:", error);
      setEmailCheckResult("중복 확인에 실패했습니다");
    }
  };

  const handleSignUp = async (): Promise<void> => {
    if (!validateInputs()) return;
    
    try {
      await signup({
        email: idInput.trim(),
        password: pwInput,
        nickname: nickInput.trim(),
        gpsAllowed: true, // 기본값으로 설정
        photoUrl: undefined
      });
      
      navigate("/signup/complete");
    } catch (error) {
      console.error("회원가입 실패:", error);
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setValidationError(""); 
  };

  return (
    <AuthPageContainer>
      <AuthContentContainer>
        <AuthTitleContainer>
          <TitleLogoImage src={Logo} alt="Logo" />
          <div className="Title__H1">회원가입</div>
        </AuthTitleContainer>
        <AuthInputContainer>
          <AuthInputRow>
            <AuthInputTitle className="Body__XLarge" htmlFor="user-id">
              ID(이메일) <span>*</span>
            </AuthInputTitle>
            <IdInputRow>
              <PublicInput
                type="email"
                id="user-id"
                value={idInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleInputChange(setIdInput, e.target.value);
                }}
                placeholder="아이디를 입력해주세요"
              />
              <MediumButton 
                buttonText={emailCheckState.loading ? "확인 중..." : "중복확인"} 
                onClick={handleIdCheck}
              />
            </IdInputRow>
            {emailCheckResult && (
              emailCheckResult === "사용 가능한 이메일입니다" ? 
                <AuthSuccessMessage className="Body__Small">{emailCheckResult}</AuthSuccessMessage> :
                <AuthErrorMessage className="Body__Small">{emailCheckResult}</AuthErrorMessage>
            )}
        
          </AuthInputRow>
          <AuthInputRow>
            <AuthInputTitle className="Body__XLarge" htmlFor="user-pw">
              PW <span>*</span>
            </AuthInputTitle>
            <PublicInput
              type="password"
              id="user-pw"
              value={pwInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleInputChange(setPwInput, e.target.value);
              }}
              placeholder="비밀번호를 입력해주세요"
            />
            <AuthInputCaption className="Body__Small">
              * 최소 8자 이상 (영문, 숫자, 특수문자 포함)
            </AuthInputCaption>
          </AuthInputRow>
          <AuthInputRow>
            <AuthInputTitle className="Body__XLarge" htmlFor="user-nick">
              닉네임 <span>*</span>
            </AuthInputTitle>
            <PublicInput
              type="text"
              id="user-nick"
              value={nickInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleInputChange(setNickInput, e.target.value);
              }}
              placeholder="닉네임을 입력해주세요"
            />
          </AuthInputRow>
        </AuthInputContainer>
      </AuthContentContainer>
      
      {/* 에러 메시지 표시 */}
      {validationError && <AuthErrorMessage className="Body__Medium">{validationError}</AuthErrorMessage>}
      {signupState.error && <AuthErrorMessage className="Body__Medium">{signupState.error}</AuthErrorMessage>}
      
      {/* 로딩 상태 표시 */}
      {signupState.loading && <AuthLoadingText className="Body__Medium">회원가입 중...</AuthLoadingText>}
      
      <LargeButton 
        buttonText={signupState.loading ? "회원가입 중..." : "회원가입 완료"} 
        onClick={handleSignUp}
      />
    </AuthPageContainer>
  );
}
