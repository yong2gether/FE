import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { categories } from "../Data/Categories";
import PublicButton from "../Components/PublicButton";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  box-sizing: border-box;
  width: 100%;
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
  margin-top: 28px;
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  gap: var(--spacing-m);
`;

const IndustryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--spacing-m);
`;

const IndustryItem = styled.button<{ isSelect: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border: 1px solid var(--neutral-600);
  border-radius: 10px;
  color: var(--neutral-600);
  gap: var(--spacing-xs);

  &:hover {
    border-color: var(--primary-blue-500);
    color: var(--primary-blue-500);
  }

  &:active {
    border-color: var(--primary-blue-600);
    color: var(--primary-blue-600);
  }

  ${(props) =>
    props.isSelect &&
    `
     border-color: var(--primary-blue-600);
     color: var(--primary-blue-600);
    `}
`;

const ButtonContainer = styled.div`
  margin-bottom: var(--spacing-xs);
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

  return (
    <PageContainer>
      <ContentContainer>
        <TitleContainer>
          <BackIcon onClick={() => navigate("/category/region")} />
          <Title className="Title__H1">
            주로 <span>어떤 업종</span>의 <br />
            지역 화폐 가맹점을 <br />
            방문하시나요?
          </Title>
        </TitleContainer>
        <IndustryContainer>
          {Array.from({ length: Math.ceil(categories.length / 3) }).map(
            (_, rowIndex) => (
              <IndustryRow key={rowIndex}>
                {categories
                  .slice(rowIndex * 3, rowIndex * 3 + 3)
                  .map((category) => (
                    <IndustryItem
                      key={category.id}
                      onClick={() => handleIndustryClick(category.id)}
                      isSelect={selectIndustries.includes(category.id)}
                    >
                      {category.icon()}
                      <div>{category.name}</div>
                    </IndustryItem>
                  ))}
              </IndustryRow>
            )
          )}
        </IndustryContainer>
      </ContentContainer>
      <ButtonContainer>
        <PublicButton
          buttonText="다음"
          onClick={() => navigate("/category/result")}
        />
      </ButtonContainer>
    </PageContainer>
  );
}
