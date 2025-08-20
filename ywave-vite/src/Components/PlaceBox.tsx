import React, { useState } from "react";
import styled from "styled-components";
import { PiBookmarkSimple, PiBookmarkSimpleFill } from "react-icons/pi";
import { AiFillStar } from "react-icons/ai";

interface PlaceBoxProps {
  name: string;
  bookmark: boolean;
  rating: number;
  distance: string;
  industry: string;
  address: string;
  images?: string[];
  onClick: () => void;
}

const PlaceContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--spacing-2xs);
  box-shadow: 0px 6px 15px 0px rgba(0, 0, 0, 0.2);
  background-color: var(--neutral-100);
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 16px 12px;
  cursor: pointer;

  &:hover {
    background-color: rgba(171, 218, 255, 0.1);
  }

  &:active {
    background-color: rgba(4, 143, 255, 0.1);
    border-color: var(--primary-blue-500);
  }
`;

const NameContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--neutral-1000);

  & > svg {
    min-width: 24px;
    min-height: 24px;
    cursor: pointer;
  }
`;

const Name = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  color: var(--neutral-800);
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
  width: 76.75px;
  height: 76.75px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
`;

export default function PlaceBox({
  name,
  bookmark,
  rating,
  distance,
  industry,
  address,
  images,
  onClick,
}: PlaceBoxProps): React.JSX.Element {
  const [isBookmark, setIsBookmark] = useState<boolean>(bookmark);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmark((prev) => !prev);
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
    <PlaceContainer onClick={onClick}>
      <NameContainer>
        <Name className="Title__H4">{name}</Name>
        {isBookmark ? (
          <PiBookmarkSimpleFill onClick={handleBookmarkClick} />
        ) : (
          <PiBookmarkSimple onClick={handleBookmarkClick} />
        )}
      </NameContainer>

      <RatingContainer>
        <div className="Body__Default">{rating}</div>
        <StarContainer>{renderStars()}</StarContainer>
      </RatingContainer>

      <InfoContainer className="Body__Default">
        <div>{distance}</div>
        <div>|</div>
        <div>{industry}</div>
        <div>|</div>
        <div>{address}</div>
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
    </PlaceContainer>
  );
}
