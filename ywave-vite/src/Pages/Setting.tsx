import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ReviewWriteModal from "../Components/Review/ReviewWriteModal";
import CustomAlert from "../Components/Modal/CustomAlert";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
`;

const Title = styled.h1`
  color: var(--primary-green-600);
  margin-bottom: 30px;
  text-align: center;
  font-size: var(--title-h1);
  font-weight: var(--font-weight-semibold);

  @media (max-width: 768px) {
    font-size: var(--title-h2);
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    font-size: var(--title-h3);
    margin-bottom: 20px;
  }
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 20px;
`;

const NavigationButton = styled.button`
  width: 100%;
  min-width: 200px;
  height: 55px;
  background-color: var(--primary-green-500);
  border: none;
  border-radius: 8px;
  color: var(--neutral-100);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 12px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: var(--primary-green-600);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: 2px solid var(--primary-green-700);
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    height: 50px;
    min-width: 180px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    height: 45px;
    min-width: 160px;
  }
`;

const SectionTitle = styled.h3`
  color: var(--primary-green-600);
  margin: 30px 0 15px 0;
  width: 100%;
  max-width: 1000px;
  text-align: center;
  border-bottom: 2px solid var(--primary-green-500);
  padding-bottom: 10px;
  font-size: 18px;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 16px;
    margin: 25px 0 12px 0;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    margin: 20px 0 10px 0;
  }
`;

export default function Setting(): React.JSX.Element {
  const navigate = useNavigate();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const gotoPage = (path: string): void => {
    navigate(path);
  };

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

  const handleReviewSubmit = (reviewData: any) => {
    console.log("리뷰 제출:", reviewData);
    showAlert("리뷰 제출 완료", "리뷰가 제출되었습니다! (데모용)", "success");
    setIsReviewModalOpen(false);
  };

  const handleReviewEdit = (reviewData: any) => {
    console.log("리뷰 수정:", reviewData);
    showAlert("리뷰 수정 완료", "리뷰가 수정되었습니다! (데모용)", "success");
    setIsEditModalOpen(false);
  };

  // 데모용 기존 리뷰 데이터
  const demoReviewData = {
    rating: 4,
    images: [],
    content: "이곳은 정말 좋은 카페입니다. 커피 맛도 좋고 분위기도 좋아요!"
  };

  return (
    <PageContainer>
      <Title>설정 페이지</Title>

      <ButtonGrid>
        <NavigationButton onClick={() => gotoPage("/main")}>
          메인 페이지
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/login")}>
          로그인
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/signup")}>
          회원가입
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/map")}>
          지도 페이지
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/mypage")}>
          마이페이지
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/bookmark")}>
          즐겨찾기
        </NavigationButton>
      </ButtonGrid>

      <SectionTitle>컴포넌트 데모</SectionTitle>
      
      <ButtonGrid>
        <NavigationButton 
          onClick={() => setIsReviewModalOpen(true)}
          style={{ backgroundColor: 'var(--primary-blue-500)' }}
        >
          리뷰 작성 모달 데모
        </NavigationButton>
        <NavigationButton 
          onClick={() => setIsEditModalOpen(true)}
          style={{ backgroundColor: 'var(--warning-300)' }}
        >
          리뷰 수정 모달 데모
        </NavigationButton>
      </ButtonGrid>

      {/* 리뷰 작성 모달 */}
      <ReviewWriteModal
        isOpen={isReviewModalOpen}
        placeName="스타벅스 강남점 (데모)"
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />

      {/* 리뷰 수정 모달 */}
      <ReviewWriteModal
        isOpen={isEditModalOpen}
        placeName="스타벅스 강남점 (데모)"
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleReviewEdit}
        mode="edit"
        initialData={demoReviewData}
      />

      {/* 커스텀 알림 */}
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
