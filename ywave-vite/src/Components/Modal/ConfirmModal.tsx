import React from "react";
import styled from "styled-components";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalOverlay = styled.div`
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
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin: 16px;
  max-width: 320px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: var(--neutral-1000);
  margin-bottom: 16px;
`;

const ModalMessage = styled.div`
  font-size: 14px;
  color: var(--neutral-700);
  margin-bottom: 24px;
  line-height: 1.5;
  white-space: pre-line;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const ModalButton = styled.button<{ $isPrimary?: boolean }>`
  flex: 1;
  padding: 14px 20px;
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
`;

export default function ConfirmModal({
  isOpen,
  title,
  message,

  onConfirm,
  onCancel
}: ConfirmModalProps): React.JSX.Element | null {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>{title}</ModalTitle>
        <ModalMessage>{message}</ModalMessage>
        <ModalButtonContainer>
          <ModalButton onClick={onCancel}>
            취소
          </ModalButton>
          <ModalButton $isPrimary onClick={onConfirm}>
            확인
          </ModalButton>
        </ModalButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
}
