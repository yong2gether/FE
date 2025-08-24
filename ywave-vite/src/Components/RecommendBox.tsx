import React from "react";
import styled from "styled-components";
import { AiFillStar } from "react-icons/ai";

interface RecommendBoxProps {
  image: string;
  name: string;
  rating: number;
  onClick: () => void;
}

const PlaceContainer = styled.div<{ $backgroundImage: string }>`
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  background-image: url(${({ $backgroundImage }) => $backgroundImage});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--spacing-2xs);
  background-color: var(--neutral-100);
  color: var(--neutral-1000);
  padding: 8px;
  z-index: 1;
`;

const Name = styled.div`
  width: 100%;
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

const Star = styled(AiFillStar)<{ $isFill: boolean }>`
  width: 16px;
  height: 16px;
  color: ${({ $isFill }) =>
    $isFill ? "var(--primary-blue-500)" : "var(--neutral-200)"};
`;

export default function RecommendBox({
  image,
  name,
  rating,
  onClick,
}: RecommendBoxProps): React.JSX.Element {
  const renderStars = () => {
    const stars: React.ReactElement[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.round(rating) ? (
          <Star key={`filled-${i}`} $isFill={true} />
        ) : (
          <Star key={`empty-${i}`} $isFill={false} />
        )
      );
    }
    return stars;
  };

  return (
    <PlaceContainer $backgroundImage={image} onClick={onClick}>
      <InfoContainer>
        <Name className="Body__MediumDefault">{name}</Name>
        <RatingContainer>
          <div className="Body__Default">{rating}</div>
          <StarContainer>{renderStars()}</StarContainer>
        </RatingContainer>
      </InfoContainer>
    </PlaceContainer>
  );
}
