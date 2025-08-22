import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BottomSheet from "../Components/BottomSheet";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { BiSolidPencil } from "react-icons/bi";
import PublicInput from "../Components/PublicInput";
import LargeButton from "../Components/LargeButton";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
`;

const Title = styled.h1`
  color: var(--primary-green-600);
  margin-bottom: 30px;
  text-align: center;
  font-size: var(--title-h1);
  font-weight: var(--font-weight-semibold);
`;

const Content = styled.div`
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const SheetContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

  const handleEmojiEdit = (): void => {
    alert("이모지 변경 기능 추가 예정");
  };

  const handleBookMarkAdd = (): void => {
    navigate("/bookmark");
  };

  return (
    <PageContainer>
      <Content>
        <Title>즐겨찾기</Title>
        <p className="Body__Default" style={{ color: "var(--neutral-600)" }}>
          즐겨찾기 페이지입니다.
        </p>
        <button onClick={() => setIsSheetOpen(true)}>시트 열기</button>
      </Content>

      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        snapPoints={[0.7]}
      >
        <SheetContainer>
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
        </SheetContainer>
      </BottomSheet>
    </PageContainer>
  );
}
