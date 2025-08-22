import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import UserIconUrl from "../Images/Marker/User.svg";
import RestaurantIconUrl from "../Images/Marker/Restaurant.svg";
import CafeIconUrl from "../Images/Marker/Cafe.svg";
import MartIconUrl from "../Images/Marker/Mart.svg";
import HealthcareIconUrl from "../Images/Marker/Healthcare.svg";
import EducationIconUrl from "../Images/Marker/Education.svg";
import AcommodationIconUrl from "../Images/Marker/Acommodation.svg";
import ConvenienceIconUrl from "../Images/Marker/Convenience.svg";
import FashionIconUrl from "../Images/Marker/Fashion.svg";
import MapListBottomSheet from "../Components/MapListBottomSheet";
import { MdMyLocation } from "react-icons/md";

const LIBRARIES: ("places")[] = ["places"];

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
};

export default function Map(): React.JSX.Element {
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ?? "";

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    language: "ko",
    region: "KR",
    libraries: LIBRARIES,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<LatLngLiteral>(defaultCenter);
  const [userPosition, setUserPosition] = useState<LatLngLiteral | null>(null);
  const [storeMarkers, setStoreMarkers] = useState<StoreMarker[]>([]);
  
  const [showReSearch, setShowReSearch] = useState<boolean>(false);

  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const controlAddedRef = useRef<boolean>(false);
  const isLoadingLocation = useRef<boolean>(false);
  const lastSearchCenterRef = useRef<LatLngLiteral | null>(null);
  const userInteractingRef = useRef<boolean>(false);
  

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
        console.log("❌ 브라우저가 Geolocation을 지원하지 않습니다");
        resolve(null);
        return;
      }

      console.log("🔄 GPS 위치 요청 시작...");
      
      const options = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000
      };
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("📍 GPS 위치 정보:", position);
          
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const accuracy = position.coords.accuracy;
          
          console.log("🌍 위도:", latitude);
          console.log("🌍 경도:", longitude);
          console.log("🎯 정확도:", accuracy, "미터");
          
          const gpsPos = { lat: latitude, lng: longitude };
          console.log("✅ GPS 위치 성공:", gpsPos);
          resolve({ position: gpsPos, accuracy });
        },
        (error) => {
          console.log("❌ GPS 위치 실패:", error.message);
          console.log("❌ GPS 에러 코드:", error.code);
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.log("❌ 사용자가 위치 권한을 거부했습니다");
              break;
            case error.POSITION_UNAVAILABLE:
              console.log("❌ 위치 정보를 사용할 수 없습니다 (GPS 신호 약함 또는 차단됨)");
              console.log("💡 해결 방법: 실외로 이동하거나 GPS 설정 확인");
              break;
            case error.TIMEOUT:
              console.log("❌ 위치 요청 시간이 초과되었습니다");
              break;
            default:
              console.log("❌ 알 수 없는 GPS 에러가 발생했습니다");
          }
          
          resolve(null);
        },
        options
      );
    });
  }, []);

  // Google Geolocation API 추가
  const getGoogleGeolocation = useCallback(async (): Promise<{ position: LatLngLiteral; accuracy: number } | null> => {
    if (!apiKey) {
      console.log("❌ Google Maps API 키가 없습니다");
      return null;
    }

    try {
      console.log("🔄 Google Geolocation API 요청 시작...");
      
      // Wi-Fi 정보 수집 (가능한 경우)
      const wifiAccessPoints: any[] = [];
      if ('wifi' in navigator) {
        // Wi-Fi 정보가 있다면 수집 (실제로는 제한적)
        console.log("📶 Wi-Fi 정보 수집 시도...");
      }

      // 셀 타워 정보 (모바일에서만 가능)
      const cellTowers: any[] = [];
      
      const requestBody = {
        wifiAccessPoints,
        cellTowers,
        // IP 기반 위치도 포함
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
      console.log("📍 Google Geolocation API 응답:", data);

      if (data.location) {
        const position = {
          lat: data.location.lat,
          lng: data.location.lng
        };
        const accuracy = data.accuracy || 1000; // 기본 정확도 1km

        console.log("🌍 Google 위도:", position.lat);
        console.log("🌍 Google 경도:", position.lng);
        console.log("🎯 Google 정확도:", accuracy, "미터");

        return { position, accuracy };
      }

      return null;
    } catch (error) {
      console.log("❌ Google Geolocation API 실패:", error);
      return null;
    }
  }, [apiKey]);

  const getCurrentLocation = useCallback(async () => {
    if (isLoadingLocation.current) {
      console.log("⚠️ 위치 요청이 이미 진행 중입니다");
      return;
    }
    
    isLoadingLocation.current = true;
    console.log("=== 위치 요청 시작 ===");
    
    try {
      // 1. 먼저 브라우저 geolocation 시도
      console.log("🔄 브라우저 Geolocation 시도...");
      const gpsResult = await getGPSLocation();
      
      if (gpsResult && gpsResult.accuracy < 100) {
        console.log("✅ 브라우저 GPS 위치 사용 (고정밀):", gpsResult.position, "정확도:", gpsResult.accuracy, "m");
        setUserPosition(gpsResult.position);
        setCenter(gpsResult.position);
        map?.panTo(gpsResult.position);
        map?.setZoom(16);
        setShowReSearch(false);
        return;
      }

      // 2. 브라우저 geolocation 실패 시 Google Geolocation API 시도
      if (!gpsResult || gpsResult.accuracy >= 100) {
        console.log("🔄 Google Geolocation API 시도...");
        const googleResult = await getGoogleGeolocation();
        
        if (googleResult) {
          console.log("✅ Google Geolocation API 위치 사용:", googleResult.position, "정확도:", googleResult.accuracy, "m");
          setUserPosition(googleResult.position);
          setCenter(googleResult.position);
          map?.panTo(googleResult.position);
          map?.setZoom(16);
          setShowReSearch(false);
          return;
        }
      }

      console.log("❌ 모든 위치 서비스로 위치를 가져오지 못했습니다");
    } finally {
      isLoadingLocation.current = false;
    }
  }, [map, getGPSLocation, getGoogleGeolocation]);

  

  const handleMapLoad = useCallback((m: google.maps.Map) => {
    setMap(m);
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  

  

  useEffect(() => {
    const mockStores: StoreMarker[] = [
      { id: "1", position: { lat: 37.5665, lng: 126.978 }, category: "음식점", name: "맛있는 음식점", address: "서울시 강남구" },
      { id: "2", position: { lat: 37.5666, lng: 126.979 }, category: "카페", name: "커피숍", address: "서울시 강남구" },
      { id: "3", position: { lat: 37.5667, lng: 126.980 }, category: "마트슈퍼", name: "편의점", address: "서울시 강남구" },
      { id: "4", position: { lat: 37.5668, lng: 126.981 }, category: "의료기관", name: "병원", address: "서울시 강남구" },
      { id: "5", position: { lat: 37.5669, lng: 126.982 }, category: "교육문구", name: "피자집", address: "서울시 강남구" },
      { id: "6", position: { lat: 37.5670, lng: 126.983 }, category: "숙박", name: "디저트카페", address: "서울시 강남구" },
      { id: "7", position: { lat: 37.5671, lng: 126.984 }, category: "생활편의", name: "마트", address: "서울시 강남구" },
      { id: "8", position: { lat: 37.5672, lng: 126.985 }, category: "의류잡화", name: "약국", address: "서울시 강남구" },
      { id: "9", position: { lat: 37.5673, lng: 126.986 }, category: "체육시설", name: "약국", address: "서울시 강남구" },
      { id: "10", position: { lat: 37.5674, lng: 126.987 }, category: "주유소", name: "약국", address: "서울시 강남구" },
      { id: "11", position: { lat: 37.5675, lng: 126.988 }, category: "기타", name: "약국", address: "서울시 강남구" },
    ];
    setStoreMarkers(mockStores);
  }, []);

  // 현재 지도 중심과 마지막 검색 중심 간 거리(m) 계산
  const getDistanceMeters = useCallback((a: LatLngLiteral, b: LatLngLiteral): number => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371000; // m
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

  // 이 지역에서 검색 동작: 현재 지도 중심 기준 목데이터 재생성
  const handleSearchThisArea = useCallback(() => {
    if (!map) return;
    const centerLatLng = map.getCenter();
    if (!centerLatLng) return;
    const c: LatLngLiteral = { lat: centerLatLng.lat(), lng: centerLatLng.lng() };
    lastSearchCenterRef.current = c;
    setShowReSearch(false);

    // 중심 기준 랜덤 목데이터 생성
    const gen = (count: number): StoreMarker[] => {
      const cats: MarkerCategory[] = ["음식점", "카페", "마트슈퍼", "의료기관", "교육문구", "숙박", "생활편의", "의류잡화"];
      const arr: StoreMarker[] = [];
      for (let i = 0; i < count; i++) {
        const latOffset = (Math.random() - 0.5) * 0.01; // ~1km 범위
        const lngOffset = (Math.random() - 0.5) * 0.01;
        const category = cats[Math.floor(Math.random() * cats.length)];
        arr.push({
          id: `${Date.now()}_${i}`,
          position: { lat: c.lat + latOffset, lng: c.lng + lngOffset },
          category,
          name: `${category} 샘플 ${i + 1}`,
          address: "서울시 샘플구 샘플로",
        });
      }
      return arr;
    };
    setStoreMarkers(gen(12));
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
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; font-size: 14px;">${store.name}</h3>
              <p style="margin: 0; font-size: 12px; color: #666;">${store.address}</p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #999;">${store.category}</p>
            </div>
          `
        });
        infoWindow.open(map, marker);
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
    if (loadError) {
      return (
        <div style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100svh' }}>
          <p className="Body__Default" style={{ color: 'var(--error-600)' }}>
            지도를 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      );
    }

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
            // 사용자 드래그 후에만 판단
            if (userInteractingRef.current) {
              const base = lastSearchCenterRef.current ?? userPosition ?? center;
              const moved = getDistanceMeters(base, currentCenter);
              setShowReSearch(moved > 150); // 150m 이상 이동 시 표시
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
        />
      </MapWrapper>
    );
  };

  return (
    <PageContainer>
      {renderBody()}
    </PageContainer>
  );
}

