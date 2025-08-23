import React, { useState } from "react";
import styled from "styled-components";
import { PiBookmarkSimple, PiBookmarkSimpleFill } from "react-icons/pi";
import { AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import ImageModal from "../ImageComponent/ImageModal";

interface SmallReviewBoxProps {
  id: string;
  rating: number;
  nick: string;
  createdAt: string;
  reviewText: string;
  images?: string[];
}

const ReviewContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-s);
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
  images = [],
}: SmallReviewBoxProps): React.JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToPrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

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

  return (
    <>
      <ReviewContainer>
        <DetailContainer>
          <RatingContainer>
            <div className="Body__Default">{rating}</div>
            <StarContainer>{renderStars()}</StarContainer>
          </RatingContainer>

          <InfoContainer className="Body__Default">
            <div>{nick}님</div>
            <div>|</div>
            <div>{createdAt}</div>
          </InfoContainer>

          <ReviewText className="Body__Default">{reviewText}</ReviewText>
        </DetailContainer>

        {images && images.length > 0 && (
          <ImageContainer 
            style={{ backgroundImage: `url(${images[0]})` }}
            onClick={() => openModal(0)}
          >
            {images.length > 1 && (
              <ImageCount>{images.length}</ImageCount>
            )}
          </ImageContainer>
        )}
      </ReviewContainer>

      <ImageModal
        isOpen={isModalOpen}
        images={images}
        currentIndex={currentImageIndex}
        onClose={closeModal}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
    </>
  );
}
