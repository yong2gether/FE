import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

interface Option {
  index: number;
  value: string;
}

interface PublicDropdownProps {
  options: Option[];
  placeholder: string;
  value: Option | null;
  onChange: (option: Option) => void;
  disabled?: boolean;
}

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
  min-width: 200px;
`;

const DropdownHeader = styled.div<{ $isOpen: boolean; $isSelect: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 1px solid var(--neutral-200);
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--neutral-300);
  }
  
  ${props =>
    props.$isOpen &&
    css`
      border-color: var(--primary-blue-500);
      box-shadow: 0 0 0 3px var(--primary-blue-alpha-10);
    `}
  
  ${props =>
    props.$isSelect &&
    css`
      border-color: var(--primary-blue-500);
      background: var(--primary-blue-alpha-5);
    `}
`;

const DownIcon = styled(BiChevronDown)`
  width: 24px;
  height: 24px;
  color: var(--primary-blue-1000);
`;

const UpIcon = styled(BiChevronUp)`
  width: 24px;
  height: 24px;
  color: var(--primary-blue-1000);
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: var(--spacing-xs);
  background-color: var(--neutral-100);
  border: 1px solid var(--neutral-200);
  border-radius: 10px;
  z-index: 100;
  max-height: 220px;
  list-style: none;

  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: none;
`;

const DropdownItem = styled.li`
  padding: 8px 12px;
  cursor: pointer;

  &:hover {
    background-color: var(--primary-blue-alpha-10);
    color: var(--primary-blue-600);
  }

  &:active {
    background-color: var(--primary-blue-alpha-10);
    color: var(--primary-blue-700);
  }
`;

export default function PublicDropdown({
  options,
  placeholder,
  value,
  onChange,
  disabled = false,
}: PublicDropdownProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdown = (): void => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option: Option): void => {
    if (disabled) return;
    if (onChange) {
      onChange(option);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownHeader
        $isOpen={isOpen}
        $isSelect={!!value}
        onClick={handleDropdown}
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          backgroundColor: disabled ? 'var(--neutral-100)' : 'white',
        }}
      >
        <div>{value ? value.value : placeholder}</div>
        {isOpen ? <UpIcon /> : <DownIcon />}
      </DropdownHeader>
      {isOpen && !disabled && (
        <DropdownList>
          {options.map((option) => (
            <DropdownItem
              className="Body__Default"
              key={option.index}
              onClick={() => handleOptionClick(option)}
            >
              {option.value}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownContainer>
  );
}
