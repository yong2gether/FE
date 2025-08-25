import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
    PiBookmarkSimple,
    PiBookmarkSimpleFill,
} from "react-icons/pi";
import { AiFillStar } from "react-icons/ai";
import { convertCategoryCode } from "../../utils/categoryMapping";
import { useBookmarkApi } from "../../hooks/useApi";
import BookmarkFolderSelectModal from "../Modal/BookmarkFolderSelectModal";


const MapListContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
    border-radius: 10px;
    background: var(--neutral-100);
    cursor: pointer;
    overflow: hidden;
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
    overflow-y: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 4px 0;
    max-width: 100%;
    
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
    name, bookmark, rating, address, category, images, distance, storeId, placeId, from = 'map',
}: {
    name: string; bookmark: boolean; rating: number; address: string; category: string; images: string[]; distance?: string; storeId?: string; placeId?: string; from?: 'map' | 'bookmark';
}): React.JSX.Element {
    const [IsBookMark, setIsBookMark] = useState<boolean>(bookmark);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const { deleteBookmark } = useBookmarkApi();
    
    // bookmark prop이 변경될 때마다 상태 동기화
    useEffect(() => {
        setIsBookMark(bookmark);
    }, [bookmark]);
    
    const handleBookmarkClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (IsBookMark) {
            // 북마크 삭제
            if (storeId) {
                try {
                    await deleteBookmark(parseInt(storeId));
                    setIsBookMark(false);
                } catch (error) {
                    console.error("북마크 삭제 실패:", error);
                }
            }
        } else {
            // 북마크 생성 - 모달 열기
            setIsModalOpen(true);
        }
    };

    const handleBookmarkSuccess = () => {
        setIsBookMark(true);
    };

    const handleStoreClick = () => {
        if (placeId) {
            // placeId가 있는 경우 (Google Places API에서 가져온 장소)
            navigate(`/main/place/${storeId || '0'}`, { 
              state: { 
                from,
                placeId: placeId 
              } 
            });
        } else if (storeId) {
            // storeId만 있는 경우 (백엔드에서 가져온 장소)
            navigate(`/main/place/${storeId}`, { 
              state: { from } 
            });
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
        <>
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
                <div className="Body__Default">{convertCategoryCode(category)}</div>
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
            
            {storeId && (
                <BookmarkFolderSelectModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    storeId={parseInt(storeId)}
                    storeName={name}
                    onBookmarkSuccess={handleBookmarkSuccess}
                />
            )}
        </>
    )
}