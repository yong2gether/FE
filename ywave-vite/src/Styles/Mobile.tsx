import React from "react";
import styled from "styled-components";

interface MobileProps {
  children: React.ReactNode;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  min-height: 100vh;
`;

const Content = styled.div<{ isWideLayout: boolean }>`
  width: 100%;
  max-width: ${(props) => props.isWideLayout ? "1200px" : "430px"};
  min-width: 320px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: var(--neutral-100);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden;

  @media (min-width: 768px) {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    margin: 20px auto;
    min-height: calc(100vh - 40px);
  }

  scroll-behavior: smooth;
`;

const Header = styled.div`
  display: flex;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  flex-shrink: 0;
  background: var(--neutral-100);
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: auto;
  margin-right: 16px;
`;

const Contents = styled.main`
  display: flex;
  padding: 32px 16px;
  flex-direction: column;   
  flex: 1 1 0%;
  min-height: 0;
  width: 100%;
  overflow-y: auto;
  padding-bottom: 32px;
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
  const isWideLayout = ["/setting"].includes(window.location.pathname);

  return (
    <Container>
      <SkipLink href="#main-content">
        메인 콘텐츠로 건너뛰기
      </SkipLink>
      <Content isWideLayout={isWideLayout}>
        <Header>
          <Menu>
          </Menu>
        </Header>
        <Contents 
          id="main-content" 
          tabIndex={-1}
          role="main"
          aria-label="메인 콘텐츠"
        >
          {children}
        </Contents>
      </Content>
    </Container>
  );
}
