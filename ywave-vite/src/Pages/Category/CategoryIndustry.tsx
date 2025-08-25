import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { industries } from "../../Data/Industries";
import LargeButton from "../../Components/Button/LargeButton";
import { usePreferenceApi } from "../../hooks/useApi";
import CustomAlert from "../../Components/Modal/CustomAlert";

const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  const { setPreferredCategories } = usePreferenceApi();
  const [selectIndustries, setSelectIndustries] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showAlert = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setAlertConfig({ isOpen: true, title, message, type });
  };

  const handleIndustryClick = (industryId: number): void => {
    if (selectIndustries.includes(industryId)) {
      setSelectIndustries(selectIndustries.filter((id) => id !== industryId));
    } else {
      setSelectIndustries((prev) => [...prev, industryId]);
    }
  };

  const handleNext = async () => {
    if (selectIndustries.length > 0) {
      setIsSubmitting(true);
      try {
        console.log('전송할 데이터:', { categoryIds: selectIndustries });
        console.log('현재 토큰:', localStorage.getItem('accessToken'));
        await setPreferredCategories({
          categoryIds: selectIndustries
        });


        localStorage.setItem('hasCompletedCategories', 'true');
        
        showAlert("설정 완료", "업종 선호도가 설정되었습니다.", "success");
        
        setTimeout(() => {
          navigate("/category/result");
        }, 1500);
      } catch (error) {
        console.error('업종 선호도 설정 실패:', error);
        showAlert("설정 실패", "업종 선호도 설정에 실패했습니다.", "error");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      showAlert("선택 필요", "최소 하나의 업종을 선택해주세요.", "warning");
    }
  };

  const handleBack = () => {
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
          buttonText={isSubmitting ? "설정 중..." : "다음"}
          onClick={handleNext}
          loading={isSubmitting}
        />
      </ButtonContainer>

      <CustomAlert
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </PageContainer>
  );
}
