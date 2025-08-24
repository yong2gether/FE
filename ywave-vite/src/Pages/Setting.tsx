import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ReviewWriteModal from "../Components/Review/ReviewWriteModal";
import CustomAlert from "../Components/Modal/CustomAlert";
import EmojiPicker from "../Components/EmojiPicker";
import MapList from "../Components/MapList/MapList";
import FolderDetailList from "../Components/BookMarkFolder/FolderDetailList";

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

const ComponentDemoContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 20px 0;
  padding: 20px;
  background: var(--neutral-50);
  border-radius: 12px;
  border: 1px solid var(--neutral-200);
`;

const DemoTitle = styled.h4`
  color: var(--neutral-800);
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
`;

export default function Setting(): React.JSX.Element {
  const navigate = useNavigate();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("📁");

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

  const handleEmojiSelect = (emoji: string, unified: string) => {
    setSelectedEmoji(emoji);
    showAlert("이모지 선택", `${emoji} 이모지가 선택되었습니다!`, "success");
  };

  // 데모용 기존 리뷰 데이터
  const demoReviewData = {
    rating: 4,
    images: [],
    content: "이곳은 정말 좋은 카페입니다. 커피 맛도 좋고 분위기도 좋아요!"
  };

  // 데모용 장소 데이터
  const demoPlace = {
    id: "1",
    name: "스타벅스 강남점",
    address: "서울시 강남구 테헤란로 123",
    category: "카페",
    rating: 4.5,
    distance: "0.5km",
    industry: "카페",
    images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop"]
  };

  // 데모용 장소 목록
  const demoPlaces = [
    {
      id: "1",
      name: "맛있는 피자집",
      address: "서울시 강남구 테헤란로 123",
      lat: 37.5665,
      lng: 126.978,
      category: "음식점",
      rating: 4.5,
      distance: "0.5km",
      industry: "음식점",
      images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop"]
    },
    {
      id: "2",
      name: "커피 전문점",
      address: "서울시 강남구 테헤란로 456",
      lat: 37.5670,
      lng: 126.979,
      category: "카페",
      rating: 4.3,
      distance: "0.8km",
      industry: "카페",
      images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop"]
    }
  ];

  return (
    <PageContainer>
      <Title>설정 페이지</Title>

      <ButtonGrid>
        <NavigationButton onClick={() => gotoPage("/landing")}>
          랜딩 페이지
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/main")}>
          메인 페이지
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/login")}>
          로그인
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/signup")}>
          회원가입
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/signup/complete")}>
          회원가입 완료
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/map")}>
          지도 페이지
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/mypage")}>
          마이페이지
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/mypage/profile")}>
          마이페이지 프로필
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/mypage/review")}>
          마이페이지 리뷰
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/bookmark")}>
          즐겨찾기
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/bookmark/add")}>
          즐겨찾기 추가
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/bookmark/edit")}>
          즐겨찾기 수정
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/category/region")}>
          카테고리 지역
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/category/industry")}>
          카테고리 업종
        </NavigationButton>
        <NavigationButton onClick={() => gotoPage("/category/result")}>
          카테고리 결과
        </NavigationButton>
      </ButtonGrid>

      <SectionTitle>페이지 이동 테스트</SectionTitle>
      
      <ButtonGrid>
        <NavigationButton 
          onClick={() => gotoPage("/main")}
          style={{ backgroundColor: 'var(--primary-blue-500)' }}
        >
          메인 페이지 테스트
        </NavigationButton>
        <NavigationButton 
          onClick={() => gotoPage("/map")}
          style={{ backgroundColor: 'var(--primary-green-500)' }}
        >
          지도 페이지 테스트
        </NavigationButton>
        <NavigationButton 
          onClick={() => gotoPage("/bookmark")}
          style={{ backgroundColor: 'var(--primary-purple-500)' }}
        >
          즐겨찾기 페이지 테스트
        </NavigationButton>
        <NavigationButton 
          onClick={() => gotoPage("/mypage")}
          style={{ backgroundColor: 'var(--warning-500)' }}
        >
          마이페이지 테스트
        </NavigationButton>
      </ButtonGrid>

      <SectionTitle>모달 컴포넌트 데모</SectionTitle>
      
      <ButtonGrid>
        <NavigationButton 
          onClick={() => setIsReviewModalOpen(true)}
          style={{ backgroundColor: 'var(--primary-blue-500)' }}
        >
          리뷰 작성 모달
        </NavigationButton>
        <NavigationButton 
          onClick={() => setIsEditModalOpen(true)}
          style={{ backgroundColor: 'var(--warning-300)' }}
        >
          리뷰 수정 모달
        </NavigationButton>
        <NavigationButton 
          onClick={() => setIsEmojiPickerOpen(true)}
          style={{ backgroundColor: 'var(--primary-purple-500)' }}
        >
          이모지 선택기
        </NavigationButton>
      </ButtonGrid>

      <SectionTitle>목록 관련 컴포넌트 데모</SectionTitle>
      
      <ComponentDemoContainer>
        <DemoTitle>Map List</DemoTitle>
        <MapList
          name={demoPlace.name}
          bookmark={true}
          rating={demoPlace.rating}
          address={demoPlace.address}
          category={demoPlace.category}
          images={demoPlace.images}
          distance={demoPlace.distance}
          storeId={demoPlace.id}
        />
      </ComponentDemoContainer>

      <ComponentDemoContainer>
        <DemoTitle>Folder Detail List</DemoTitle>
        <FolderDetailList
          title="테스트 폴더"
          emoji="📁"
          places={demoPlaces}
          onPlaceClick={(id) => showAlert("장소 클릭", `장소 ID: ${id}`, "info")}
          showHeader={true}
        />
      </ComponentDemoContainer>

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

      {/* 이모지 선택기 */}
      <EmojiPicker
        isOpen={isEmojiPickerOpen}
        onClose={() => setIsEmojiPickerOpen(false)}
        onSelect={handleEmojiSelect}
        currentEmoji={selectedEmoji}
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
