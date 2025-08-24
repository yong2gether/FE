import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BottomSheet from "../../Components/BottomSheet";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import CustomEmojiPicker from "../../Components/EmojiPicker";
import CustomAlert from "../../Components/Modal/CustomAlert";
import { BiSolidPencil } from "react-icons/bi";
import PublicInput from "../../Components/PublicInput";
import LargeButton from "../../Components/Button/LargeButton";
import { useBookmark } from "../../hooks/useBookmark";

const PageContainer = styled.div`
  width: 100%;
  height: calc(100vh - 80px);
  position: relative;
  display: flex;
  overflow: hidden;
  user-select: none;
`;

const BottomSheetContainer = styled.div`
  width: 100%;
  min-height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-l);
  color: var(--neutral-1000);
`;

const ImageContainer = styled.div`
  width: 80px;
  height: 80px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
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

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--spacing-xs);
  color: var(--primary-blue-1000);
`;

export default function BookMarkAdd(): React.JSX.Element {
  const navigate = useNavigate();
  const { createFolder } = useBookmark();
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(true);
  const [folderInput, setFolderInput] = useState<string>("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("1f4c1");
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
  const [sheetRatio, setSheetRatio] = useState<number>(0);

  const handleProgressChange = useCallback((ratio: number) => {
    setSheetRatio(ratio);
  }, []);

  const showAlert = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setAlertConfig({ isOpen: true, title, message, type });
  };

  const handleEmojiEdit = (): void => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emoji: string, unified: string): void => {
    setSelectedEmoji(unified);
    setShowEmojiPicker(false);
  };

  const handleBookMarkAdd = async (): Promise<void> => {
    if (!folderInput.trim()) {
      showAlert("입력 필요", "폴더명을 입력해주세요.", "warning");
      return;
    }

    setIsCreating(true);
    try {
      // 폴더 생성
      const newFolder = createFolder({
        title: folderInput.trim(),
        unicode: selectedEmoji
      });

      console.log("새 폴더 생성됨:", newFolder);
      
      // 북마크 페이지로 이동
      navigate("/bookmark");
          } catch (error) {
        console.error("폴더 생성 실패:", error);
        showAlert("생성 실패", "폴더 생성에 실패했습니다.", "error");
      } finally {
        setIsCreating(false);
      }
  };

  return (
    <PageContainer>
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        snapPoints={[0.6]}
        initialSnapIndex={0}
        bottomOffsetPx={0}
        showOverlay={false}
        dismissible={false}
        onProgressChange={handleProgressChange}
      >
        <BottomSheetContainer>
          <div className="Title__H2">새 목록 추가</div>
          <ImageContainer>
            <Emoji unified={selectedEmoji} size={60} emojiStyle={EmojiStyle.NATIVE} />
            <ImageEditButton onClick={handleEmojiEdit}>
              <BiSolidPencil />
            </ImageEditButton>
                    {showEmojiPicker && (
          <CustomEmojiPicker
            isOpen={showEmojiPicker}
            onClose={() => setShowEmojiPicker(false)}
            onSelect={handleEmojiSelect}
            currentEmoji={selectedEmoji}
          />
        )}
          </ImageContainer>
          <TitleContainer>
            <label className="Body__Large" htmlFor="folder-name">
              폴더명
            </label>
            <PublicInput
              type="text"
              id="folder-name"
              value={folderInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFolderInput(e.target.value);
              }}
              placeholder="폴더명을 입력해주세요"
            />
          </TitleContainer>
          <LargeButton
            buttonText={isCreating ? "생성 중..." : "새 목록 추가하기"}
            onClick={handleBookMarkAdd}
            loading={isCreating}
          />
        </BottomSheetContainer>
      </BottomSheet>

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
