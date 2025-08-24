import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import styled from "styled-components";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import UserIconUrl from "../../Images/Marker/User.svg";
import RestaurantIconUrl from "../../Images/Marker/Restaurant.svg";
import CafeIconUrl from "../../Images/Marker/Cafe.svg";
import MartIconUrl from "../../Images/Marker/Mart.svg";
import HealthcareIconUrl from "../../Images/Marker/Healthcare.svg";
import EducationIconUrl from "../../Images/Marker/Education.svg";
import AcommodationIconUrl from "../../Images/Marker/Acommodation.svg";
import ConvenienceIconUrl from "../../Images/Marker/Convenience.svg";
import FashionIconUrl from "../../Images/Marker/Fashion.svg";
import MapListBottomSheet from "../../Components/MapList/MapListBottomSheet";
import MarkerInfoBottomSheet from "../../Components/MarkerInfoBottomSheet";
import { MdMyLocation } from "react-icons/md";
import { useStoreApi } from "../../hooks/useApi";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";
import CustomAlert from "../../Components/Modal/CustomAlert";

const PageContainer = styled.div`
  display: flex;
  width: 100%;
`;

const MapWrapper = styled.div`
  position: relative;
  width: 100%;
  height: calc(100svh - 80px);
  overflow: hidden;
`;

const LocateFab = styled.button`
  position: absolute;
  top: 40px;
  right: 12px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--neutral-200);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  z-index: 1600;

  &:hover { background: var(--neutral-100); }
  &:active { background: var(--neutral-100-2); }
`;

const defaultCenter = { lat: 37.5665, lng: 126.978 };

const mapStyles = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
] as google.maps.MapTypeStyle[];

type LatLngLiteral = google.maps.LatLngLiteral;
type MarkerCategory = "음식점" | "카페" | "마트슈퍼" | "의료기관" | "교육문구" | "숙박" | "생활편의" | "의류잡화" | "체육시설" | "주유소" | "기타";

type StoreMarker = {
  id: string;
  position: LatLngLiteral;
  category: MarkerCategory | "기타";
  name: string;
  address: string;
  images: string[];
  rating: number;
  reviewCount: number;
  userReviews: any[];
  googleReviews: any[];
};

