import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TitleLogo from "../Images/TitleLogo3.svg";
import BackgroundImage from "../Images/Landing.svg";

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  background-image: url(${BackgroundImage});
  background-size: cover;
  color: var(--neutral-100);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: var(--spacing-l);
  padding: 150px 16px 0px;
  user-select: none;
`;

const TitleLogoImage = styled.img`
  width: 254px;
`;

export default function Landing(): React.JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <PageContainer>
      <div className="Body__XLarge">
        경기도민을 위한, <br /> 지역화폐 가맹점 추천 서비스
      </div>
      <TitleLogoImage src={TitleLogo} alt="Title Logo" />
    </PageContainer>
  );
}
