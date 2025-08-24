import React from "react";
import styled from "styled-components";
import { PiDotsThreeVertical } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { unifiedToEmoji } from "../../utils/emojiToMarker";

interface FolderBoxProps {
  id: string;
  unicode: string;
  title: string;
  placeCount: number;
  isMoreOpen: boolean;
  onMoreClick: (id: string) => void;
  onClick: () => void;
  onDelete: () => void;
}

const FolderContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const EmojiContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--spacing-m);
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--spacing-2xs);
  color: var(--neutral-700);
`;

const Title = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--neutral-900);
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  & > svg {
    min-width: 24px;
    min-height: 24px;
    cursor: pointer;
  }
`;

const MoreContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--neutral-200);
  z-index: 100;
`;

const MoreItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--neutral-100);
  color: var(--neutral-500);
  white-space: nowrap;
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background-color: var(--neutral-200);
    color: var(--neutral-1000);
  }

  &:active {
    background-color: var(--neutral-200);
    color: var(--neutral-1000);
  }
`;

export default function FolderBox({
  id,
  unicode,
  title,
  placeCount,
  isMoreOpen = false,
  onMoreClick,
  onClick,
  onDelete,
}: FolderBoxProps): React.JSX.Element {
  const navigate = useNavigate();

  const handleMoreClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (onMoreClick) {
      onMoreClick(id);
    }
  };

  const handleFolderEdit = (e: React.MouseEvent): void => {
    e.stopPropagation();
    navigate("/bookmark/edit", { state: { unicode, title } });
  };

  const handleFolderDelete = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <FolderContainer onClick={onClick}>
      <EmojiContainer>
        {unifiedToEmoji(unicode)}
        <InfoContainer>
          <Title className="Body__MediumLarge">{title}</Title>
          <div className="Body__Small">저장된 장소: {placeCount}개</div>
        </InfoContainer>
      </EmojiContainer>

      <IconContainer>
        <PiDotsThreeVertical onClick={handleMoreClick} />
        {isMoreOpen && (
          <MoreContainer>
            <MoreItem onClick={handleFolderEdit}>폴더 수정</MoreItem>
            <MoreItem onClick={handleFolderDelete}>폴더 삭제</MoreItem>
          </MoreContainer>
        )}
      </IconContainer>
    </FolderContainer>
  );
}