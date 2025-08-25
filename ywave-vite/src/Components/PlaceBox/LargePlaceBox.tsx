import React from "react";
import styled from "styled-components";
import { PiBookmarkSimpleFill } from "react-icons/pi";
import { AiFillStar } from "react-icons/ai";

interface LargePlaceBoxProps {
  name: string;
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
  gap: var(--spacing-xs);
  cursor: pointer;
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
  color: var(--neutral-800);
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
  width: calc(100% + 16px);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--spacing-2xs);
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const ImageItem = styled.img`
  width: 138px;
  height: 200px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
`;

export default function LargePlaceBox({
  name,
  rating,
  distance,
  industry,
  address,
  images,
  onClick,
}: LargePlaceBoxProps): React.JSX.Element {
  const handleBookmarkClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    console.log("북마크 해제");
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
        <Name className="Title__H3">{name}</Name>
        <PiBookmarkSimpleFill onClick={handleBookmarkClick} />
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
