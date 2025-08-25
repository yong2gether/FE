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
  width: 160px; /* 고정 카드 폭 */
  height: 200px;
  flex: 0 0 160px; /* 가로 스크롤 컨테이너에서 뭉개짐 방지 */
  border-radius: 10px;
  overflow: hidden;
  background-image: url(${({ $backgroundImage }) => $backgroundImage});
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
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
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 최대 2줄 */
  -webkit-box-orient: vertical;
  overflow: hidden;
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
