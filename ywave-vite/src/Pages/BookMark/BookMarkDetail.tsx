import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import BottomSheet from "../../Components/BottomSheet";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { placeDatas } from "../../Data/PlaceDatas";
import { useLocation, useNavigate } from "react-router-dom";
import LargePlaceBox from "../../Components/PlaceBox/LargePlaceBox";

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
  gap: var(--spacing-l);
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
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
  const [sheetRatio, setSheetRatio] = useState<number>(0);

  useEffect(() => {
    setEmoji(unicode);
    setTitle(folderTitle);
  }, []);

  const handleProgressChange = useCallback((ratio: number) => {
    setSheetRatio(ratio);
  }, []);

  return (
    <PageContainer>
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        snapPoints={[0.15, 0.6, 0.95]}
        initialSnapIndex={1}
        bottomOffsetPx={0}
        showOverlay={false}
        dismissible={false}
        onProgressChange={handleProgressChange}
      >
        <BottomSheetContainer>
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
        </BottomSheetContainer>
      </BottomSheet>
    </PageContainer>
  );
}
