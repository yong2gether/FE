import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, Marker } from "@react-google-maps/api";
import styled from "styled-components";
import { PiArrowLeft } from "react-icons/pi";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";
import { createEmojiMarker, unifiedToEmoji } from "../../utils/emojiToMarker";
import BottomSheet from "../../Components/BottomSheet";
import FolderDetailList from "../../Components/BookMarkFolder/FolderDetailList";
import { useBookmarkApi, useStoreApi } from "../../hooks/useApi";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
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
`;

const BottomSheetContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-m);
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

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Emoji = styled.span`
  font-size: 24px;
  line-height: 1;
`;

const PlaceCount = styled.div`
  font-size: 14px;
  color: var(--neutral-600);
  margin-left: auto;
`;

const defaultCenter = { lat: 37.5665, lng: 126.978 };

export default function BookMarkDetail(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, unicode, title } = location.state || {};
  const { getBookmarkGroup } = useBookmarkApi();
  const { getStoreDetails } = useStoreApi();

  // 장소 목록 상태
  const [allBookmarkPlaces, setAllBookmarkPlaces] = useState<any[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(false);

  // 바텀 시트 상태
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(true);
  const [sheetRatio, setSheetRatio] = useState<number>(0);

  const { isLoaded, loadError } = useGoogleMaps();

  const places = useMemo(() => {
    if (!allBookmarkPlaces || allBookmarkPlaces.length === 0) return [];

    return allBookmarkPlaces.map((place) => ({
      id: place.placeId,
      name: place.name,
      address: place.formattedAddress,
      lat: place.lat,
      lng: place.lng,
      category: place.category,
      rating: place.rating || 0,
      distance: "0.5km", // API에서 거리 정보가 없으므로 기본값
      industry: place.category,
      images:
        place.photos?.length > 0
          ? place.photos.map((photo) => photo.url)
          : undefined,
    }));
  }, [allBookmarkPlaces]);

  const mapCenter = useMemo(() => {
    if (places.length === 0) return defaultCenter;

    const avgLat = places.reduce((sum, place) => sum + place.lat, 0) / places.length;
    const avgLng = places.reduce((sum, place) => sum + place.lng, 0) / places.length;

    return { lat: avgLat, lng: avgLng };
  }, [places]);

  // 특정 북마크 그룹 조회 및 상세 정보 가져오기
  const fetchBookmarkGroup = useCallback(async () => {
    if (!id) {
      console.error("그룹 ID가 없습니다.");
      return;
    }

    try {
      setIsLoadingStores(true);
      console.log("특정 북마크 그룹 조회 시작...");
      const response = await getBookmarkGroup(Number(id));
      console.log("특정 북마크 그룹 조회 응답:", response);

      if (response && response.group && response.group.stores) {
        // 모든 store id 수집
        const allStoreIds: number[] = [];
        response.group.stores.forEach((storeId) => {
          if (storeId) {
            allStoreIds.push(storeId);
          }
        });

        console.log("수집된 store id들:", allStoreIds);

        if (allStoreIds.length > 0) {
          // 각 store id에 대해 상세 정보 조회 (병렬 처리)
          const storeDetailsPromises = allStoreIds.map(async (storeId) => {
            try {
              console.log(`Store ${storeId} 상세 정보 조회 중...`);
              const storeDetail = await getStoreDetails(storeId);
              return storeDetail;
            } catch (error) {
              console.error(`Store ${storeId} 상세 정보 조회 실패:`, error);
              return null;
            }
          });

          // 모든 Promise 완료 대기
          const storeDetails = await Promise.all(storeDetailsPromises);

          // null이 아닌 결과만 필터링
          const validStoreDetails = storeDetails.filter(
            (detail) => detail !== null
          );

          console.log("조회된 store 상세 정보들:", validStoreDetails);
          console.log(
            "성공적으로 조회된 store 개수:",
            validStoreDetails.length
          );

          setAllBookmarkPlaces(validStoreDetails);
        } else {
          console.log("저장된 store가 없음");
          setAllBookmarkPlaces([]);
        }
      } else {
        console.log("응답에 group이 없거나 비어있음:", response);
        setAllBookmarkPlaces([]);
      }
    } catch (error) {
      console.error("특정 북마크 그룹 조회 실패:", error);
      setAllBookmarkPlaces([]);
    } finally {
      setIsLoadingStores(false);
    }
  }, [getBookmarkGroup, getStoreDetails, id]);

  useEffect(() => {
    fetchBookmarkGroup();
  }, [fetchBookmarkGroup]);

  const handlePlaceClick = (placeId: string) => {
    navigate(`/main/place/${placeId}`, {
      state: { from: "bookmark" },
    });
  };

  const handleBackClick = () => {
    navigate("/bookmark");
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
              mapContainerStyle={{ width: "100%", height: "100%" }}
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
                styles: [
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }],
                  },
                  { featureType: "transit", stylers: [{ visibility: "off" }] },
                ],
              }}
            >
              {places.map((place) => (
                <Marker
                  key={place.id}
                  position={{ lat: place.lat, lng: place.lng }}
                  icon={createEmojiMarker(unicode, {
                    size: 40,
                    backgroundColor: "#ffffff",
                    borderColor: "#1976d2",
                    borderWidth: 3,
                  })}
                  title={place.name}
                  onClick={() => handlePlaceClick(place.id)}
                />
              ))}
            </GoogleMap>
          )}
        </MapContainer>
      </MapBackground>

      <BackButton onClick={handleBackClick} aria-label="뒤로 가기">
        <PiArrowLeft size={20} color="#333" />
      </BackButton>

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
            <Header>
              <Emoji role="img" aria-label="folder emoji">{unifiedToEmoji(unicode)}</Emoji>
              <div className="Title__H2">{title}</div>
            </Header>
            <PlaceCount>
              {isLoadingStores ? "로딩 중..." : `${places.length}개 장소`}
            </PlaceCount>
          </TitleContainer>

          <FolderDetailList
            places={places}
            onPlaceClick={handlePlaceClick}
            showHeader={false}
          />
        </BottomSheetContainer>
      </BottomSheet>
    </PageContainer>
  );
}
