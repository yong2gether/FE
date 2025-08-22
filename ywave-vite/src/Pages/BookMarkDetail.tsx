import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BottomSheet from "../Components/BottomSheet";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { placeDatas } from "../Data/PlaceDatas";
import LargePlaceBox from "../Components/LargePlaceBox";
import { useLocation, useNavigate } from "react-router-dom";

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
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-s);
  color: var(--neutral-1000);
`;

const FolderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-m);
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--neutral-200);
`;

export default function BookMarkDetail(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { unicode, title: folderTitle } = location.state;
  const [isSheetOpen, setIsSheetOpen] = useState(true);
  const [emoji, setEmoji] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    setEmoji(unicode);
    setTitle(folderTitle);
  }, []);

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
        snapPoints={[0.7, 0.9]}
        initialSnapIndex={0}
      >
        <SheetContainer>
          <TitleContainer>
            <Emoji unified={emoji} size={24} emojiStyle={EmojiStyle.NATIVE} />
            <div className="Title__H2">{title}</div>
          </TitleContainer>
          <FolderContainer>
            {placeDatas.map((place) => (
              <>
                <Divider />
                <LargePlaceBox
                  {...place}
                  onClick={() => navigate("/bookmark")}
                />
              </>
            ))}
          </FolderContainer>
        </SheetContainer>
      </BottomSheet>
    </PageContainer>
  );
}
