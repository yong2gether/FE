import React, { useState } from "react";
import styled from "styled-components";
import {
  PiBookmarkSimple,
  PiBookmarkSimpleFill,
  PiDotsThreeVertical,
} from "react-icons/pi";
import { AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

interface LargeReviewBoxProps {
  id: string;
  name: string;
  bookmark: boolean;
  isMoreOpen: boolean;
  onMoreClick: (id: string) => void;
  rating: number;
  createdAt: string;
  industry: string;
  address: string;
  images?: string[];
  reviewText: string;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
}

const ReviewContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--spacing-xs);
`;

const NameContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--neutral-1000);
`;

const Name = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-2xs);
  position: relative;

  & > svg {
    min-width: 24px;
    min-height: 24px;
    cursor: pointer;
  }
`;

const MoreContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--neutral-200);
  z-index: 100;
`;

const MoreItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--neutral-100);
  color: var(--neutral-500);
  white-space: nowrap;
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    background-color: var(--neutral-200);
    color: var(--neutral-1000);
  }

  &:active {
    background-color: var(--neutral-200);
    color: var(--neutral-1000);
  }
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
  flex-wrap: wrap;
  row-gap: 4px;
  min-width: 0;
`;

const Ellipsis = styled.span`
  display: inline-block;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ImageContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--spacing-2xs);
  overflow: hidden;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const ImageItem = styled.img`
  width: 82.75px;
  height: 76.75px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
`;

const ReviewText = styled.div`
  width: 100%;
  color: var(--neutral-1000);
`;

export default function LargeReviewBox({
  id,
  name,
  bookmark,
  isMoreOpen = false,
  onMoreClick,
  rating,
  createdAt,
  industry,
  address,
  images,
  reviewText,
  onEdit,
  onDelete,
}: LargeReviewBoxProps): React.JSX.Element {
  const navigate = useNavigate();
  const [isBookmark, setIsBookmark] = useState<boolean>(bookmark);

  const handleBookmarkClick = () => {
    setIsBookmark((prev) => !prev);
  };

  const handleMoreClick = () => {
    if (onMoreClick) {
      onMoreClick(id);
    }
  };

  const handleReviewEdit = () => {
    if (onEdit) {
      onEdit(id);
    } else {
      // 기존 로직 (수정 페이지로 이동)
      navigate("/mypage/review", {
        state: {
          name,
          rating,
          reviewText,
        },
      });
    }
  };

  const handleReviewDelete = () => {
    if (onDelete) {
      onDelete(id);
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
    <ReviewContainer>
      <NameContainer>
        <Name className="Title__H4">{name}</Name>
        <IconContainer>
          {isBookmark ? (
            <PiBookmarkSimpleFill onClick={handleBookmarkClick} />
          ) : (
            <PiBookmarkSimple onClick={handleBookmarkClick} />
          )}
          <PiDotsThreeVertical onClick={handleMoreClick} />
          {isMoreOpen && (
            <MoreContainer className="Body__Small">
              <MoreItem onClick={handleReviewEdit}>리뷰 수정</MoreItem>
              <MoreItem onClick={handleReviewDelete}>리뷰 삭제</MoreItem>
            </MoreContainer>
          )}
        </IconContainer>
      </NameContainer>

      <RatingContainer>
        <div className="Body__Default">{rating}</div>
        <StarContainer>{renderStars()}</StarContainer>
      </RatingContainer>

      <InfoContainer className="Body__Default">
        <Ellipsis style={{ maxWidth: 100 }}>{createdAt}</Ellipsis>
        <div>|</div>
        <Ellipsis style={{ maxWidth: 120 }}>{industry}</Ellipsis>
        <div>|</div>
        <Ellipsis style={{ maxWidth: 220 }}>{address}</Ellipsis>
      </InfoContainer>

      {images && images.length > 0 && (
        <ImageContainer>
          {images.map((image, index) => (
            <ImageItem
              key={index}
              src={image}
              alt={`리뷰 이미지 ${index + 1}`}
            />
          ))}
        </ImageContainer>
      )}

      <ReviewText className="Body__Default">{reviewText}</ReviewText>
    </ReviewContainer>
  );
}
