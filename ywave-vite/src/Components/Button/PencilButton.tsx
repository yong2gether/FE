import React from "react";
import styled from "styled-components";
import { BiSolidPencil } from "react-icons/bi";

interface PencilButtonProps {
  buttonText: string;
  onClick: () => void;
  isFill?: boolean;
  isIcon?: boolean;
}

const Button = styled.button<{ isFill: boolean }>`
  ${({ isFill }) => (isFill ? "width: 100%" : "min-width: auto")};
  min-height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2xs);
  padding: 8px 12px;
  background-color: var(--primary-blue-500);
  border: none;
  border-radius: 10px;
  color: var(--neutral-100);
  text-align: center;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background-color: var(--primary-blue-600);
  }

  &:active {
    background-color: var(--primary-blue-700);
  }
`;

export default function PencilButton({
  buttonText,
  onClick,
  isFill = false,
  isIcon = true,
}: PencilButtonProps): React.JSX.Element {
  return (
    <Button onClick={onClick} isFill={isFill}>
      {isIcon && <BiSolidPencil />}
      <div className="Body__MediumDefault">{buttonText}</div>
    </Button>
  );
}
