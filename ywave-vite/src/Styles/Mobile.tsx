import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import Navigation from "../Components/Navigation";

interface MobileProps {
  children: React.ReactNode;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

const Content = styled.div<{ isWideLayout: boolean }>`
  width: 100%;
  max-width: ${(props) => props.isWideLayout ? "1200px" : "375px"};
  min-width: 320px;
  height: auto;
  min-height: 100vh;
  max-height: 100vh;
  margin: 0 auto;
  background-color: var(--neutral-100);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  border-radius: 20px;

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (min-width: 768px) {
    margin: 0 auto;
    height: auto;
    min-height: calc(100vh - 40px);
    max-height: calc(100vh - 40px);
  }

  scroll-behavior: smooth;
`;

const Contents = styled.main`
  display: flex;
  padding: 16px;
  flex-direction: column;   
  flex: 1 1 auto;
  width: 100%;
  overflow: visible;
  outline: none;
`;

const SkipLink = styled.a`
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-green-500);
  color: var(--neutral-100);
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 10000;
  
  &:focus {
    top: 6px;
  }
`;

export default function Mobile({ children }: MobileProps): React.JSX.Element {
  const location = useLocation();
  const currentPath = location.pathname;
  const isWideLayout = ["/setting"].includes(currentPath);
  const noNavigationPath = ["/login", "/signup", "/category"];
  const showNavigation = !(currentPath === "/" || noNavigationPath.some(prefix => currentPath.startsWith(prefix)));

  return (
    <Container>
      <SkipLink href="#main-content">
        메인 콘텐츠로 건너뛰기
      </SkipLink>
      <Content isWideLayout={isWideLayout}>
        <Contents 
          id="main-content" 
          tabIndex={-1}
          role="main"
          aria-label="메인 콘텐츠"
        >
          {children}
        </Contents>
        {showNavigation && <Navigation />}
      </Content>
    </Container>
  );
}
