import React, { useState, useCallback } from "react";
import styled from "styled-components";
import BottomSheet from "../../Components/BottomSheet";
import { useNavigate } from "react-router-dom";
import FolderBox from "../../Components/FolderBox";
import PencilButton from "../../Components/Button/PencilButton";

const PageContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  height: calc(100vh - 80px);
  overflow: hidden;
`;

const BottomSheetContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  min-height: 100%;
  position: relative;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--neutral-1000);
  flex-shrink: 0;
`;

const FolderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-m);
`;

const Divider = styled.div`
  width: calc(100% + 32px);
  height: 1px;
  background-color: var(--neutral-200);
`;

export default function BookMark(): React.JSX.Element {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(true);
  const [openMoreId, setOpenMoreId] = useState<string | null>(null);
  const [sheetRatio, setSheetRatio] = useState<number>(0);

  const folderDatas = [
    {
      id: "1",
      unicode: "1f4c1",
      title: "내 폴더",
    },
    {
      id: "2",
      unicode: "1f354",
      title: "야식 파티",
    },
    {
      id: "3",
      unicode: "1f30a",
      title: "부산 맛집",
    },
    {
      id: "4",
      unicode: "1f3e0",
      title: "숙소",
    },
    {
      id: "5",
      unicode: "1f4c1",
      title: "추가 폴더 1",
    },
    {
      id: "6",
      unicode: "1f354",
      title: "추가 폴더 2",
    },
    {
      id: "7",
      unicode: "1f30a",
      title: "추가 폴더 3",
    },
    {
      id: "8",
      unicode: "1f3e0",
      title: "추가 폴더 4",
    },
  ];

  const handleMoreClick = (id: string): void => {
    setOpenMoreId((prev) => (prev === id ? null : id));
  };

  const handleFolderClick = (unicode: string, title: string): void => {
    navigate("/bookmark/detail", { state: { unicode, title } });
  };

  const handleProgressChange = useCallback((ratio: number) => {
    setSheetRatio(ratio);
  }, []);

  return (
    <PageContainer>
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        snapPoints={[0.15, 0.7, 0.95]}
        initialSnapIndex={0}
        bottomOffsetPx={0}
        showOverlay={false}
        dismissible={false}
        onProgressChange={handleProgressChange}
      >
        <BottomSheetContainer>
          <TitleContainer>
            <div className="Title__H2">즐겨찾기</div>
            <PencilButton
              buttonText="새 목록 추가하기"
              onClick={() => navigate("/bookmark/add")}
            />
          </TitleContainer>
          
          {folderDatas.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <FolderBox
                id={folder.id}
                unicode={folder.unicode}
                title={folder.title}
                placeCount={6}
                isMoreOpen={openMoreId === folder.id}
                onMoreClick={() => handleMoreClick(folder.id)}
                onClick={() =>
                  handleFolderClick(folder.unicode, folder.title)
                }
              />
              {index < folderDatas.length - 1 && (
                <div style={{height: 1, background: "var(--neutral-200)", width: "100%"}} />
              )}
            </React.Fragment>
          ))}
        </BottomSheetContainer>
      </BottomSheet>
    </PageContainer>
  );
}
