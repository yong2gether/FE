import React from "react";
import styled from "styled-components";

interface LargeButtonProps {
  buttonText: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const Button = styled.button<{ disabled?: boolean }>`
  width: 100%;
  min-width: 200px;
  min-height: auto;
  background-color: ${props => props.disabled ? 'var(--neutral-300)' : 'var(--primary-blue-500)'};
  border: none;
  border-radius: 10px;
  color: var(--neutral-100);
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  padding: 12px 0px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: ${props => props.disabled ? 0.6 : 1};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.disabled ? 'var(--neutral-300)' : 'var(--primary-blue-600)'};
  }

  &:active {
    background-color: ${props => props.disabled ? 'var(--neutral-300)' : 'var(--primary-blue-700)'};
  }

  @media (max-width: 768px) {
    font-size: 16px;
    height: 47px;
    min-width: 180px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    height: 45px;
    min-width: 160px;
  }
`;

export default function LargeButton({
  buttonText,
  onClick,
  loading = false,
  disabled = false,
}: LargeButtonProps): React.JSX.Element {
  const isDisabled = disabled || loading;
  
  return (
    <Button className="Title__H4" onClick={onClick} disabled={isDisabled}>
      {loading ? "로딩중..." : buttonText}
    </Button>
  );
}
