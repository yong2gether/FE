import React from "react";
import styled from "styled-components";
import { BsArrowRight } from "react-icons/bs";

interface SmallButtonProps {
  onClick: () => void;
}

const Button = styled.div`
  width: 56px;
  height: 56px;
  padding: 10px;
  background-color: var(--primary-blue-500);
  color: var(--neutral-100-2);
  border-radius: 28px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: var(--primary-blue-600);
  }

  &:active {
    background-color: var(--primary-blue-700);
  }
`;

export default function SmallButton({
  onClick,
}: SmallButtonProps): React.JSX.Element {
  return (
    <Button className="Title__H6" onClick={onClick}>
        <BsArrowRight size={28} />
    </Button>
  );
}
