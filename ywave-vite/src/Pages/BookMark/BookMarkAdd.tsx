import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BiSolidPencil } from "react-icons/bi";
import CustomEmojiPicker from "../../Components/EmojiPicker";
import CustomAlert from "../../Components/Modal/CustomAlert";
import PublicInput from "../../Components/PublicInput";
import LargeButton from "../../Components/Button/LargeButton";
import { useBookmarkApi } from "../../hooks/useApi";
import { emojiToUnified } from "../../utils/emojiToMarker";

const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  overflow: hidden;
  user-select: none;
  background: var(--neutral-100);
`;

const ContentContainer = styled.div`
  width: 100%;
  min-height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-l);
  color: var(--neutral-1000);
  padding: 20px;
`;

const Header = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-l);
  flex-shrink: 0;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: var(--neutral-700);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  font-weight: 500;

  &:hover {
    background: var(--neutral-200);
  }
`;

const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: var(--neutral-1000);
  margin: 0;
`;

const ImageContainer = styled.div`
  width: 80px;
  height: 80px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-m);
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
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--neutral-alpha-30);
  }

  & > svg {
    width: 60%;
    height: 60%;
    color: var(--neutral-200);
  }
`;

const TitleContainer = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--spacing-xs);
  color: var(--primary-blue-1000);
  margin-bottom: var(--spacing-l);
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 500;
  color: var(--neutral-1000);
  margin-bottom: var(--spacing-xs);
`;

const ButtonContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin-top: var(--spacing-m);
`;

export default function BookMarkAdd(): React.JSX.Element {
  const navigate = useNavigate();
  const { createBookmarkGroup } = useBookmarkApi();
  const [folderInput, setFolderInput] = useState<string>("");
  const [selectedEmoji, setSelectedEmoji] = useState<string>("📁");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
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

  const showAlert = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setAlertConfig({ isOpen: true, title, message, type });
  };

  const handleEmojiEdit = (): void => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emoji: string, unified: string): void => {
    setSelectedEmoji(emoji);
    setShowEmojiPicker(false);
  };

  const handleBookMarkAdd = async (): Promise<void> => {
    if (!folderInput.trim()) {
      showAlert("입력 필요", "폴더명을 입력해주세요.", "warning");
      return;
    }

    setIsCreating(true);
    try {
      // API 호출 시에는 unicode 코드를 사용
      const iconUrl = emojiToUnified(selectedEmoji);
      
      const result = await createBookmarkGroup({
        groupName: folderInput.trim(),
        iconUrl: iconUrl
      });

      showAlert("생성 완료", "새 목록이 생성되었습니다.", "success");
      
      setTimeout(() => {
        navigate("/bookmark", { state: { refresh: true } });
      }, 1500);
    } catch (error) {
      console.error("북마크 그룹 생성 실패:", error);
      showAlert("생성 실패", "목록 생성에 실패했습니다.", "error");
    } finally {
      setIsCreating(false);
    }
  };



  return (
    <PageContainer>
      <ContentContainer>
        <Header>
          <BackButton onClick={() => navigate("/bookmark")}>
            ← 뒤로
          </BackButton>
          <PageTitle>새 목록 추가</PageTitle>
          <div style={{ width: 40 }}></div>
        </Header>

        <ImageContainer>
          <div style={{ fontSize: '60px' }}>
            {selectedEmoji}
          </div>
          <ImageEditButton onClick={handleEmojiEdit}>
            <BiSolidPencil />
          </ImageEditButton>
        </ImageContainer>

        <TitleContainer>
          <Label htmlFor="folder-name">폴더명</Label>
          <PublicInput
            type="text"
            id="folder-name"
            placeholder="폴더명을 입력해주세요"
            value={folderInput}
            onChange={(e) => setFolderInput(e.target.value)}
          />
        </TitleContainer>

        <ButtonContainer>
          <LargeButton
            buttonText={isCreating ? "생성 중..." : "새 목록 추가하기"}
            onClick={handleBookMarkAdd}
            disabled={isCreating || !folderInput.trim()}
            loading={isCreating}
          />
        </ButtonContainer>
      </ContentContainer>

      <CustomEmojiPicker
        isOpen={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onSelect={handleEmojiSelect}
        currentEmoji={selectedEmoji}
      />

      <CustomAlert
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        showConfirmButton={true}
        confirmText="확인"
      />
    </PageContainer>
  );
}
