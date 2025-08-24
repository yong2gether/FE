import React from 'react';
import styled from 'styled-components';
import { AiFillStar } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

interface MarkerInfoBottomSheetProps {
  $isVisible: boolean;
  onClose: () => void;
  placeInfo: {
    id: string;
    name: string;
    address: string;
    category: "음식점" | "카페" | "마트슈퍼" | "의료기관" | "교육문구" | "숙박" | "생활편의" | "의류잡화" | "체육시설" | "주유소" | "기타" | "오락" | "편의점" | "헤어샵" | "뷰티" | "꽃집" | "영화/공연";
    rating: number;
    reviewCount: number;
    images: string[];
    userReviews: any[];
    googleReviews: any[];
    lat: number;
    lng: number;
  } | null;
}

const ModalOverlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
`;

const ModalContent = styled.div<{ $isVisible: boolean }>`
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin: 16px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transform: ${({ $isVisible }) => ($isVisible ? 'scale(1)' : 'scale(0.9)')};
  transition: transform 0.3s ease;
`;

const ModalTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: var(--neutral-1000);
  margin-bottom: 16px;
  text-align: left;
`;

const Category = styled.span`
  font-size: 12px;
  color: var(--neutral-600);
  background: var(--neutral-100);
  padding: 4px 12px;
  border-radius: 16px;
  display: inline-block;
  width: fit-content;
  margin-bottom: 16px;
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 16px;
  background: var(--neutral-50);
  border-radius: 12px;
  border: 1px solid var(--neutral-200);
`;

const Rating = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: var(--neutral-800);
`;

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const Star = styled(AiFillStar)<{ $isFill: boolean }>`
  width: 18px;
  height: 18px;
  color: ${({ $isFill }) =>
    $isFill ? "var(--primary-blue-500)" : "var(--neutral-200)"};
`;

const ReviewCount = styled.span`
  font-size: 14px;
  color: var(--neutral-600);
`;

const Address = styled.div`
  font-size: 14px;
  color: var(--neutral-700);
  line-height: 1.5;
  padding: 16px;
  background: var(--neutral-50);
  border-radius: 12px;
  border: 1px solid var(--neutral-200);
  margin-bottom: 24px;
  text-align: left;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const ModalButton = styled.button<{ $isPrimary?: boolean }>`
  flex: 1;
  padding: 14px 20px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ $isPrimary }) => $isPrimary ? `
    background: var(--primary-blue-500);
    color: white;
    
    &:hover {
      background: var(--primary-blue-600);
      transform: translateY(-1px);
    }
  ` : `
    background: var(--neutral-100);
    color: var(--neutral-700);
    border: 1px solid var(--neutral-200);
    
    &:hover {
      background: var(--neutral-200);
    }
  `}
`;

const renderStars = (rating: number) => {
  const stars: React.ReactElement[] = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star key={i} $isFill={i <= Math.round(rating)} />
    );
  }
  return stars;
};

export default function MarkerInfoBottomSheet({
  $isVisible,
  onClose,
  placeInfo
}: MarkerInfoBottomSheetProps) {
  const navigate = useNavigate();

  if (!placeInfo) return null;

  const handleDetailClick = () => {
    // MainPlace로 이동 후 뒤로가기 시 원래 화면으로 돌아가기 위해 state 전달
    navigate(`/main/place/${placeInfo.id}`, { 
      state: { from: 'map', lat: placeInfo.lat, lng: placeInfo.lng } 
    });
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <ModalOverlay $isVisible={$isVisible} onClick={handleClose}>
      <ModalContent $isVisible={$isVisible} onClick={(e) => e.stopPropagation()}>
        <ModalTitle>{placeInfo.name}</ModalTitle>
        <Category>{placeInfo.category}</Category>
        
        <RatingSection>
          <Rating>{placeInfo.rating.toFixed(1)}</Rating>
          <StarContainer>
            {renderStars(placeInfo.rating)}
          </StarContainer>
          <ReviewCount>({placeInfo.reviewCount}개)</ReviewCount>
        </RatingSection>
        
        <Address>{placeInfo.address}</Address>
        
        <ModalButtonContainer>
          <ModalButton onClick={handleClose}>
            닫기
          </ModalButton>
          <ModalButton $isPrimary onClick={handleDetailClick}>
            상세보기
          </ModalButton>
        </ModalButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
}
