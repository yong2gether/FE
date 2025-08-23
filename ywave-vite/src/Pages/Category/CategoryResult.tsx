import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import LargeButton from "../../Components/Button/LargeButton";

const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  min-height: 100vh;
  box-sizing: border-box;
  user-select: none;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  margin-top: 44px;
  gap: 60px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  gap: var(--spacing-3xl);
`;

const BackIcon = styled(BiArrowBack)`
  color: var(--neutral-1000);
  width: 32px;
  height: 32px;
`;

const Title = styled.h1`
  color: var(--neutral-1000);

  & > span {
    color: var(--primary-blue-500);
  }
`;

const ButtonContainer = styled.div`
  margin: var(--spacing-3xl) 0px var(--spacing-xl) 0px;
  width: 100%;
`;

export default function CategoryResult(): React.JSX.Element {
  const navigate = useNavigate();
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  useEffect(() => {
    // localStorage에서 선택된 지역과 업종 정보 가져오기
    const regions = JSON.parse(localStorage.getItem('selectedRegions') || '[]');
    const industries = JSON.parse(localStorage.getItem('selectedIndustries') || '[]');
    
    setSelectedRegions(regions.map((region: any) => region.value));
    setSelectedIndustries(industries);
  }, []);

  const handleStart = () => {
    // 카테고리 설정 완료 플래그 설정
    localStorage.setItem('hasCompletedCategories', 'true');
    
    // 선택된 정보들을 정리 (필요시 서버에 저장)
    // localStorage.removeItem('selectedRegions');
    // localStorage.removeItem('selectedIndustries');
    
    // 메인 페이지로 이동
    navigate("/main");
  };

  const handleBack = () => {
    // CategoryIndustry로 돌아가기
    navigate("/category/industry");
  };

  return (
    <PageContainer>
      <ContentContainer>
        <BackIcon onClick={handleBack} />
        <TitleContainer>
          <Title className="Title__H1">
            주로 <br />
            {selectedRegions.map((region, index) => (
              <span key={index}>
                #{region}
                <br />
              </span>
            ))}
            지역에 위치한
          </Title>
          <Title className="Title__H1">
            {selectedIndustries.map((industry, index) => (
              <span key={index}>
                #{industry}
                <br />
              </span>
            ))}
            가맹점을 방문하시네요!
          </Title>
          <Title className="Title__H1">그럼 Y:Wave를 시작해볼까요?</Title>
        </TitleContainer>
      </ContentContainer>
      <ButtonContainer>
        <LargeButton buttonText="시작하기" onClick={handleStart} />
      </ButtonContainer>
    </PageContainer>
  );
}