export default function Map(): React.JSX.Element {
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showAlert = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setAlertConfig({ isOpen: true, title, message, type });
  };

  const { isLoaded, loadError, apiKey } = useGoogleMaps((message) => {
    showAlert("Google Maps API 오류", message, "error");
  });

  const { getNearbyStores, getStoreDetails, nearbyStoresState } = useStoreApi();

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<LatLngLiteral>(defaultCenter);
  const [userPosition, setUserPosition] = useState<LatLngLiteral | null>(null);
  const [storeMarkers, setStoreMarkers] = useState<StoreMarker[]>([]);
  
  const [showReSearch, setShowReSearch] = useState<boolean>(false);
  const [selectedMarker, setSelectedMarker] = useState<StoreMarker | null>(null);

  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const isLoadingLocation = useRef<boolean>(false);
  const lastSearchCenterRef = useRef<LatLngLiteral | null>(null);
  const userInteractingRef = useRef<boolean>(false);
  
  const renderErrorUI = () => {
    if (!loadError) return null;
    
    return (
      <PageContainer>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2> 지도를 불러올 수 없습니다</h2>
          <p style={{ margin: '20px 0', color: '#666' }}>
            Google Maps API 로딩에 실패했습니다.
          </p>
          <div style={{ 
            backgroundColor: '#fff5f5', 
            border: '1px solid #fed7d7', 
            borderRadius: '8px', 
            padding: '20px',
            margin: '20px 0',
            maxWidth: '400px'
          }}>
            <h3> 해결 방법</h3>
            <ul style={{ textAlign: 'left', margin: '10px 0' }}>
              <li>광고 차단기(AdBlock, uBlock)를 비활성화</li>
              <li>개인정보 보호 확장 프로그램 비활성화</li>
              <li>시크릿 모드로 접속</li>
              <li>페이지 새로고침</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            다시 시도
          </button>
        </div>
      </PageContainer>
    );
  };

  const ICON_SIZE = 36;

  const icons = useMemo(() => {
    if (!isLoaded || !window.google) return null;
    const buildIcon = (url: string, size = ICON_SIZE): google.maps.Icon => ({
      url,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size / 2, size / 2),
      origin: new google.maps.Point(0, 0),
    });

    return {
      byCategory: {
        "음식점": buildIcon(RestaurantIconUrl, ICON_SIZE),
        "카페": buildIcon(CafeIconUrl, ICON_SIZE),
        "마트슈퍼": buildIcon(MartIconUrl, ICON_SIZE),
        "의료기관": buildIcon(HealthcareIconUrl, ICON_SIZE),
        "교육문구": buildIcon(EducationIconUrl, ICON_SIZE),
        "숙박": buildIcon(AcommodationIconUrl, ICON_SIZE),
        "생활편의": buildIcon(ConvenienceIconUrl, ICON_SIZE),
        "의류잡화": buildIcon(FashionIconUrl, ICON_SIZE),
        "체육시설": buildIcon(RestaurantIconUrl, ICON_SIZE),
        "주유소": buildIcon(RestaurantIconUrl, ICON_SIZE),
        "기타": buildIcon(RestaurantIconUrl, ICON_SIZE),
      } as Record<MarkerCategory | "기타", google.maps.Icon>,
    };
  }, [isLoaded]);

  const getIcon = useCallback(
    (category: MarkerCategory | "기타"): google.maps.Icon | undefined => {
      if (!icons) return undefined;
      return icons.byCategory[category] ?? icons.byCategory["음식점"];
    },
    [icons]
  );

  const getGPSLocation = useCallback((): Promise<{ position: LatLngLiteral; accuracy: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log(" 브라우저가 Geolocation을 지원하지 않습니다");
        resolve(null);
        return;
      }

      console.log(" GPS 위치 요청 시작...");
      
      const options = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000
      };
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(" GPS 위치 정보:", position);
          
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const accuracy = position.coords.accuracy;
          
          console.log("위도:", latitude);
          console.log("경도:", longitude);
          console.log("정확도:", accuracy, "미터");
          
          const gpsPos = { lat: latitude, lng: longitude };
          console.log("GPS 위치 성공:", gpsPos);
          resolve({ position: gpsPos, accuracy });
        },
        (error) => {
          console.log("GPS 위치 실패:", error.message);
          console.log("GPS 에러 코드:", error.code);
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.log("사용자가 위치 권한을 거부했습니다");
              break;
            case error.POSITION_UNAVAILABLE:
              console.log("위치 정보를 사용할 수 없습니다 (GPS 신호 약함 또는 차단됨)");
              console.log("해결 방법: 실외로 이동하거나 GPS 설정 확인");
              break;
            case error.TIMEOUT:
              console.log("위치 요청 시간이 초과되었습니다");
              break;
            default:
              console.log("알 수 없는 GPS 에러가 발생했습니다");
          }
          
          resolve(null);
        },
        options
      );
    });
  }, []);

  const getGoogleGeolocation = useCallback(async (): Promise<{ position: LatLngLiteral; accuracy: number } | null> => {
    if (!apiKey) {
      console.log("Google Maps API 키가 없습니다");
      return null;
    }

    try {
      console.log("Google Geolocation API 요청 시작...");
      
      const wifiAccessPoints: any[] = [];
      if ('wifi' in navigator) {
        console.log("Wi-Fi 정보 수집 시도...");
      }

      const cellTowers: any[] = [];
      
      const requestBody = {
        wifiAccessPoints,
        cellTowers,
      };

      const response = await fetch(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        throw new Error(`Google Geolocation API 오류: ${response.status}`);
      }

      const data = await response.json();
      console.log("Google Geolocation API 응답:", data);

      if (data.location) {
        const position = {
          lat: data.location.lat,
          lng: data.location.lng
        };
        const accuracy = data.accuracy || 1000;

        console.log("Google 위도:", position.lat);
        console.log("Google 경도:", position.lng);
        console.log("Google 정확도:", accuracy, "미터");

        return { position, accuracy };
      }

      return null;
    } catch (error) {
      console.log("Google Geolocation API 실패:", error);
      return null;
    }
  }, [apiKey]);

  const fetchNearbyStores = useCallback(async (position: LatLngLiteral) => {
    try {
      console.log("주변 가맹점 조회 시작...");
      const stores = await getNearbyStores({
        lng: position.lng,
        lat: position.lat,
        radius: 500,
        limit: 5
      });
      
      console.log("가게 상세 정보 조회 시작...");
      
      const detailedMarkers: StoreMarker[] = await Promise.all(
        stores.map(async (store) => {
          try {
            const placeDetails = await getStoreDetails(store.id);
            
            return {
              id: store.id.toString(),
              position: { lat: store.lat, lng: store.lng },
              category: (store.category as MarkerCategory) || "기타" as MarkerCategory,
              name: store.name,
              address: placeDetails.formattedAddress || store.sigungu,
              images: placeDetails.photos ? placeDetails.photos.map(photo => photo.url) : [
                "https://picsum.photos/200/300?random=1",
                "https://picsum.photos/200/300?random=2",
                "https://picsum.photos/200/300?random=3"
              ],
              rating: placeDetails.rating || 0,
              reviewCount: placeDetails.reviewCount || 0,
              userReviews: [],
              googleReviews: []
            };
          } catch (error) {
            console.log(`가게 ${store.id} 상세 정보 조회 실패:`, error);
            return {
              id: store.id.toString(),
              position: { lat: store.lat, lng: store.lng },
              category: "기타" as MarkerCategory,
              name: store.name,
              address: store.sigungu,
              images: [
                "https://picsum.photos/200/300?random=1",
                "https://picsum.photos/200/300?random=2",
                "https://picsum.photos/200/300?random=3"
              ],
              rating: 0,
              reviewCount: 0,
              userReviews: [],
              googleReviews: []
            };
          }
        })
      );
      
      setStoreMarkers(detailedMarkers);
      console.log("주변 가맹점 상세 정보 조회 완료:", detailedMarkers.length, "개");
    } catch (error) {
      console.error("주변 가맹점 조회 실패:", error);
      
      if (error instanceof Error && error.message.includes('403')) {
        console.log("API 접근이 일시적으로 제한되었습니다. 잠시 후 다시 시도해주세요.");
        
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.log("토큰이 없습니다. 로그인이 필요합니다.");
        } else {
          console.log("토큰이 있지만 403 오류가 발생했습니다. 토큰이 만료되었을 수 있습니다.");
        }
      }
      
      setStoreMarkers([]);
    }
  }, [getNearbyStores, getStoreDetails]);

  const getDistanceMeters = useCallback((a: LatLngLiteral, b: LatLngLiteral): number => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const sinDLat = Math.sin(dLat / 2);
    const sinDLng = Math.sin(dLng / 2);
    const aHarv = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
    const c = 2 * Math.atan2(Math.sqrt(aHarv), Math.sqrt(1 - aHarv));
    return R * c;
  }, []);

  const getCurrentLocation = useCallback(async () => {
    if (isLoadingLocation.current) {
      console.log("위치 요청이 이미 진행 중입니다");
      return;
    }
    
    isLoadingLocation.current = true;
    console.log("=== 위치 요청 시작 ===");
    
    try {
      console.log("브라우저 Geolocation 시도...");
      const gpsResult = await getGPSLocation();
      
      if (gpsResult && gpsResult.accuracy < 100) {
        console.log("브라우저 GPS 위치 사용 (고정밀):", gpsResult.position, "정확도:", gpsResult.accuracy, "m");
        setUserPosition(gpsResult.position);
        setCenter(gpsResult.position);
        map?.panTo(gpsResult.position);
        map?.setZoom(17);
        setShowReSearch(false);
        
        await fetchNearbyStores(gpsResult.position);
        return;
      }

      if (!gpsResult || gpsResult.accuracy >= 100) {
        console.log("Google Geolocation API 시도...");
        const googleResult = await getGoogleGeolocation();
        
        if (googleResult) {
          console.log("Google Geolocation API 위치 사용:", googleResult.position, "정확도:", googleResult.accuracy, "m");
          setUserPosition(googleResult.position);
          setCenter(googleResult.position);
          map?.panTo(googleResult.position);
          map?.setZoom(17);
          setShowReSearch(false);
          
          await fetchNearbyStores(googleResult.position);
          return;
        }
      }

      console.log("모든 위치 서비스로 위치를 가져오지 못했습니다");
    } finally {
      isLoadingLocation.current = false;
    }
  }, [map, getGPSLocation, getGoogleGeolocation, fetchNearbyStores]);

  const handleSearchThisArea = useCallback(async () => {
    if (!map) return;
    const centerLatLng = map.getCenter();
    if (!centerLatLng) return;
    const c: LatLngLiteral = { lat: centerLatLng.lat(), lng: centerLatLng.lng() };
    lastSearchCenterRef.current = c;
    setShowReSearch(false);

    await fetchNearbyStores(c);
  }, [map, fetchNearbyStores]);

  const handleMapLoad = useCallback((m: google.maps.Map) => {
    setMap(m);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get('lat');
    const lng = urlParams.get('lng');
    
    if (lat && lng && map) {
      const latValue = parseFloat(lat);
      const lngValue = parseFloat(lng);
      
      if (isNaN(latValue) || isNaN(lngValue) || 
          latValue < -90 || latValue > 90 || 
          lngValue < -180 || lngValue > 180) {
        console.error('유효하지 않은 좌표값:', { lat, lng });
        if (map) {
          getCurrentLocation();
        }
        return;
      }
      
      const markerPosition = { 
        lat: latValue, 
        lng: lngValue 
      };
      
      console.log('마커 위치로 이동:', markerPosition);
      setCenter(markerPosition);
      map.panTo(markerPosition);
      map.setZoom(15);
      setShowReSearch(false);
      
      fetchNearbyStores(markerPosition);
      return;
    }
    
    if (map) {
      getCurrentLocation();
    }
  }, [map]);

  useEffect(() => {
    if (!map || !isLoaded || storeMarkers.length === 0) return;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const newMarkers = storeMarkers.map(store => {
      const marker = new google.maps.Marker({
        position: store.position,
        icon: getIcon(store.category),
        title: store.name,
        map: map
      });

       marker.addListener('click', () => {
         setSelectedMarker(store);
       });

      return marker;
    });

    markersRef.current = newMarkers;

    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }

    clustererRef.current = new MarkerClusterer({
      map,
      markers: newMarkers,
      renderer: {
        render: ({ count, position }) => {
          return new google.maps.Marker({
            position,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#1976d2" stroke="#fff" stroke-width="2"/>
                  <text x="20" y="26" text-anchor="middle" fill="white" font-size="14" font-weight="bold">${count}</text>
                </svg>
              `),
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 20)
            }
          });
        }
      }
    });
  }, [map, isLoaded, storeMarkers, getIcon]);

  const renderBody = () => {
    if (!isLoaded) {
      return (
        <div style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100svh' }}>
          <p className="Body__Default" style={{ color: 'var(--neutral-600)' }}>
            지도를 불러오는 중입니다...
          </p>
        </div>
      );
    }

    return (
      <MapWrapper>
        <GoogleMap
          onLoad={handleMapLoad}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={12}
          options={{
            styles: mapStyles,
            clickableIcons: false,
            disableDefaultUI: true,
            zoomControl: true,
            controlSize: 28,
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
          }}
                     onDragStart={() => { userInteractingRef.current = true; }}
           onIdle={() => {
             const mc = map?.getCenter();
             if (!mc) return;
             const currentCenter: LatLngLiteral = { lat: mc.lat(), lng: mc.lng() };
             if (userInteractingRef.current) {
               const base = lastSearchCenterRef.current ?? userPosition ?? center;
               const moved = getDistanceMeters(base, currentCenter);
               setShowReSearch(moved > 150);
             }
             userInteractingRef.current = false;
           }}
        >
          {userPosition && (
            <Marker
              position={userPosition}
              icon={{
                url: UserIconUrl,
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 20)
              }}
              zIndex={9999}
            />
          )}
        </GoogleMap>

        <LocateFab aria-label="현재 위치로 이동" onClick={() => getCurrentLocation()}>
          <MdMyLocation size={22} color="var(--neutral-800)" />
        </LocateFab>

        <MapListBottomSheet 
          onLocationRequest={getCurrentLocation}
          onSearchThisArea={handleSearchThisArea}
          showReSearch={showReSearch}
          storeMarkers={storeMarkers}
          bottomOffsetPx={0}
          userLocation={userPosition}
        />

        <MarkerInfoBottomSheet
          $isVisible={!!selectedMarker}
          onClose={() => setSelectedMarker(null)}
          placeInfo={selectedMarker ? {
            id: selectedMarker.id,
            name: selectedMarker.name,
            address: selectedMarker.address,
            category: selectedMarker.category,
            rating: selectedMarker.rating,
            reviewCount: selectedMarker.reviewCount,
            images: selectedMarker.images,
            userReviews: selectedMarker.userReviews,
            googleReviews: selectedMarker.googleReviews,
            lat: selectedMarker.position.lat,
            lng: selectedMarker.position.lng
          } : null}
        />
      </MapWrapper>
    );
  };

  return (
    <PageContainer>
      {renderErrorUI()}
      {renderBody()}

      <CustomAlert
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </PageContainer>
  );
}

