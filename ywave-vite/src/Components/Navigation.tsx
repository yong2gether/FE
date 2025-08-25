import React from "react";
import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { BiHomeAlt, BiMap, BiBookmark, BiUser } from "react-icons/bi";

const NavigationContainer = styled.nav`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--neutral-200);
  background-color: var(--neutral-100);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;

  z-index: 2000;

`;

const NavigationItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
  padding: 8px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props =>
    props.$isActive &&
    css`
      color: var(--primary-blue-500);
      
      svg {
        color: var(--primary-blue-500);
      }
    `}
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & > svg {
    min-width: 24px;
    min-height: 24px;
  }
`;

export default function Navigation(): React.JSX.Element {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const isActive = (path: string) => {
    return currentPath.startsWith(path);
  };

  return (
    <NavigationContainer id="app-navigation">
      <NavigationItem
        $isActive={isActive("/main")}
        onClick={() => navigate("/main")}
      >
        <IconWrapper>
          <BiHomeAlt />
        </IconWrapper>
        <div className="Body__MediumSmall">홈</div>
      </NavigationItem>
      <NavigationItem
        $isActive={isActive("/map")}
        onClick={() => navigate("/map")}
      >
        <IconWrapper>
          <BiMap />
        </IconWrapper>
        <div className="Body__MediumSmall">지도</div>
      </NavigationItem>
      <NavigationItem
        $isActive={isActive("/bookmark")}
        onClick={() => navigate("/bookmark")}
      >
        <IconWrapper>
          <BiBookmark />
        </IconWrapper>
        <div className="Body__MediumSmall">즐겨찾기</div>
      </NavigationItem>
      <NavigationItem
        $isActive={isActive("/mypage")}
        onClick={() => navigate("/mypage")}
      >
        <IconWrapper>
          <BiUser />
        </IconWrapper>
        <div className="Body__MediumSmall">마이페이지</div>
      </NavigationItem>
    </NavigationContainer>
  );
}
