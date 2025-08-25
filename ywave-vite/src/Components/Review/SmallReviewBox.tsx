import React, { useState } from "react";
import styled from "styled-components";
import { AiFillStar } from "react-icons/ai";
import ImageModal from "../ImageComponent/ImageModal";

interface SmallReviewBoxProps {
  id: string;
  rating: number;
  nick: string;
  createdAt: string;
  reviewText: string;
  images?: string[];
  isMyReview?: boolean;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
}

const ReviewContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-s);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-2xs);
  margin-left: auto;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--neutral-500);
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background: var(--neutral-100);
    color: var(--neutral-700);
  }
`;

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--spacing-xs);
  flex: 1;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2xs);
  color: var(--neutral-1000);
`;

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Star = styled(AiFillStar)<{ isFill: boolean }>`
  width: 16px;
  height: 16px;
  color: ${({ isFill }) =>
    isFill ? "var(--primary-blue-500)" : "var(--neutral-200)"};
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--spacing-2xs);
  color: var(--neutral-500);
`;

const ReviewText = styled.div`
  color: var(--neutral-1000);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const ImageContainer = styled.div`
  min-width: 77px;
  min-height: 77px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 8px 4px;
  position: relative;
  cursor: pointer;
  border: 1px solid var(--neutral-200);
`;

const ImageCount = styled.div`
  position: absolute;
  background-color: var(--neutral-800);
  color: var(--neutral-100);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 4px;
  font-size: 10px;
  font-family: Pretendard, sans-serif;
  font-weight: 400;
  line-height: 1.4;
`;

export default function SmallReviewBox({
  id,
  rating,
  nick,
  createdAt,
  reviewText,
  images,
  isMyReview = false,
  onEdit,
  onDelete,
}: SmallReviewBoxProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const renderStars = () => {
    const stars: React.ReactElement[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.round(rating) ? (
          <Star key={`filled-${i}`} isFill={true} />
        ) : (
          <Star key={`empty-${i}`} isFill={false} />
        )
      );
    }
    return stars;
  };

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const goToPrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (images && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  return (
    <ReviewContainer>
      <DetailContainer>
        <RatingContainer>
          <div className="Title__H4">{rating}</div>
          <StarContainer>{renderStars()}</StarContainer>
        </RatingContainer>
        
        <InfoContainer className="Body__Default">
          <div>{nick}</div>
          <div>|</div>
          <div>{createdAt}</div>
        </InfoContainer>
        
        <ReviewText className="Body__Default">{reviewText}</ReviewText>
        
        {images && images.length > 0 && (
          <ImageContainer onClick={() => openImageModal(0)}>
            <img
              src={images[0]}
              alt="리뷰 이미지"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
            {images.length > 1 && (
              <ImageCount>+{images.length - 1}</ImageCount>
            )}
          </ImageContainer>
        )}
      </DetailContainer>
      
      {isMyReview && (onEdit || onDelete) && (
        <ActionButtons>
          {onEdit && (
            <ActionButton onClick={() => onEdit(id)}>
              수정
            </ActionButton>
          )}
          {onDelete && (
            <ActionButton onClick={() => onDelete(id)}>
              삭제
            </ActionButton>
          )}
        </ActionButtons>
      )}
      
      {isImageModalOpen && images && (
        <ImageModal
          isOpen={isImageModalOpen}
          images={images}
          currentIndex={currentImageIndex}
          onClose={closeImageModal}
          onPrevious={goToPrevious}
          onNext={goToNext}
        />
      )}
    </ReviewContainer>
  );
}
