import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BiArrowBack, BiSolidUserCircle, BiSolidPencil } from "react-icons/bi";
import PublicInput from "../../Components/PublicInput";
import MediumButton from "../../Components/Button/MediumButton";
import LargeButton from "../../Components/Button/LargeButton";
import CustomAlert from "../../Components/Modal/CustomAlert";
import { userApi } from "../../api/services";
import { UpdateProfileRequest } from "../../api/types";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100svh;
  box-sizing: border-box;
  margin-top: 44px;
  padding: 16px;
  width: 100%;
  gap: 64px;
  user-select: none;
`;

const BackIcon = styled(BiArrowBack)`
  color: var(--neutral-1000);
  align-self: flex-start;
  width: 32px;
  height: 32px;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  width: 80px;
  height: 80px;
  position: relative;

  & > svg {
    width: 100%;
    height: 100%;
    color: var(--neutral-200);
  }
`;

const ImageEditButton = styled.div`
  width: 24px;
  height: 24px;
  background-color: var(--neutral-alpha-50);
  border-radius: 100px;
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  & > svg {
    width: 60%;
    height: 60%;
    color: var(--neutral-200);
  }
`;

const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2xl);
`;

const InfoRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.div`
  flex: 1;
`;

const DataContainer = styled.div`
  flex: 3.5;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default function MypageProfile(): React.JSX.Element {
  const navigate = useNavigate();
  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [nick, setNick] = useState<string>("");
  const [isPwEdit, setIsPwEdit] = useState<boolean>(false);
  const [isNickEdit, setIsNickEdit] = useState<boolean>(false);
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    setId("nickname@gmail.com");
    setPw("abc123");
    setNick("닉네임");
  }, []);

  const showAlert = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setAlertConfig({ isOpen: true, title, message, type });
  };

  const handleImageEdit = () => {
    showAlert("기능 준비 중", "이미지 변경 기능 추가 예정", "info");
  };

  const handlePwEdit = () => {
    setIsPwEdit(true);
    setPw("");
  };

  const handleNickEdit = () => {
    setIsNickEdit(true);
    setNick("");
  };

  const handleSave = async () => {
    if (isPwEdit && pw === "") {
      showAlert("입력 필요", "비밀번호를 입력해주세요.", "warning");
      return;
    }

    if (isNickEdit && nick === "") {
      showAlert("입력 필요", "닉네임을 입력해주세요.", "warning");
      return;
    }

    try {
      const updateData: UpdateProfileRequest = {
        nickname: nick,
        password: pw
      };

      const response = await userApi.updateProfile(updateData);
      
      if (response.message && response.message.includes("성공")) {
        showAlert("성공", response.message, "success");
        setIsPwEdit(false);
        setIsNickEdit(false);
        
        if (response.nickname) {
          setNick(response.nickname);
        }
      } else {
        showAlert("실패", response.message || "프로필 변경에 실패했습니다.", "error");
      }
    } catch (error: any) {
      let errorMessage = "프로필 변경에 실패했습니다.";
      
      if (error.response?.status === 409) {
        errorMessage = "닉네임이 중복됩니다. 다른 닉네임을 사용해주세요.";
      } else if (error.response?.status === 400) {
        errorMessage = "잘못된 요청입니다. 입력값을 확인해주세요.";
      } else if (error.response?.status === 403) {
        errorMessage = "권한이 없습니다. 로그인을 확인해주세요.";
      } else if (error.response?.status === 404) {
        errorMessage = "사용자를 찾을 수 없습니다.";
      }
      
      showAlert("오류", errorMessage, "error");
    }
  };

  return (
    <PageContainer>
      <BackIcon onClick={() => navigate(-1)} />
      <ImageContainer>
        <BiSolidUserCircle />
        <ImageEditButton onClick={handleImageEdit}>
          <BiSolidPencil />
        </ImageEditButton>
      </ImageContainer>
      <InfoContainer>
        <InfoRow>
          <Label className="Title__H4">아이디</Label>
          <DataContainer className="Body__Large">{id}</DataContainer>
        </InfoRow>
        <InfoRow>
          <Label className="Title__H4">비밀번호</Label>
          {isPwEdit ? (
            <DataContainer>
              <PublicInput
                type="password"
                id="user-pw"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="새로운 비밀번호를 입력해주세요."
              />
            </DataContainer>
          ) : (
            <DataContainer className="Body__Large">
              {pw.replace(/./g, "ㆍ")}
              <MediumButton buttonText="변경" onClick={handlePwEdit} />
            </DataContainer>
          )}
        </InfoRow>
        <InfoRow>
          <Label className="Title__H4">닉네임</Label>
          {isNickEdit ? (
            <DataContainer>
              <PublicInput
                type="text"
                id="user-nick"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                placeholder="새로운 닉네임을 입력해주세요."
              />
            </DataContainer>
          ) : (
            <DataContainer className="Body__Large">
              {nick}
              <MediumButton buttonText="변경" onClick={handleNickEdit} />
            </DataContainer>
          )}
        </InfoRow>
      </InfoContainer>
      
      {(isPwEdit || isNickEdit) && (
        <LargeButton buttonText="저장하기" onClick={handleSave} />
      )}

      {/* 커스텀 알림 */}
      <CustomAlert
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </PageContainer>
  );
}
