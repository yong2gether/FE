import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { industries } from "../../Data/Industries";
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
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: var(--spacing-3xl);
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  margin-top: 44px;
  gap: 60px;
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

const IndustryContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: var(--spacing-m);
  flex-wrap: wrap;
`;

const IndustryItem = styled.button<{ $isSelect: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid var(--neutral-600);
  border-radius: 10px;
  color: var(--neutral-600);
  gap: var(--spacing-xs);
  white-space: nowrap;
  
  &:hover {
    border-color: var(--primary-blue-500);
    color: var(--primary-blue-500);
  }
  
  &:active {
    border-color: var(--primary-blue-600);
    color: var(--primary-blue-600);
  }

  ${(props) =>
    props.$isSelect &&
    `
     border-color: var(--primary-blue-600);
     color: var(--primary-blue-600);
    `}
`;

const ButtonContainer = styled.div`
  margin: var(--spacing-3xl) 0px var(--spacing-xl) 0px;
  width: 100%;
`;

export default function CategoryIndustry(): React.JSX.Element {
  const navigate = useNavigate();
  const [selectIndustries, setSelectIndustries] = useState<string[]>([]);

  const handleIndustryClick = (clickId: string): void => {
    if (selectIndustries.includes(clickId)) {
      setSelectIndustries(selectIndustries.filter((id) => id !== clickId));
    } else {
      setSelectIndustries((prev) => [...prev, clickId]);
    }
  };

  const handleNext = () => {
    // 업종 선택이 완료되면 CategoryResult로 이동
    if (selectIndustries.length > 0) {
      // 선택된 업종 정보를 localStorage에 저장
      localStorage.setItem('selectedIndustries', JSON.stringify(selectIndustries));
      navigate("/category/result");
    }
  };

  const handleBack = () => {
    // CategoryRegion으로 돌아가기
    navigate("/category/region");
  };

  return (
    <PageContainer>
      <ContentContainer>
        <TitleContainer>
          <BackIcon onClick={handleBack} />
          <Title className="Title__H1">
            주로 <span>어떤 업종</span>의 <br />
            지역 화폐 가맹점을 <br />
            방문하시나요?
          </Title>
        </TitleContainer>
        <IndustryContainer>
          {industries.map((industry) => (
            <IndustryItem
              key={industry.id}
              $isSelect={selectIndustries.includes(industry.id)}
              onClick={() => handleIndustryClick(industry.id)}
            >
              {industry.icon({size: 16})}
              <div className="Body__MediumSmall">{industry.name}</div>
            </IndustryItem>
          ))}
        </IndustryContainer>
      </ContentContainer>
      <ButtonContainer>
        <LargeButton
          buttonText="다음"
          onClick={handleNext}
        />
      </ButtonContainer>
    </PageContainer>
  );
}
