import React from "react";
import styled from "styled-components";
import MapList from "../MapList/MapList";

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  min-height: 100%;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-s);
  padding: var(--spacing-l) 0;
  border-bottom: 1px solid var(--neutral-200);
  margin-bottom: var(--spacing-m);
  width: 100%;
`;

const FolderTitle = styled.div`
  font-size: var(--title-h2);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-1000);
`;

const PlaceCount = styled.div`
  font-size: var(--body-medium);
  color: var(--neutral-600);
  background: var(--neutral-100);
  padding: 4px 12px;
  border-radius: 16px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--neutral-500);
  width: 100%;
`;

interface Place {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
  rating: number;
  distance: string;
  industry: string;
  images?: string[];
}

interface FolderDetailListProps {
  title?: string;
  emoji?: string;
  places: Place[];
  onPlaceClick: (placeId: string) => void;
  showHeader?: boolean;
}

export default function FolderDetailList({ 
  title, 
  emoji, 
  places, 
  showHeader = true
}: FolderDetailListProps): React.JSX.Element {
  return (
    <Container>
      {showHeader && title && emoji && (
        <Header>
          <span role="img" aria-label="folder emoji" style={{ fontSize: '24px' }}>
            {emoji}
          </span>
          <FolderTitle>{title}</FolderTitle>
          <PlaceCount>{places.length}개 장소</PlaceCount>
        </Header>
      )}
      
      {places.length === 0 ? (
        <EmptyState>
          <div className="Body__MediumLarge" style={{ marginBottom: '8px' }}>
            아직 저장된 장소가 없습니다
          </div>
          <div className="Body__Small">
            장소를 추가해보세요!
          </div>
        </EmptyState>
      ) : (
        places.map((place, index) => (
          <React.Fragment key={place.id}>
            <MapList 
              name={place.name}
              bookmark={false}
              rating={place.rating}
              address={place.address}
              category={place.category}
              images={place.images || []}
              distance={place.distance}
              storeId={place.id}
            />
            {index < places.length - 1 && (
              <div style={{height: 1, background: "var(--neutral-200)", width: "100%"}} />
            )}
          </React.Fragment>
        ))
      )}
    </Container>
  );
}
