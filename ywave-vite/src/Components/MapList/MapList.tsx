import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
    PiBookmarkSimple,
    PiBookmarkSimpleFill,
} from "react-icons/pi";
import { AiFillStar } from "react-icons/ai";


const MapListContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
    border-radius: 10px;
    background: var(--neutral-100);
    cursor: pointer;
`

const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    color: var(--neutral-1000);
    text-align: center;

`

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
  width: 100%;
  overflow: hidden;
`;

const AddressText = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 230px;
`;

const ImageContainer = styled.div`
    height: 120px;
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 4px 0;
    
    &::-webkit-scrollbar {
        display: none;
    }
`

const Image = styled.img`
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
    border: 1px solid var(--neutral-200);
`

export default function MapList({
    name, bookmark, rating, address, category, images, distance, storeId,
}: {
    name: string; bookmark: boolean; rating: number; address: string; category: string; images: string[]; distance?: string; storeId?: string;
}): React.JSX.Element {
    const [IsBookMark, setIsBookMark] = useState<boolean>(bookmark);
    const navigate = useNavigate();
    
    const handleBookmarkClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsBookMark(!IsBookMark); 
    }

    const handleStoreClick = () => {
        if (storeId) {
            navigate(`/main/place/${storeId}`);
        }
    }

    const renderStars = () => {
        const stars: React.ReactElement[] = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star key={`star-${i}`} isFill={i <= Math.round(rating)} />
            );
        }
        return stars;
    };

    return (
    <MapListContainer onClick={handleStoreClick}>
        <TitleContainer className="Title__H4">
            {name}
            {IsBookMark ? <PiBookmarkSimpleFill style={{width:24, height:24}} onClick={handleBookmarkClick} /> : <PiBookmarkSimple style={{width:24, height:24}} onClick={handleBookmarkClick} />}
        </TitleContainer>
        <RatingContainer>
            <div className="Body__Default">{rating}</div>
            <StarContainer>
                {renderStars()}
            </StarContainer>
      </RatingContainer>
      <InfoContainer>
        {distance && <div className="Body__Default">{distance}</div>}
        {distance && <div className="Body__Default">|</div>}
        <div className="Body__Default">{category}</div>
        <div className="Body__Default">|</div>
        <AddressText className="Body__Default">{address}</AddressText>
      </InfoContainer>
      {images && images.length > 0 && (
        <ImageContainer>
            {images.map((image, index) => (
                <Image key={index} src={image} />
            ))}
        </ImageContainer>
      )}
    </MapListContainer>
    )
}