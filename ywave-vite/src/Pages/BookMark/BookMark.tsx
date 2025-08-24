import React, { useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import BottomSheet from "../../Components/BottomSheet";
import { useNavigate } from "react-router-dom";
import FolderBox from "../../Components/BookMarkFolder/FolderBox";
import PencilButton from "../../Components/Button/PencilButton";
import { useBookmark } from "../../hooks/useBookmark";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { createEmojiMarker } from "../../utils/emojiToMarker";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  position: relative;
`;

const MapBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;



const BottomSheetContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  min-height: 100%;
  position: relative;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--neutral-1000);
  flex-shrink: 0;
`;




const defaultCenter = { lat: 37.5665, lng: 126.978 };

export default function BookMark(): React.JSX.Element {
  const navigate = useNavigate();
  const { folders, deleteFolder, places: allBookmarkPlaces } = useBookmark();
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(true);
  const [openMoreId, setOpenMoreId] = useState<string | null>(null);
  const [sheetRatio, setSheetRatio] = useState<number>(0);

  // Google Maps API 훅 사용
  const { isLoaded, loadError, apiKey } = useGoogleMaps();

  // 북마크 장소들을 지도에 표시할 데이터
  const bookmarkPlaces = useMemo(() => {
    if (!allBookmarkPlaces) return [];
    
    return allBookmarkPlaces.map(place => ({
      id: place.id,
      name: place.name,
      lat: place.lat,
      lng: place.lng,
      unicode: '1f4c1' // 기본 폴더 이모지
    }));
  }, [allBookmarkPlaces]);

  // 지도 중심점 계산
  const mapCenter = useMemo(() => {
    if (bookmarkPlaces.length === 0) return defaultCenter;
    
    // 모든 장소의 평균 위치 계산
    const avgLat = bookmarkPlaces.reduce((sum, place) => sum + place.lat, 0) / bookmarkPlaces.length;
    const avgLng = bookmarkPlaces.reduce((sum, place) => sum + place.lng, 0) / bookmarkPlaces.length;
    
    return { lat: avgLat, lng: avgLng };
  }, [bookmarkPlaces]);

  const handleMoreClick = (id: string): void => {
    setOpenMoreId((prev) => (prev === id ? null : id));
  };

  const handleFolderClick = (unicode: string, title: string): void => {
    navigate("/bookmark/detail", { state: { unicode, title } });
  };

  const handleFolderDelete = (folderId: string): void => {
    if (window.confirm("정말로 이 폴더를 삭제하시겠습니까?")) {
      deleteFolder(folderId);
      setOpenMoreId(null);
    }
  };

  const handleProgressChange = useCallback((ratio: number) => {
    setSheetRatio(ratio);
  }, []);

  return (
    <PageContainer>
      <MapBackground>
        <MapContainer>
          {isLoaded && !loadError && (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={mapCenter}
              zoom={12}
              options={{
                clickableIcons: false,
                disableDefaultUI: true,
                zoomControl: false,
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                styles: [
                  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
                  { featureType: "transit", stylers: [{ visibility: "off" }] },
                ]
              }}
            >
              {bookmarkPlaces.map((place) => (
                <Marker
                  key={place.id}
                  position={{ lat: place.lat, lng: place.lng }}
                  icon={createEmojiMarker(place.unicode, {
                    size: 40,
                    backgroundColor: "#ffffff",
                    borderColor: "#1976d2",
                    borderWidth: 3
                  })}
                  title={place.name}
                />
              ))}
            </GoogleMap>
          )}
        </MapContainer>
      </MapBackground>


      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        snapPoints={[0.25, 0.7, 0.95]}
        initialSnapIndex={0}
        bottomOffsetPx={0}
        showOverlay={false}
        dismissible={false}
        onProgressChange={handleProgressChange}
      >
        <BottomSheetContainer>
          <TitleContainer>
            <div className="Title__H2">즐겨찾기</div>
            <PencilButton
              buttonText="새 목록 추가하기"
              onClick={() => navigate("/bookmark/add")}
            />
          </TitleContainer>
          
          {folders.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              color: 'var(--neutral-500)'
            }}>
              <div className="Body__MediumLarge" style={{ marginBottom: '8px' }}>
                아직 북마크 폴더가 없습니다
              </div>
              <div className="Body__Small">
                새 목록 추가하기 버튼을 눌러 첫 번째 폴더를 만들어보세요!
              </div>
            </div>
          ) : (
            folders.map((folder, index) => (
              <React.Fragment key={folder.id}>
                <FolderBox
                  id={folder.id}
                  unicode={folder.unicode}
                  title={folder.title}
                  placeCount={folder.placeCount}
                  isMoreOpen={openMoreId === folder.id}
                  onMoreClick={() => handleMoreClick(folder.id)}
                  onClick={() =>
                    handleFolderClick(folder.unicode, folder.title)
                  }
                  onDelete={() => handleFolderDelete(folder.id)}
                />
                {index < folders.length - 1 && (
                  <div style={{height: 1, background: "var(--neutral-200)", width: "100%"}} />
                )}
              </React.Fragment>
            ))
          )}
        </BottomSheetContainer>
      </BottomSheet>
    </PageContainer>
  );
}
