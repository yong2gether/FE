import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { BiArrowBack, BiSolidPencil } from "react-icons/bi";
import CustomEmojiPicker from "../../Components/EmojiPicker";
import CustomAlert from "../../Components/Modal/CustomAlert";
import PublicInput from "../../Components/PublicInput";
import LargeButton from "../../Components/Button/LargeButton";
import { useBookmarkApi } from "../../hooks/useApi";
import { unifiedToEmoji, emojiToUnified } from "../../utils/emojiToMarker";

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
  padding: 16px;
`;

const BackIcon = styled(BiArrowBack)`
  align-self: flex-start;
  color: var(--neutral-1000);
  width: 32px;
  height: 32px;
`;

const ImageContainer = styled.div`
  width: 80px;
  height: 80px;
  position: relative;
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
`;

const ButtonContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin-top: var(--spacing-3xl);
`;

export default function BookMarkEdit(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, unicode = "1f4c1", title = "폴더" } = location.state || {};
  const { updateBookmarkGroup } = useBookmarkApi();
  const [folderEmoji, setFolderEmoji] = useState<string>("");
  const [folderInput, setFolderInput] = useState<string>("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = (
    title: string,
    message: string,
    type: "info" | "success" | "warning" | "error" = "info"
  ) => {
    setAlertConfig({ isOpen: true, title, message, type });
  };

  useEffect(() => {
    setFolderEmoji(unifiedToEmoji(unicode));
    setFolderInput(title);
  }, [unicode, title]); // folderEmoji 제거

  const handleEmojiEdit = (): void => {
    setIsEmojiPickerOpen(true);
  };

  const handleEmojiSelect = (emoji: string, unified: string) => {
    setFolderEmoji(emoji); // emoji 문자를 저장 (unicode 코드가 아님)
    setIsEmojiPickerOpen(false);
  };

  const handleBookMarkEdit = async (): Promise<void> => {
    if (!folderInput.trim()) {
      showAlert("입력 필요", "폴더명을 입력해주세요.", "warning");
      return;
    }

    setIsUpdating(true);
    try {
      // API 호출 시에는 unicode 코드를 사용
      const iconUrl = emojiToUnified(folderEmoji);

      const result = await updateBookmarkGroup(id, {
        groupName: folderInput.trim(),
        iconUrl: iconUrl,
      });

      showAlert("수정 완료", "목록이 수정되었습니다.", "success");

      setTimeout(() => {
        navigate("/bookmark", { state: { refresh: true } });
      }, 1500);
    } catch (error) {
      console.error("북마크 그룹 수정 실패:", error);
      showAlert("수정 실패", "목록 수정에 실패했습니다.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <PageContainer>
      <ContentContainer>
        <BackIcon onClick={() => navigate("/bookmark")} />
        <div className="Title__H2">폴더 수정</div>

        <ImageContainer>
          <div style={{ fontSize: "60px" }}>{folderEmoji}</div>
          <ImageEditButton onClick={handleEmojiEdit}>
            <BiSolidPencil />
          </ImageEditButton>
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

        <ButtonContainer>
          <LargeButton
            buttonText="폴더 수정하기"
            onClick={handleBookMarkEdit}
            disabled={
              isUpdating || !folderInput.trim() || title === folderInput.trim()
            }
            loading={isUpdating}
          />
        </ButtonContainer>
      </ContentContainer>

      <CustomEmojiPicker
        isOpen={isEmojiPickerOpen}
        onClose={() => setIsEmojiPickerOpen(false)}
        onSelect={handleEmojiSelect}
        currentEmoji={folderEmoji}
      />

      <CustomAlert
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
        showConfirmButton={true}
        confirmText="확인"
      />
    </PageContainer>
  );
}
