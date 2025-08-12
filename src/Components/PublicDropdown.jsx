import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
  min-width: 200px;
`;

const DropdownHeader = styled.div`
  width: 100%;
  min-width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--neutral-200);
  border-radius: 10px;
  color: var(--neutral-500);
  cursor: pointer;
  padding: 8px 12px;

  &:hover {
    border-color: var(--neutral-500);
  }

  &:active {
    border-color: var(--neutral-500);
  }

  ${(props) =>
    !props.isOpen &&
    props.isSelect &&
    `
      border-color: var(--primary-blue-1000);
      color: var(--primary-blue-1000);
    `}

  @media (max-width: 768px) {
    font-size: 12px;
    height: 42px;
    min-width: 180px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    height: 40px;
    min-width: 160px;
  }
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

export default function PublicDropdown({ options, placeholder, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const handleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option) => {
    if (onChange) {
      onChange(option);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
        className="Body__Default"
        onClick={handleDropdown}
        isOpen={isOpen}
        isSelect={!!value}
      >
        <div>{value ? value.value : placeholder}</div>
        {isOpen ? <UpIcon /> : <DownIcon />}
      </DropdownHeader>
      {isOpen && (
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