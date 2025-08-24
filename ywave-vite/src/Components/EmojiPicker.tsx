import React, { useState } from "react";
import styled from "styled-components";
import { PiX } from "react-icons/pi";

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string, unified: string) => void;
  currentEmoji?: string;
}

// 기본 이모지 배열
const EMOJI_LIST = [
  { emoji: '📁', unified: '1f4c1' }, // 폴더
  { emoji: '😀', unified: '1f600' }, // 웃는 얼굴
  { emoji: '😍', unified: '1f60d' }, // 하트 눈
  { emoji: '🎉', unified: '1f389' }, // 파티
  { emoji: '⭐', unified: '2b50' },   // 별
  { emoji: '❤️', unified: '2764-fe0f' }, // 하트
  { emoji: '🔥', unified: '1f525' }, // 불
  { emoji: '💡', unified: '1f4a1' }, // 아이디어
  { emoji: '🎯', unified: '1f3af' }, // 타겟
  { emoji: '🚀', unified: '1f680' }, // 로켓
  { emoji: '🌈', unified: '1f308' }, // 무지개
  { emoji: '🍕', unified: '1f355' }, // 피자
  { emoji: '☕', unified: '2615' },   // 커피
  { emoji: '📱', unified: '1f4f1' }, // 스마트폰
  { emoji: '💻', unified: '1f4bb' }, // 노트북
  { emoji: '🎵', unified: '1f3b5' }, // 음악
  { emoji: '🏠', unified: '1f3e0' }, // 집
  { emoji: '🚗', unified: '1f697' }, // 자동차
  { emoji: '✈️', unified: '2708-fe0f' }, // 비행기
  { emoji: '🌙', unified: '1f319' }, // 달
  { emoji: '☀️', unified: '2600-fe0f' }, // 태양
  { emoji: '🌸', unified: '1f338' }, // 벚꽃
  { emoji: '🎨', unified: '1f3a8' }, // 팔레트
  { emoji: '📚', unified: '1f4da' }, // 책
  { emoji: '🎮', unified: '1f3ae' }, // 게임
  { emoji: '⚡', unified: '26a1' },   // 번개
  { emoji: '💎', unified: '1f48e' }, // 다이아몬드
  { emoji: '🎪', unified: '1f3aa' }, // 서커스
  { emoji: '🏆', unified: '1f3c6' }, // 트로피
  { emoji: '🎭', unified: '1f3ad' }, // 공연
  { emoji: '🎬', unified: '1f3ac' }, // 클래퍼보드
  { emoji: '📷', unified: '1f4f7' }, // 카메라
  { emoji: '🎤', unified: '1f3a4' }, // 마이크
  { emoji: '🎧', unified: '1f3a7' }, // 헤드폰
  { emoji: '🎸', unified: '1f3b8' }, // 기타
  { emoji: '🎹', unified: '1f3b9' }, // 피아노
  { emoji: '🎺', unified: '1f3ba' }, // 트럼펫
  { emoji: '🎻', unified: '1f3bb' }, // 바이올린
  { emoji: '🥁', unified: '1f941' }, // 드럼
  { emoji: '🎷', unified: '1f3b7' }, // 색소폰
];

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
    padding: 8px;
  }
  
  @media (max-width: 320px) {
    padding: 4px;
  }
`;

const PickerContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 90vw;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 12px;
    max-width: 95vw;
    max-height: 95vh;
  }
  
  @media (max-width: 320px) {
    padding: 16px;
    max-width: 98vw;
    max-height: 98vh;
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
  font-size: 20px;
  font-weight: 600;
  color: var(--neutral-1000);
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
  
  @media (max-width: 320px) {
    font-size: 16px;
  }
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
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
    width: 32px;
    height: 32px;
  }
  
  @media (max-width: 320px) {
    width: 28px;
    height: 28px;
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
    padding: 14px;
    margin-bottom: 16px;
  }
  
  @media (max-width: 320px) {
    padding: 12px;
    margin-bottom: 12px;
  }
`;

const CurrentEmojiLabel = styled.div`
  font-size: 16px;
  color: var(--neutral-700);
  margin-right: 12px;
  
  @media (max-width: 480px) {
    font-size: 14px;
    margin-right: 8px;
  }
  
  @media (max-width: 320px) {
    font-size: 13px;
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

const EmojiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 12px;
  padding: 20px;
  background: var(--neutral-100);
  border-radius: 12px;
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
  flex: 1;
  
  /* 스크롤바 스타일링 */
  scrollbar-width: thin;
  scrollbar-color: var(--neutral-300) var(--neutral-100);
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--neutral-100);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--neutral-300);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: var(--neutral-400);
  }
  
  @media (max-width: 480px) {
    gap: 10px;
    padding: 16px;
    margin-bottom: 16px;
    max-height: 350px;
  }
  
  @media (max-width: 320px) {
    gap: 8px;
    padding: 12px;
    margin-bottom: 12px;
    max-height: 300px;
  }
`;

const EmojiItem = styled.button<{ $isSelected?: boolean }>`
  width: 48px;
  height: 48px;
  border: none;
  background: ${props => props.$isSelected ? 'var(--primary-blue-100)' : 'white'};
  border-radius: 10px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${props => props.$isSelected ? 'var(--primary-blue-500)' : 'transparent'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${props => props.$isSelected ? 'var(--primary-blue-100)' : 'var(--neutral-200)'};
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
    font-size: 22px;
  }
  
  @media (max-width: 320px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  
  @media (max-width: 480px) {
    gap: 10px;
  }
  
  @media (max-width: 320px) {
    gap: 8px;
  }
`;

const Button = styled.button<{ $isPrimary?: boolean }>`
  flex: 1;
  padding: 14px 20px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
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
    padding: 12px 16px;
    font-size: 14px;
  }
  
  @media (max-width: 320px) {
    padding: 10px 14px;
    font-size: 13px;
  }
`;

export default function EmojiPicker({
  isOpen,
  onClose,
  onSelect,
  currentEmoji = '📁'
}: EmojiPickerProps): React.JSX.Element | null {
  const [selectedEmoji, setSelectedEmoji] = useState(currentEmoji);
  const [selectedUnified, setSelectedUnified] = useState('1f4c1');

  if (!isOpen) return null;

  const handleEmojiSelect = (emoji: string, unified: string) => {
    setSelectedEmoji(emoji);
    setSelectedUnified(unified);
  };

  const handleConfirm = () => {
    console.log('전달할 이모지 데이터:', { emoji: selectedEmoji, unified: selectedUnified });
    onSelect(selectedEmoji, selectedUnified);
    onClose();
  };

  const handleClose = () => {
    setSelectedEmoji(currentEmoji);
    setSelectedUnified('1f4c1');
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
        
        <EmojiGrid>
          {EMOJI_LIST.map((item, index) => (
            <EmojiItem
              key={index}
              $isSelected={selectedEmoji === item.emoji}
              onClick={() => handleEmojiSelect(item.emoji, item.unified)}
            >
              {item.emoji}
            </EmojiItem>
          ))}
        </EmojiGrid>
        
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
