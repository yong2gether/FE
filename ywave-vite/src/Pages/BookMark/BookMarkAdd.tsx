import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BottomSheet from "../../Components/BottomSheet";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { BiSolidPencil } from "react-icons/bi";
import PublicInput from "../../Components/PublicInput";
import LargeButton from "../../Components/Button/LargeButton";

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
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(true);
  const [folderInput, setFolderInput] = useState<string>("");
  const [sheetRatio, setSheetRatio] = useState<number>(0);

  const handleProgressChange = useCallback((ratio: number) => {
    setSheetRatio(ratio);
  }, []);

  const handleEmojiEdit = (): void => {
    alert("이모지 변경 기능 추가 예정");
  };

  const handleBookMarkAdd = (): void => {
    navigate("/bookmark");
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
            <Emoji unified="1f4c1" size={60} emojiStyle={EmojiStyle.NATIVE} />
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
          <LargeButton
            buttonText="새 목록 추가하기"
            onClick={handleBookMarkAdd}
          />
        </BottomSheetContainer>
      </BottomSheet>
    </PageContainer>
  );
}
