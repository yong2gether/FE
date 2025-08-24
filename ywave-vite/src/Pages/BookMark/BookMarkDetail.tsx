import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, Marker } from "@react-google-maps/api";
import styled from "styled-components";
import { PiArrowLeft } from "react-icons/pi";
import { useBookmark } from "../../hooks/useBookmark";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";
import { createEmojiMarker, unifiedToEmoji } from "../../utils/emojiToMarker";
import FolderDetailList from "../../Components/BookMarkFolder/FolderDetailList";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const MapContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    top: 16px;
    left: 16px;
    width: 40px;
    height: 40px;
  }
  
  @media (max-width: 320px) {
    top: 12px;
    left: 12px;
    width: 36px;
    height: 36px;
  }
`;

const BottomSheetContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  background: white;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  max-height: 70vh;
  overflow-y: auto;
`;

const HeaderContainer = styled.div`
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid var(--neutral-200);
  background: white;
  position: sticky;
  top: 0;
  z-index: 3;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const Emoji = styled.span`
  font-size: 24px;
  line-height: 1;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: var(--neutral-900);
  margin: 0;
`;

const PlaceCount = styled.div`
  font-size: 14px;
  color: var(--neutral-600);
  margin-left: auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  color: var(--neutral-600);
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--error-600);
`;

const defaultCenter = { lat: 37.5665, lng: 126.978 };

const mockPlaces = [
  {
    id: "1",
    name: "맛있는 피자집",
    address: "서울시 강남구 테헤란로 123",
    lat: 37.5665,
    lng: 126.978,
    category: "음식점",
    rating: 4.5,
    distance: "0.5km",
    industry: "음식점",
    images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop"]
  },
  {
    id: "2",
    name: "커피 전문점",
    address: "서울시 강남구 테헤란로 456",
    lat: 37.5670,
    lng: 126.979,
    category: "카페",
    rating: 4.3,
    distance: "0.8km",
    industry: "카페",
    images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop"]
  }
];

export default function BookMarkDetail(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { unicode, title: folderTitle } = location.state || {};
  const { places: allBookmarkPlaces } = useBookmark();
  const [emoji, setEmoji] = useState<string>("📁");
  const [title, setTitle] = useState<string>("폴더");

  const { isLoaded, loadError } = useGoogleMaps();

  const places = useMemo(() => {
    if (!allBookmarkPlaces) return mockPlaces;
    
    return allBookmarkPlaces.map(place => ({
      id: place.id,
      name: place.name,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
      category: place.category,
      rating: 4.5,
      distance: '0.5km',
      industry: place.category,
      images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop"]
    }));
  }, [allBookmarkPlaces]);

  const mapCenter = useMemo(() => {
    if (places.length === 0) return defaultCenter;
    
    const avgLat = places.reduce((sum, place) => sum + place.lat, 0) / places.length;
    const avgLng = places.reduce((sum, place) => sum + place.lng, 0) / places.length;
    
    return { lat: avgLat, lng: avgLng };
  }, [places]);

  useEffect(() => {
    if (unicode) {
      setEmoji(unifiedToEmoji(unicode));
    }
    if (folderTitle) {
      setTitle(folderTitle);
    }
  }, [unicode, folderTitle]);

  const handlePlaceClick = (placeId: string) => {
    navigate(`/main/place/${placeId}`, { 
      state: { from: 'bookmark' } 
    });
  };

  const handleBackClick = () => {
    navigate("/bookmark");
  };

  const renderMap = () => {
    if (loadError) {
      return <ErrorContainer>지도를 불러오는 중 오류가 발생했습니다.</ErrorContainer>;
    }

    if (!isLoaded) {
      return <LoadingContainer>지도를 불러오는 중입니다...</LoadingContainer>;
    }

    return (
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={mapCenter}
        zoom={14}
        options={{
          clickableIcons: false,
          disableDefaultUI: true,
          zoomControl: true,
          controlSize: 28,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
            icon={createEmojiMarker(emoji, {
              size: 32,
              backgroundColor: "#ffffff",
              borderColor: "#1976d2",
              borderWidth: 2
            })}
            title={place.name}
            onClick={() => handlePlaceClick(place.id)}
          />
        ))}
      </GoogleMap>
    );
  };

  return (
    <Container>
      <MapContainer>
        {renderMap()}
      </MapContainer>
      
      <BackButton onClick={handleBackClick} aria-label="뒤로 가기">
        <PiArrowLeft size={20} color="#333" />
      </BackButton>
      
      <BottomSheetContainer>
        <HeaderContainer>
          <Header>
            <Emoji role="img" aria-label="folder emoji">{emoji}</Emoji>
            <Title>{title}</Title>
            <PlaceCount>{places.length}개 장소</PlaceCount>
          </Header>
        </HeaderContainer>
        
        <FolderDetailList
          places={places}
          onPlaceClick={handlePlaceClick}
          showHeader={false}
        />
      </BottomSheetContainer>
    </Container>
  );
}
