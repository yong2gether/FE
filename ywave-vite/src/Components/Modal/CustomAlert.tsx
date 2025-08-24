import React from "react";
import styled from "styled-components";
import { PiX } from "react-icons/pi";

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
  
  @media (max-width: 320px) {
    padding: 4px;
  }
`;

const AlertContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 90vw;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 12px;
    max-width: 95vw;
    width: calc(100vw - 24px);
  }
  
  @media (max-width: 320px) {
    padding: 12px;
    max-width: 98vw;
    width: calc(100vw - 16px);
  }
`;

const AlertHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  
  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
  
  @media (max-width: 320px) {
    margin-bottom: 8px;
  }
`;

const AlertTitle = styled.div<{ $type: string }>`
  font-size: 18px;
  font-weight: 600;
  color: ${({ $type }) => {
    switch ($type) {
      case 'success': return 'var(--success-600)';
      case 'warning': return 'var(--warning-600)';
      case 'error': return 'var(--error-600)';
      default: return 'var(--neutral-1000)';
    }
  }};
  
  @media (max-width: 480px) {
    font-size: 15px;
    line-height: 1.3;
  }
  
  @media (max-width: 320px) {
    font-size: 14px;
    line-height: 1.2;
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
`;

const AlertMessage = styled.div`
  font-size: 14px;
  color: var(--neutral-700);
  line-height: 1.5;
  margin-bottom: 24px;
  white-space: pre-line;
  
  @media (max-width: 480px) {
    font-size: 12px;
    line-height: 1.4;
    margin-bottom: 16px;
  }
  
  @media (max-width: 320px) {
    font-size: 11px;
    line-height: 1.3;
    margin-bottom: 12px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 480px) {
    gap: 6px;
  }
  
  @media (max-width: 320px) {
    gap: 4px;
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
    padding: 8px 12px;
    font-size: 12px;
    border-radius: 6px;
    min-height: 36px;
  }
  
  @media (max-width: 320px) {
    padding: 6px 10px;
    font-size: 11px;
    min-height: 32px;
  }
`;

const IconContainer = styled.div<{ $type: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 24px;
  
  background-color: ${({ $type }) => {
    switch ($type) {
      case 'success': return 'var(--success-100)';
      case 'warning': return 'var(--warning-100)';
      case 'error': return 'var(--error-100)';
      default: return 'var(--primary-blue-100)';
    }
  }};
  
  color: ${({ $type }) => {
    switch ($type) {
      case 'success': return 'var(--success-600)';
      case 'warning': return 'var(--warning-600)';
      case 'error': return 'var(--error-600)';
      default: return 'var(--primary-blue-600)';
    }
  }};
  
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  @media (max-width: 320px) {
    width: 32px;
    height: 32px;
    font-size: 16px;
    margin-bottom: 8px;
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

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✗';
      default: return 'ℹ';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <AlertOverlay>
      <AlertContent>
        <AlertHeader>
          <AlertTitle $type={type}>{title}</AlertTitle>
          <CloseButton onClick={onClose}>
            <PiX />
          </CloseButton>
        </AlertHeader>
        
        <IconContainer $type={type}>
          {getIcon()}
        </IconContainer>
        
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
