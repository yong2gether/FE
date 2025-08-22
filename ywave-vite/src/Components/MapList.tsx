import React, { useState } from "react";
import styled from "styled-components";
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
`;

const ImageContainer = styled.div`
    height: 200px;
    display: flex;
    align-items: center;
    gap: 4px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
`

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

export default function MapList({
    name,
    bookmark,
    rating,
    address,
    category,
    images,
}: {
    name: string;
    bookmark: boolean;
    rating: number;
    address: string;
    category: string;
    images: string[];
}): React.JSX.Element {
    const [IsBookMark, setIsBookMark] = useState<boolean>(bookmark);    
    
    const handleBookmarkClick = () => {
        setIsBookMark(!IsBookMark); 
    }

    return (
    <MapListContainer>
        <TitleContainer className="Title__H4">
            {name}
            {IsBookMark ? <PiBookmarkSimpleFill style={{width:24, height:24}} onClick={handleBookmarkClick} /> : <PiBookmarkSimple style={{width:24, height:24}} onClick={handleBookmarkClick} />}
        </TitleContainer>
        <RatingContainer>
            <div className="Body__Default">{rating}</div>
            <StarContainer>
                <Star isFill={true} />
                <Star isFill={true} />
                <Star isFill={true} />
                <Star isFill={true} />
                <Star isFill={false} />
            </StarContainer>
      </RatingContainer>
      <InfoContainer>
        <div className="Body__Default">{category}</div>
        <div className="Body__Default">|</div>
        <div className="Body__Default">{address}</div>
      </InfoContainer>
      <ImageContainer>
        {images.map((image, index) => (
            <Image key={index} src={image} />
        ))}
        
      </ImageContainer>
    </MapListContainer>
    )
}