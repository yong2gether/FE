import React, { useState } from "react";
import styled from "styled-components";
import { PiX } from "react-icons/pi";
import EmojiPickerReact from "emoji-picker-react";
import { unifiedToEmoji } from "../utils/emojiToMarker";

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string, unified: string) => void;
  currentEmoji?: string;
}

const PickerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  
  @media (max-width: 480px) {
    padding: 12px;
  }
  
  @media (max-width: 320px) {
    padding: 8px;
  }
`;

const PickerContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 90vw;
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  
  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 12px;
    max-height: 85vh;
  }
  
  @media (max-width: 320px) {
    padding: 16px;
    max-height: 90vh;
  }
`;

const PickerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-shrink: 0;
  
  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
  
  @media (max-width: 320px) {
    margin-bottom: 12px;
  }
`;

const PickerTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: var(--neutral-1000);
  
  @media (max-width: 480px) {
    font-size: 16px;
  }
  
  @media (max-width: 320px) {
    font-size: 15px;
  }
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--neutral-100);
  border: 1px solid var(--neutral-200);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--neutral-200);
  }
  
  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
  }
  
  @media (max-width: 320px) {
    width: 24px;
    height: 24px;
  }
`;

const CurrentEmojiContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  padding: 16px;
  background: var(--neutral-100);
  border-radius: 12px;
  flex-shrink: 0;
  
  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 16px;
  }
  
  @media (max-width: 320px) {
    padding: 10px;
    margin-bottom: 12px;
  }
`;

const CurrentEmojiLabel = styled.div`
  font-size: 14px;
  color: var(--neutral-600);
  margin-right: 12px;
  
  @media (max-width: 480px) {
    font-size: 13px;
    margin-right: 8px;
  }
  
  @media (max-width: 320px) {
    font-size: 12px;
    margin-right: 6px;
  }
`;

const CurrentEmoji = styled.div`
  font-size: 32px;
  
  @media (max-width: 480px) {
    font-size: 28px;
  }
  
  @media (max-width: 320px) {
    font-size: 24px;
  }
`;

const EmojiPickerWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  margin-bottom: 20px;
  
  /* emoji-picker-react 스타일 오버라이드 */
  .EmojiPickerReact {
    border: none !important;
    box-shadow: none !important;
    background: transparent !important;
  }
  
  .EmojiPickerReact .epr-body {
    background: transparent !important;
  }
  
  .EmojiPickerReact .epr-search-container {
    background: transparent !important;
  }
  
  .EmojiPickerReact .epr-search-container input {
    background: var(--neutral-100) !important;
    border: 1px solid var(--neutral-200) !important;
    border-radius: 8px !important;
    color: var(--neutral-1000) !important;
  }
  
  .EmojiPickerReact .epr-search-container input:focus {
    border-color: var(--primary-blue-500) !important;
    outline: none !important;
  }
  
  .EmojiPickerReact .epr-category-nav {
    background: var(--neutral-100) !important;
    border-radius: 8px !important;
  }
  
  .EmojiPickerReact .epr-emoji-category-label {
    color: var(--neutral-700) !important;
    font-weight: 600 !important;
  }
  
  .EmojiPickerReact .epr-emoji {
    border-radius: 6px !important;
    transition: all 0.2s ease !important;
  }
  
  .EmojiPickerReact .epr-emoji:hover {
    background: var(--primary-blue-100) !important;
    transform: scale(1.1) !important;
  }
  
  .EmojiPickerReact .epr-emoji.epr-emoji-selected {
    background: var(--primary-blue-200) !important;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 16px;
    
    .EmojiPickerReact .epr-search-container input {
      font-size: 13px !important;
      padding: 8px 12px !important;
    }
    
    .EmojiPickerReact .epr-emoji {
      font-size: 20px !important;
    }
  }
  
  @media (max-width: 320px) {
    margin-bottom: 12px;
    
    .EmojiPickerReact .epr-search-container input {
      font-size: 12px !important;
      padding: 6px 10px !important;
    }
    
    .EmojiPickerReact .epr-emoji {
      font-size: 18px !important;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  
  @media (max-width: 480px) {
    gap: 8px;
  }
  
  @media (max-width: 320px) {
    gap: 6px;
  }
`;

const Button = styled.button<{ $isPrimary?: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ $isPrimary }) => $isPrimary ? `
    background: var(--primary-blue-500);
    color: white;
    
    &:hover {
      background: var(--primary-blue-600);
      transform: translateY(-1px);
    }
  ` : `
    background: var(--neutral-100);
    color: var(--neutral-700);
    border: 1px solid var(--neutral-200);
    
    &:hover {
      background: var(--neutral-200);
    }
  `}
  
  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 13px;
    border-radius: 6px;
  }
  
  @media (max-width: 320px) {
    padding: 8px 12px;
    font-size: 12px;
    border-radius: 6px;
  }
`;

export default function EmojiPicker({
  isOpen,
  onClose,
  onSelect,
  currentEmoji = '📁'
}: EmojiPickerProps): React.JSX.Element | null {
  const [selectedEmoji, setSelectedEmoji] = useState(currentEmoji);

  if (!isOpen) return null;

  const handleEmojiSelect = (emojiObject: any) => {
    setSelectedEmoji(emojiObject.emoji);
  };

  const handleConfirm = () => {
    // emoji-picker-react는 unified 코드를 직접 제공하지 않으므로
    // 현재 선택된 이모지를 기반으로 처리
    const unified = '1f4c1'; // 기본값 (폴더 이모지)
    onSelect(selectedEmoji, unified);
    onClose();
  };

  const handleClose = () => {
    setSelectedEmoji(currentEmoji);
    onClose();
  };

  return (
    <PickerOverlay>
      <PickerContent>
        <PickerHeader>
          <PickerTitle>이모지 선택</PickerTitle>
          <CloseButton onClick={handleClose}>
            <PiX />
          </CloseButton>
        </PickerHeader>
        
        <CurrentEmojiContainer>
          <CurrentEmojiLabel>현재 선택된 이모지:</CurrentEmojiLabel>
          <CurrentEmoji>{selectedEmoji}</CurrentEmoji>
        </CurrentEmojiContainer>
        
        <EmojiPickerWrapper>
          <EmojiPickerReact
            onEmojiClick={handleEmojiSelect}
            searchPlaceholder="이모지 검색..."
            width="100%"
            height="300px"
            lazyLoadEmojis={true}
            searchDisabled={false}
            skinTonesDisabled={true}

          />
        </EmojiPickerWrapper>
        
        <ButtonContainer>
          <Button onClick={handleClose}>
            취소
          </Button>
          <Button $isPrimary onClick={handleConfirm}>
            선택
          </Button>
        </ButtonContainer>
      </PickerContent>
    </PickerOverlay>
  );
}
