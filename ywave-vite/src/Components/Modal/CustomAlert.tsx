import React from "react";
import styled from "styled-components";

interface CustomAlertProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose: () => void;
  onConfirm?: () => void;
  showConfirmButton?: boolean;
  confirmText?: string;
  cancelText?: string;
}

const AlertOverlay = styled.div`
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
`;

const AlertContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin: 16px;
  max-width: 320px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 12px;
    max-width: 95vw;
    width: calc(100vw - 24px);
  }
`;

const AlertTitle = styled.div<{ $type: string }>`
  font-size: 18px;
  font-weight: 600;
  color: var(--neutral-1000);
  margin-bottom: 16px;
  
  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: 12px;
  }
`;

const AlertMessage = styled.div`
  font-size: 14px;
  color: var(--neutral-700);
  margin-bottom: 24px;
  line-height: 1.5;
  white-space: pre-line;
  
  @media (max-width: 480px) {
    font-size: 13px;
    margin-bottom: 20px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const Button = styled.button<{ $isPrimary?: boolean }>`
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
  
  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 13px;
  }
`;

export default function CustomAlert({
  isOpen,
  title,
  message,
  type = 'info',
  onClose,
  onConfirm,
  showConfirmButton = false,
  confirmText = '확인',
  cancelText = '취소'
}: CustomAlertProps): React.JSX.Element | null {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <AlertOverlay>
      <AlertContent>
        <AlertTitle $type={type}>{title}</AlertTitle>
        
        <AlertMessage>{message}</AlertMessage>
        
        <ButtonContainer>
          {showConfirmButton ? (
            <>
              <Button onClick={onClose}>
                {cancelText}
              </Button>
              <Button $isPrimary onClick={handleConfirm}>
                {confirmText}
              </Button>
            </>
          ) : (
            <Button $isPrimary onClick={onClose}>
              확인
            </Button>
          )}
        </ButtonContainer>
      </AlertContent>
    </AlertOverlay>
  );
}
