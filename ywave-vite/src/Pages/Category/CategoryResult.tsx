import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import LargeButton from "../../Components/Button/LargeButton";
import { usePreferenceApi } from "../../hooks/useApi";
import { convertCategoryCodes } from "../../utils/categoryMapping";

const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  box-sizing: border-box;
  user-select: none;
  min-height: 100vh;
  padding-bottom: 100px;
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
  const { getPreferredRegion, getPreferredCategories } = usePreferenceApi();
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const regionData = await getPreferredRegion();
        if (regionData) {
          const regionString = `${regionData.sido} ${regionData.sigungu}${regionData.dong ? ` ${regionData.dong}` : ''}`;
          setSelectedRegions([regionString]);
        }

        const categoriesData = await getPreferredCategories();
        if (categoriesData && categoriesData.length > 0) {
          const koreanCategories = convertCategoryCodes(categoriesData);
          setSelectedIndustries(koreanCategories);
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error);
        setSelectedRegions([]);
        setSelectedIndustries([]);
      }
    };

    fetchData();
  }, [getPreferredRegion, getPreferredCategories]);

  const handleStart = () => {
    localStorage.setItem("hasCompletedCategories", "true");
    navigate("/main");
  };

  const handleBack = () => {
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
