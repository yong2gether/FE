import React from "react";
import styled from "styled-components";
import { AiFillStar } from "react-icons/ai";

interface RecommendBoxProps {
  image: string;
  name: string;
  rating: number;
  onClick: () => void;
}

const PlaceContainer = styled.div<{ backgroundImage: string }>`
  width: 168px;
  height: 223px;
  border-radius: 10px;
  background-image: url(${({ backgroundImage }) => backgroundImage});
  background-size: cover;
  box-sizing: border-box;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 10px;
    background-color: transparent;
  }

  &:hover::before {
    background-color: rgba(171, 218, 255, 0.3);
  }

  &:active {
    border: 1px solid var(--primary-blue-500);
  }

  &:active::before {
    background-color: rgba(4, 143, 255, 0.4);
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

const Star = styled(AiFillStar)<{ isFill: boolean }>`
  width: 16px;
  height: 16px;
  color: ${({ isFill }) =>
    isFill ? "var(--primary-blue-500)" : "var(--neutral-200)"};
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
          <Star key={`filled-${i}`} isFill={true} />
        ) : (
          <Star key={`empty-${i}`} isFill={false} />
        )
      );
    }
    return stars;
  };

  return (
    <PlaceContainer backgroundImage={image} onClick={onClick}>
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
